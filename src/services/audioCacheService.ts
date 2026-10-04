/**
 * Client-Side Audio Cache Service for High-Fidelity Podcast Playback
 *
 * Ensures:
 * 1. Zero network latency on repeats, rewinds, and seek navigation.
 * 2. Immutable audio identity (same speaker + voice + text always plays the exact same audio).
 * 3. Significant bandwidth reduction & instant responsiveness.
 */

interface CachedAudioItem {
  audioData: string;
  durationSeconds: number;
  speakerId: string;
  voiceId: string;
  format: string;
  timestamp: number;
}

class AudioCacheService {
  private memoryCache = new Map<string, CachedAudioItem>();
  private readonly MAX_ITEMS = 300; // Keep up to 300 audio sentences in memory

  /**
   * Generates a deterministic cache key
   */
  public generateKey(
    podcastId: string,
    sentenceId: string,
    speakerId: string,
    voiceId: string,
    text: string
  ): string {
    const cleanPodcast = (podcastId || 'ep').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const cleanSentence = (sentenceId || 's').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const cleanSpeaker = (speakerId || 'spk').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const cleanVoice = (voiceId || 'kore').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const textHash = this.simpleHash(text || '');
    return `${cleanPodcast}_${cleanSentence}_${cleanSpeaker}_${cleanVoice}_${textHash}`;
  }

  public get(key: string): CachedAudioItem | null {
    const item = this.memoryCache.get(key);
    if (item) {
      return item;
    }

    // Try reading from sessionStorage if available
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const raw = sessionStorage.getItem(`ac_${key}`);
        if (raw) {
          const parsed = JSON.parse(raw) as CachedAudioItem;
          this.memoryCache.set(key, parsed);
          return parsed;
        }
      } catch {
        // Ignore storage errors
      }
    }

    return null;
  }

  public set(
    key: string,
    audioData: string,
    durationSeconds: number,
    speakerId: string,
    voiceId: string,
    format: string = 'audio/wav'
  ): void {
    if (!key || !audioData) return;

    // Manage memory cache size
    if (this.memoryCache.size >= this.MAX_ITEMS) {
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }

    const item: CachedAudioItem = {
      audioData,
      durationSeconds: Math.max(1, durationSeconds || 1),
      speakerId,
      voiceId,
      format,
      timestamp: Date.now(),
    };

    this.memoryCache.set(key, item);

    // Save to sessionStorage (capped to avoid quota exceed)
    if (typeof window !== 'undefined' && window.sessionStorage && audioData.length < 500000) {
      try {
        sessionStorage.setItem(`ac_${key}`, JSON.stringify(item));
      } catch {
        // Session storage quota might be exceeded, memory cache still works
      }
    }
  }

  public has(key: string): boolean {
    return this.memoryCache.has(key);
  }

  public clear(): void {
    this.memoryCache.clear();
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          if (k && k.startsWith('ac_')) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => sessionStorage.removeItem(k));
      } catch {}
    }
  }

  private simpleHash(str: string): string {
    let hash = 0;
    const clean = str.trim().toLowerCase();
    for (let i = 0; i < clean.length; i++) {
      const char = clean.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

export const audioCacheService = new AudioCacheService();
