import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Volume2,
  CheckCircle,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { Podcast, Sentence, Keyword } from '../types';
import { audioService } from '../services/audioService';

interface PodcastPlayerProps {
  podcast: Podcast;
  initialSentenceIndex?: number;
  onBack: () => void;
  onSwitchToLearnMode: () => void;
  onOpenWordPopover: (keyword: Keyword) => void;
  onOpenQuiz: () => void;
  onOpenSpeakingPartner: () => void;
  onSentenceCompleteProgress: (sentenceIndex: number, total: number) => void;
  onViewValidation?: (podcast: Podcast) => void;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({
  podcast,
  initialSentenceIndex = 0,
  onBack,
  onSwitchToLearnMode,
  onOpenWordPopover,
  onOpenQuiz,
  onOpenSpeakingPartner,
  onSentenceCompleteProgress,
  onViewValidation,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialSentenceIndex);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(podcast.durationSeconds || 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speed, setSpeed] = useState<number>(podcast.level === 'A1' ? 0.75 : 1.0);
  const [showTurkishHints, setShowTurkishHints] = useState<Record<string, boolean>>({});
  const [globalTurkishHint, setGlobalTurkishHint] = useState(false);
  const [audioQualityStatus, setAudioQualityStatus] = useState<string>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const activeSentenceRef = useRef<HTMLDivElement>(null);

  const formatTime = (secs: number): string => {
    const s = Math.max(0, Math.floor(secs));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Initialize podcast in audio service with immutable speaker identity
  useEffect(() => {
    audioService.loadPodcast(
      podcast.id,
      podcast.transcript.map((s) => ({
        id: s.id,
        text: s.text,
        speaker: s.speaker,
        speakerId: s.speakerId,
        voiceId: s.voiceId,
        gender: s.gender,
        estimatedDuration: s.estimatedDuration,
      })),
      podcast.speakerProfiles,
      initialSentenceIndex
    );
    audioService.setSpeed(speed);

    const unsubscribe = audioService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentIndex(state.currentSentenceIndex);
      setCurrentTime(state.currentTime);
      if (state.totalDuration > 0) {
        setTotalDuration(state.totalDuration);
      }
      setIsCompleted(state.isCompleted);
      setAudioQualityStatus(state.audioQualityStatus);
      setErrorMessage(state.errorMessage || null);
      onSentenceCompleteProgress(state.currentSentenceIndex, podcast.transcript.length);
    });

    return () => {
      unsubscribe();
      audioService.stop();
    };
  }, [podcast, initialSentenceIndex]);

  // Auto-scroll active sentence into view
  useEffect(() => {
    if (activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentIndex]);

  const handleTogglePlay = () => {
    audioService.togglePlay();
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1.0, 1.25];
    const nextSpeed = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(nextSpeed);
    audioService.setSpeed(nextSpeed);
  };

  const handleSeekSentence = (index: number) => {
    audioService.jumpToSentence(index);
  };

