import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'user-db.json');

export interface DBUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  createdAt: number;
  lastLoginAt: number;
}

export interface DBUserProgress {
  userId: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  onboardingCompleted: boolean;
  streak: number;
  lastActiveDate: string;
  dailyGoalCompleted: boolean;
  totalListeningSeconds: number;
  speakingAttempts: number;
  overallProgress: number; // 0 to 100
}

export interface DBUserWord {
  id: string;
  userId: string;
  word: string;
  meaning: string;
  example: string;
  podcastId: string;
  podcastTitle: string;
  addedAt: number;
  lastReviewedAt?: number;
  masteryStage: 'new' | 'learning' | 'familiar' | 'mastered';
  correctCount: number;
  incorrectCount: number;
}

export interface DBUserPodcastHistory {
  userId: string;
  podcastId: string;
  podcastTitle: string;
  progressPercent: number;
  sentenceIndex: number;
  totalSentences: number;
  completed: boolean;
  completedAt?: number;
  lastListenedAt: number;
  listeningScore?: number;
  vocabularyScore?: number;
  quizScore?: number;
  speakingScore?: number;
  overallScore?: number;
  status?: 'mastered' | 'review' | 'practice_again';
  listeningTimeSeconds: number;
}

export interface DBUserQuizHistory {
  id: string;
  userId: string;
  podcastId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: number;
}

export interface DBUserSpeakingHistory {
  id: string;
  userId: string;
  podcastId: string;
  score: number;
  accuracyScore: number;
  targetSentence: string;
  userSpokenText: string;
  completedAt: number;
}

export interface DBUserAIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  textTr?: string;
  correction?: string;
  correctionTr?: string;
  explanation?: string;
}

export interface DBUserSavedSentence {
  id: string;
  userId: string;
  sentenceId: string;
  text: string;
  translation: string;
  podcastId: string;
  podcastTitle: string;
  addedAt: number;
}

interface DatabaseSchema {
  users: DBUser[];
  user_progress: Record<string, DBUserProgress>;
  user_vocabulary: DBUserWord[];
  user_saved_sentences: DBUserSavedSentence[];
  user_saved_podcasts: Record<string, string[]>;
  user_notes: Record<string, string>;
  user_podcast_history: Record<string, DBUserPodcastHistory>;
  user_quiz_history: DBUserQuizHistory[];
  user_speaking_history: DBUserSpeakingHistory[];
  user_ai_chat_history: Record<string, DBUserAIChatMessage[]>;
  user_oxford_progress: Record<string, Record<string, any>>;
  user_curriculum_progress: Record<string, string[]>;
}

class ServerDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read user-db.json, reinitializing empty database', e);
    }

    // Initialize with 2 demonstrative users:
    // User A (Alex): Has some previous listening activity
    // User B (Sarah): Completely fresh user (0% everything, 0 words, 0 streak)
    const today = new Date().toISOString().split('T')[0];

    const initialDb: DatabaseSchema = {
      users: [
        {
          id: 'user-a',
          username: 'alex',
          displayName: 'Alex (User A)',
          email: 'alex@example.com',
          level: 'A1',
          createdAt: Date.now() - 86400000 * 3,
          lastLoginAt: Date.now(),
        },
        {
          id: 'user-b',
          username: 'sarah',
          displayName: 'Sarah (User B - New)',
          email: 'sarah@example.com',
          level: 'A1',
          createdAt: Date.now(),
          lastLoginAt: Date.now(),
        },
      ],
      user_progress: {
        // User A has 1 completed podcast and 2 saved words
        'user-a': {
          userId: 'user-a',
          level: 'A1',
          onboardingCompleted: true,
          streak: 1,
          lastActiveDate: today,
          dailyGoalCompleted: true,
          totalListeningSeconds: 240, // 4 mins
          speakingAttempts: 2,
          overallProgress: 18,
        },
        // User B has ABSOLUTELY ZERO (completely clean new user)
        'user-b': {
          userId: 'user-b',
          level: 'A1',
          onboardingCompleted: false,
          streak: 0,
          lastActiveDate: today,
          dailyGoalCompleted: false,
          totalListeningSeconds: 0,
          speakingAttempts: 0,
          overallProgress: 0,
        },
      },
      user_vocabulary: [
        // User A's words
        {
          id: 'w-a1',
          userId: 'user-a',
          word: 'coffee',
          meaning: 'kahve',
          example: 'I would like a coffee, please.',
          podcastId: 'at-the-cafe',
          podcastTitle: 'At the Café',
          addedAt: Date.now() - 86400000,
          masteryStage: 'learning',
          correctCount: 1,
          incorrectCount: 0,
        },
        {
          id: 'w-a2',
          userId: 'user-a',
          word: 'please',
          meaning: 'lütfen',
          example: 'Water, please.',
          podcastId: 'at-the-cafe',
          podcastTitle: 'At the Café',
          addedAt: Date.now() - 86400000,
          masteryStage: 'new',
          correctCount: 0,
          incorrectCount: 0,
        },
        // User B has 0 words
      ],
      user_podcast_history: {
        // User A completed At the Café
        'user-a_at-the-cafe': {
          userId: 'user-a',
          podcastId: 'at-the-cafe',
          podcastTitle: 'At the Café',
          progressPercent: 100,
          sentenceIndex: 9,
          totalSentences: 10,
          completed: true,
          completedAt: Date.now() - 86400000,
          lastListenedAt: Date.now() - 86400000,
          listeningScore: 90,
          vocabularyScore: 85,
          quizScore: 100,
          speakingScore: 80,
          overallScore: 90,
          status: 'mastered',
          listeningTimeSeconds: 240,
        },
        // User B has NO history
      },
      user_quiz_history: [
        {
          id: 'q-a1',
          userId: 'user-a',
          podcastId: 'at-the-cafe',
          score: 100,
          correctCount: 5,
          totalQuestions: 5,
          completedAt: Date.now() - 86400000,
        },
      ],
      user_saved_sentences: [],
      user_saved_podcasts: { 'user-a': ['at-the-cafe'], 'user-b': [] },
      user_notes: {},
      user_speaking_history: [],
      user_ai_chat_history: {},
      user_oxford_progress: {
        'user-a': {
          coffee: { word: 'coffee', status: 'mastered', seenCount: 3, masteredCount: 1, lastSeenAt: Date.now() - 86400000, podcastIds: ['at-the-cafe'] },
          morning: { word: 'morning', status: 'learning', seenCount: 1, masteredCount: 0, lastSeenAt: Date.now() - 86400000, podcastIds: ['at-the-cafe'] },
        },
        'user-b': {},
      },
      user_curriculum_progress: {
        'user-a': ['less-a1-2-1'],
        'user-b': [],
      },
    };

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write initial user-db.json', e);
    }

    return initialDb;
  }

  private save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist user-db.json', e);
    }
  }

  // --- USERS & AUTH ---

  public getUsers(): DBUser[] {
    return this.data.users;
  }

  public getUser(userId: string): DBUser | undefined {
    return this.data.users.find((u) => u.id === userId);
  }

  public createUser(
    username: string,
    displayName: string,
    email: string,
    level: 'A1' | 'A2' | 'B1' | 'B2' = 'A1'
  ): { user: DBUser; progress: DBUserProgress } {
    const existing = this.data.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      existing.lastLoginAt = Date.now();
      this.save();
      const prog = this.data.user_progress[existing.id] || this.createEmptyProgress(existing.id, existing.level);
      return { user: existing, progress: prog };
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newUser: DBUser = {
      id,
      username: username.toLowerCase().trim(),
      displayName: displayName.trim() || username,
      email: email.toLowerCase().trim(),
      level,
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
    };

    this.data.users.push(newUser);

    // Initial state for new user: ALL ZEROS!
    const newProgress = this.createEmptyProgress(id, level);
    this.data.user_progress[id] = newProgress;

    this.save();
    return { user: newUser, progress: newProgress };
  }

  private createEmptyProgress(userId: string, level: 'A1' | 'A2' | 'B1' | 'B2'): DBUserProgress {
    const today = new Date().toISOString().split('T')[0];
    return {
      userId,
      level,
      onboardingCompleted: false,
      streak: 0,
      lastActiveDate: today,
      dailyGoalCompleted: false,
      totalListeningSeconds: 0,
      speakingAttempts: 0,
      overallProgress: 0,
    };
  }

  // --- USER DATA FETCHING (WHERE userId = currentUser.id) ---

  public getUserData(userId: string) {
    const user = this.getUser(userId);
    if (!user) return null;

    let progress = this.data.user_progress[userId];
    if (!progress) {
      progress = this.createEmptyProgress(userId, user.level);
      this.data.user_progress[userId] = progress;
      this.save();
    }

    // Words strictly belonging to this user
    const savedWords = this.data.user_vocabulary.filter((w) => w.userId === userId);

    // Podcast histories strictly belonging to this user
    const userHistories = Object.values(this.data.user_podcast_history).filter(
      (h) => h.userId === userId
    );

    const completedPodcasts: Record<string, any> = {};
    const inProgressPodcasts: Record<string, any> = {};

    for (const h of userHistories) {
      if (h.completed) {
        completedPodcasts[h.podcastId] = h;
      } else {
        inProgressPodcasts[h.podcastId] = h;
      }
    }

    // Dynamic Overall Progress Calculation based ONLY on real activity:
    const completedCount = Object.keys(completedPodcasts).length;
    const wordCount = savedWords.length;
    const listeningMinutes = Math.floor(progress.totalListeningSeconds / 60);

    let calculatedOverall = 0;
    if (completedCount > 0 || wordCount > 0 || listeningMinutes > 0) {
      calculatedOverall = Math.min(
        100,
        Math.round(completedCount * 25 + wordCount * 2 + Math.min(20, listeningMinutes * 0.5))
      );
    }
    progress.overallProgress = calculatedOverall;

    // Saved sentences
    const savedSentences = (this.data.user_saved_sentences || []).filter(
      (s) => s.userId === userId
    );

    // Saved podcast IDs
    const savedPodcasts = (this.data.user_saved_podcasts || {})[userId] || [];

    // Notes mapped by podcastId
    const notes: Record<string, string> = {};
    if (this.data.user_notes) {
      for (const [key, note] of Object.entries(this.data.user_notes)) {
        if (key.startsWith(`${userId}_`)) {
          const pId = key.substring(userId.length + 1);
          notes[pId] = note;
        }
      }
    }

    return {
      user,
      progress,
      savedWords,
      savedSentences,
      savedPodcasts,
      notes,
      completedPodcasts,
      inProgressPodcasts,
      oxfordProgress: this.getOxfordProgress(userId),
      curriculumCompletedLessons: this.getCurriculumProgress(userId),
    };
  }

  // --- SAVED SENTENCES ---

  public saveSentence(
    userId: string,
    sentenceId: string,
    text: string,
    translation: string,
    podcastId: string,
    podcastTitle: string
  ): DBUserSavedSentence {
    if (!this.data.user_saved_sentences) {
      this.data.user_saved_sentences = [];
    }

    const existing = this.data.user_saved_sentences.find(
      (s) => s.userId === userId && s.sentenceId === sentenceId
    );
    if (existing) return existing;

    const newSaved: DBUserSavedSentence = {
      id: `sent-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      sentenceId,
      text,
      translation,
      podcastId,
      podcastTitle,
      addedAt: Date.now(),
    };

    this.data.user_saved_sentences.unshift(newSaved);
    this.save();
    return newSaved;
  }

  public removeSentence(userId: string, sentenceId: string): boolean {
    if (!this.data.user_saved_sentences) return false;
    const lenBefore = this.data.user_saved_sentences.length;
    this.data.user_saved_sentences = this.data.user_saved_sentences.filter(
      (s) => !(s.userId === userId && (s.sentenceId === sentenceId || s.id === sentenceId))
    );
    const removed = this.data.user_saved_sentences.length < lenBefore;
    if (removed) this.save();
    return removed;
  }

  // --- BOOKMARKS & NOTES ---

  public toggleSavePodcast(userId: string, podcastId: string): boolean {
    if (!this.data.user_saved_podcasts) {
      this.data.user_saved_podcasts = {};
    }
    const list = this.data.user_saved_podcasts[userId] || [];
    const index = list.indexOf(podcastId);
    let isSaved = false;

    if (index >= 0) {
      list.splice(index, 1);
      isSaved = false;
    } else {
      list.push(podcastId);
      isSaved = true;
    }

    this.data.user_saved_podcasts[userId] = list;
    this.save();
    return isSaved;
  }

  public saveNote(userId: string, podcastId: string, note: string): string {
    if (!this.data.user_notes) {
      this.data.user_notes = {};
    }
    const key = `${userId}_${podcastId}`;
    this.data.user_notes[key] = note;
    this.save();
    return note;
  }

  public getNote(userId: string, podcastId: string): string {
    if (!this.data.user_notes) return '';
    return this.data.user_notes[`${userId}_${podcastId}`] || '';
  }

  public updateUserOnboarding(userId: string, level: 'A1' | 'A2' | 'B1' | 'B2') {
    const progress = this.data.user_progress[userId] || this.createEmptyProgress(userId, level);
    progress.level = level;
    progress.onboardingCompleted = true;
    // CRITICAL: Selecting level does NOT create artificial progress! Stays 0!
    this.data.user_progress[userId] = progress;

    const user = this.getUser(userId);
    if (user) {
      user.level = level;
    }

    this.save();
    return progress;
  }

  public updateUserLevel(userId: string, level: 'A1' | 'A2' | 'B1' | 'B2') {
    const progress = this.data.user_progress[userId] || this.createEmptyProgress(userId, level);
    progress.level = level;
    this.data.user_progress[userId] = progress;

    const user = this.getUser(userId);
    if (user) {
      user.level = level;
    }

    this.save();
    return progress;
  }

  public updateInProgress(
    userId: string,
    podcastId: string,
    podcastTitle: string,
    sentenceIndex: number,
    totalSentences: number
  ) {
    const key = `${userId}_${podcastId}`;
    const percent = Math.min(100, Math.round(((sentenceIndex + 1) / totalSentences) * 100));

    const existing = this.data.user_podcast_history[key];
    if (existing && existing.completed) {
      return existing; // already completed
    }

    const history: DBUserPodcastHistory = {
      userId,
      podcastId,
      podcastTitle,
      progressPercent: percent,
      sentenceIndex,
      totalSentences,
      completed: false,
      lastListenedAt: Date.now(),
      listeningTimeSeconds: existing ? existing.listeningTimeSeconds + 15 : 15,
    };

    this.data.user_podcast_history[key] = history;
    this.save();
    return history;
  }

  public completePodcast(
    userId: string,
    payload: {
      podcastId: string;
      podcastTitle: string;
      listeningScore: number;
      vocabularyScore: number;
      quizScore: number;
      speakingScore: number;
      overallScore: number;
      status: 'mastered' | 'review' | 'practice_again';
      listeningTimeSeconds: number;
    }
  ) {
    const key = `${userId}_${payload.podcastId}`;
    const history: DBUserPodcastHistory = {
      userId,
      podcastId: payload.podcastId,
      podcastTitle: payload.podcastTitle,
      progressPercent: 100,
      sentenceIndex: 999,
      totalSentences: 999,
      completed: true,
      completedAt: Date.now(),
      lastListenedAt: Date.now(),
      listeningScore: payload.listeningScore,
      vocabularyScore: payload.vocabularyScore,
      quizScore: payload.quizScore,
      speakingScore: payload.speakingScore,
      overallScore: payload.overallScore,
      status: payload.status,
      listeningTimeSeconds: payload.listeningTimeSeconds,
    };

    this.data.user_podcast_history[key] = history;

    // Update progress
    const progress = this.data.user_progress[userId] || this.createEmptyProgress(userId, 'A1');
    progress.dailyGoalCompleted = true;
    progress.totalListeningSeconds += payload.listeningTimeSeconds;

    const today = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== today) {
      progress.streak += 1;
      progress.lastActiveDate = today;
    } else if (progress.streak === 0) {
      progress.streak = 1;
    }

    this.save();
    return this.getUserData(userId);
  }

  // --- VOCABULARY (user-scoped) ---

  public saveWord(
    userId: string,
    word: string,
    meaning: string,
    example: string,
    podcastId: string,
    podcastTitle: string
  ): DBUserWord {
    const existing = this.data.user_vocabulary.find(
      (w) => w.userId === userId && w.word.toLowerCase() === word.toLowerCase()
    );

    if (existing) {
      return existing;
    }

    const newWord: DBUserWord = {
      id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      word,
      meaning,
      example,
      podcastId,
      podcastTitle,
      addedAt: Date.now(),
      masteryStage: 'new',
      correctCount: 0,
      incorrectCount: 0,
    };

    this.data.user_vocabulary.unshift(newWord);
    this.save();
    return newWord;
  }

  public removeWord(userId: string, wordId: string): boolean {
    const initialLen = this.data.user_vocabulary.length;
    this.data.user_vocabulary = this.data.user_vocabulary.filter(
      (w) => !(w.userId === userId && w.id === wordId)
    );
    const removed = this.data.user_vocabulary.length < initialLen;
    if (removed) this.save();
    return removed;
  }

  public reviewWord(userId: string, wordId: string, known: boolean): DBUserWord | null {
    const word = this.data.user_vocabulary.find((w) => w.userId === userId && w.id === wordId);
    if (!word) return null;

    word.lastReviewedAt = Date.now();
    if (known) {
      word.correctCount += 1;
      if (word.correctCount >= 5) {
        word.masteryStage = 'mastered';
      } else if (word.correctCount >= 3) {
        word.masteryStage = 'familiar';
      } else {
        word.masteryStage = 'learning';
      }
    } else {
      word.incorrectCount += 1;
      word.masteryStage = 'learning';
    }

    this.save();
    return word;
  }

  // --- AI CHAT MEMORY (strictly user-scoped) ---

  public getAIChat(userId: string, podcastId: string): DBUserAIChatMessage[] {
    const key = `${userId}_${podcastId}`;
    return this.data.user_ai_chat_history[key] || [];
  }

  public saveAIChat(userId: string, podcastId: string, messages: DBUserAIChatMessage[]) {
    if (!this.data.user_ai_chat_history) {
      this.data.user_ai_chat_history = {};
    }
    const key = `${userId}_${podcastId}`;
    this.data.user_ai_chat_history[key] = messages;
    this.save();
    return this.data.user_ai_chat_history[key];
  }

  // --- OXFORD 3000 PROGRESS (strictly user-scoped) ---
  public getOxfordProgress(userId: string): Record<string, any> {
    if (!this.data.user_oxford_progress) this.data.user_oxford_progress = {};
    return this.data.user_oxford_progress[userId] || {};
  }

  public updateOxfordWord(userId: string, word: string, status: string, podcastId?: string): any {
    if (!this.data.user_oxford_progress) this.data.user_oxford_progress = {};
    if (!this.data.user_oxford_progress[userId]) this.data.user_oxford_progress[userId] = {};

    const cleanWord = word.toLowerCase().trim();
    const existing = this.data.user_oxford_progress[userId][cleanWord] || {
      word: cleanWord,
      status: 'seen',
      seenCount: 0,
      masteredCount: 0,
      lastSeenAt: Date.now(),
      podcastIds: [],
    };

    existing.status = status;
    existing.seenCount = (existing.seenCount || 0) + 1;
    if (status === 'mastered') {
      existing.masteredCount = (existing.masteredCount || 0) + 1;
    }
    existing.lastSeenAt = Date.now();
    if (podcastId && !existing.podcastIds.includes(podcastId)) {
      existing.podcastIds.push(podcastId);
    }

    this.data.user_oxford_progress[userId][cleanWord] = existing;
    this.save();
    return existing;
  }

  // --- CURRICULUM PROGRESS (strictly user-scoped) ---
  public getCurriculumProgress(userId: string): string[] {
    if (!this.data.user_curriculum_progress) this.data.user_curriculum_progress = {};
    return this.data.user_curriculum_progress[userId] || [];
  }

  public completeCurriculumLesson(userId: string, lessonId: string): string[] {
    if (!this.data.user_curriculum_progress) this.data.user_curriculum_progress = {};
    if (!this.data.user_curriculum_progress[userId]) this.data.user_curriculum_progress[userId] = [];

    if (!this.data.user_curriculum_progress[userId].includes(lessonId)) {
      this.data.user_curriculum_progress[userId].push(lessonId);
      this.save();
    }
    return this.data.user_curriculum_progress[userId];
  }
}

export const serverDb = new ServerDatabase();