  const handleReplaySentence = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.replayCurrentSentence();
  };

  const toggleSentenceHint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTurkishHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Render text with clickable keywords
  const renderSentenceWithKeywords = (sentence: Sentence) => {
    let parts: React.ReactNode[] = [];
    const text = sentence.text;
    const keywords = sentence.keywords || [];

    if (keywords.length === 0) {
      return <span>{text}</span>;
    }

    // Build regex to match keywords
    const escapedWords = keywords
      .map((k) => k.word.trim())
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);

    if (escapedWords.length === 0) return <span>{text}</span>;

    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = regex.lastIndex;
      const matchedWord = match[0];

      if (matchStart > lastIndex) {
        parts.push(text.slice(lastIndex, matchStart));
      }

      const keywordObj = keywords.find(
        (k) => k.word.toLowerCase() === matchedWord.toLowerCase()
      );

      parts.push(
        <button
          key={`kw-${matchStart}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (keywordObj) {
              onOpenWordPopover(keywordObj);
            }
          }}
          className="inline-block px-1 py-0.5 mx-0.5 font-bold rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-b-2 border-amber-400 dark:border-amber-500 hover:bg-amber-200 dark:hover:bg-amber-900 transition cursor-pointer"
          title="Click to view meaning & save"
        >
          {matchedWord}
        </button>
      );

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-xl mx-auto bg-stone-50 dark:bg-stone-950">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={onBack}
          className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center min-w-0 px-2 flex-1">
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-500 text-stone-950">
              {podcast.level}
            </span>
            <span className="text-xs text-stone-400">{podcast.category}</span>
          </div>
          <h2 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
            {podcast.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onSwitchToLearnMode}
          className="px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 transition"
          title="Switch to Sentence-by-Sentence Learn Mode"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Learn Mode</span>
        </button>
      </div>

      {/* Global Turkish Hint Toggle banner */}
      <div className="px-4 py-2 bg-stone-100 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-stone-500 dark:text-stone-400 font-medium">
            Sentence {currentIndex + 1} of {podcast.transcript.length}
          </span>
          {podcast.validationReport && (
            <button
              type="button"
              onClick={() => onViewValidation?.(podcast)}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 transition"
              title="Click to view Content Quality & Grammar Validation Audit"
            >
              <span>🛡️ {podcast.validationReport.overallScore}% Verified</span>
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setGlobalTurkishHint(!globalTurkishHint)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold transition ${
            globalTurkishHint
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
          }`}
        >
          <span>🇹🇷</span>
          <span>{globalTurkishHint ? 'Türkçe Açık' : 'Türkçe İpuçları'}</span>
        </button>
      </div>

      {/* Synchronized Transcript View */}
      <div
        ref={transcriptContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
      >
        {podcast.transcript.map((sentence, idx) => {
          const isActive = idx === currentIndex;
          const isHintRevealed = globalTurkishHint || showTurkishHints[sentence.id];

          return (
            <div
              key={sentence.id}
              ref={isActive ? activeSentenceRef : null}
              onClick={() => handleSeekSentence(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-white dark:bg-stone-900 border-amber-500 ring-2 ring-amber-500/20 shadow-md scale-101'
                  : 'bg-white/60 dark:bg-stone-900/50 border-stone-200/70 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isActive
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {sentence.speaker || `Speaker ${idx + 1}`}
                </span>

                <div className="flex items-center gap-2">
                  {isActive && (
                    <button
                      type="button"
                      onClick={handleReplaySentence}
                      className="p-1 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                      title="Replay sentence"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => toggleSentenceHint(sentence.id, e)}
                    className="text-[11px] font-semibold text-stone-400 hover:text-amber-600 transition flex items-center gap-1"
                  >
                    <span>🇹🇷</span>
                    <span>{isHintRevealed ? 'Gizle' : 'İpucu'}</span>
                  </button>
                </div>
              </div>

              {/* English Text */}
              <div
                className={`text-base sm:text-lg leading-relaxed ${
                  isActive
                    ? 'font-bold text-stone-900 dark:text-stone-100'
                    : 'text-stone-700 dark:text-stone-300 font-normal'
                }`}
              >
                {renderSentenceWithKeywords(sentence)}
              </div>

              {/* Turkish Hint (Revealed on click or global) */}
              {isHintRevealed && (
                <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400/90 italic animate-in fade-in duration-150">
                  {sentence.translation}
                </div>
              )}
            </div>
          );
        })}

        {/* End of Podcast Actions */}
        <div className="pt-6 pb-2 text-center space-y-3">
          <div className="w-12 h-1 bg-stone-200 dark:bg-stone-800 rounded-full mx-auto" />
          <p className="text-xs font-semibold text-stone-400">
            {isCompleted ? '🎉 Podcast Completed! Ready to test and speak?' : 'Scroll through transcript or listen continuously'}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={onOpenSpeakingPartner}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              AI Speaking Partner
            </button>
            <button
              type="button"
              onClick={onOpenQuiz}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Take Quick Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Audio Player Bar */}
      <div className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 px-4 py-3 shadow-xl">
        {/* Progress Bar & Real Time Display */}
        <div className="mb-3">
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const fraction = Math.max(0, Math.min(1, clickX / rect.width));
              audioService.seekToTime(fraction * totalDuration);
            }}
            className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden cursor-pointer relative"
            title="Click to seek"
          >
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-150"
              style={{
                width: `${totalDuration > 0 ? Math.min(100, (currentTime / totalDuration) * 100) : 0}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 mt-1 px-0.5">
            <span>{formatTime(currentTime)}</span>
            <div className="flex items-center gap-1.5">
              <span>{formatTime(totalDuration)}</span>
              <span className="text-stone-300 dark:text-stone-600">(-{formatTime(Math.max(0, totalDuration - currentTime))})</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Speed Toggle */}
          <button
            type="button"
            onClick={handleSpeedChange}
            className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition min-w-14 text-center cursor-pointer"
            title="Adjust Audio Speed"
          >
            {speed}x
          </button>

          {/* Primary transport buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => audioService.previousSentence()}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition cursor-pointer"
              title="Previous Sentence (-10s)"
            >
              <Rewind className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-13 h-13 rounded-full bg-amber-600 hover:bg-amber-500 active:scale-95 text-white flex items-center justify-center shadow-lg transition cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white translate-x-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => audioService.nextSentence()}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition cursor-pointer"
              title="Next Sentence (+10s)"
            >
              <FastForward className="w-5 h-5" />
            </button>
          </div>

          {/* Replay sentence */}
          <button
            type="button"
            onClick={handleReplaySentence}
            className="p-2 text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 transition cursor-pointer"
            title="Replay Current Sentence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
