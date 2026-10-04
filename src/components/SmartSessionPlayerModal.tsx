import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Headphones,
  BookOpen,
  Volume2,
  Trophy,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ListeningSession,
  Podcast,
  Keyword,
  SessionSummaryData,
  SavedWord,
} from '../types';
import { audioService } from '../services/audioService';
import { SessionService } from '../services/sessionService';

interface SmartSessionPlayerModalProps {
  session: ListeningSession;
  onClose: () => void;
  onFinishSession: (summary: SessionSummaryData) => void;
  onSaveWord: (keyword: Keyword, podcastTitle: string, podcastId: string) => void;
  savedWords: SavedWord[];
}

export const SmartSessionPlayerModal: React.FC<SmartSessionPlayerModalProps> = ({
  session,
  onClose,
  onFinishSession,
  onSaveWord,
  savedWords,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [showTurkish, setShowTurkish] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [completedPodcastIds, setCompletedPodcastIds] = useState<string[]>([]);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);
  const [countdownToNext, setCountdownToNext] = useState<number | null>(null);
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState<number>(0);

  const activePodcast: Podcast = session.podcasts[currentIdx] || session.podcasts[0];

  // Auto-scroll transcript container
  const transcriptRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to audio state
  useEffect(() => {
    audioService.setSpeed(speed);
    const unsubscribe = audioService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentSentenceIdx(state.currentSentenceIndex);

      // Auto-advance if podcast truly finished playing its audio
      if (
        state.isCompleted &&
        activePodcast.transcript.length > 0
      ) {
        handlePodcastEnded();
      }
    });

    return () => {
      unsubscribe();
      audioService.stop();
    };
  }, [currentIdx, activePodcast]);

  // Session timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSessionElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Scroll active sentence into view
  useEffect(() => {
    if (transcriptRef.current) {
      const activeEl = transcriptRef.current.querySelector(
        `[data-sentence-index="${currentSentenceIdx}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentSentenceIdx]);

  // Start playing current podcast
  const playPodcast = async (startIdx = 0) => {
    try {
      audioService.loadPodcast(
        activePodcast.id,
        activePodcast.transcript.map((s) => ({
          id: s.id,
          text: s.text,
          speaker: s.speaker,
          speakerId: s.speakerId,
          voiceId: s.voiceId,
          gender: s.gender,
          estimatedDuration: s.estimatedDuration,
        })),
        activePodcast.speakerProfiles,
        startIdx
      );
      audioService.play();
    } catch (e) {
      console.warn('Playback error:', e);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioService.pause();
    } else {
      if (audioService.getCurrentIndex() >= activePodcast.transcript.length - 1) {
        playPodcast(0);
      } else {
        audioService.resume();
      }
    }
  };

  const handlePodcastEnded = () => {
    if (!completedPodcastIds.includes(activePodcast.id)) {
      setCompletedPodcastIds((prev) => [...prev, activePodcast.id]);
    }

    // Check if there are more podcasts
    if (currentIdx < session.podcasts.length - 1) {
      setCountdownToNext(3);
      const countdownInterval = setInterval(() => {
        setCountdownToNext((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            advanceToNextPodcast();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Entire session finished!
      setIsSessionFinished(true);
      audioService.stop();
    }
  };

  const advanceToNextPodcast = () => {
    setCountdownToNext(null);
    const nextIdx = currentIdx + 1;
    if (nextIdx < session.podcasts.length) {
      setCurrentIdx(nextIdx);
      setCurrentSentenceIdx(0);
      // Automatically begin playback of next episode
      setTimeout(() => {
        audioService.playPodcast(session.podcasts[nextIdx].transcript, 0);
      }, 500);
    }
  };

  const handlePrevPodcast = () => {
    if (currentIdx > 0) {
      audioService.stop();
      setCurrentIdx(currentIdx - 1);
      setCurrentSentenceIdx(0);
    }
  };

  const handleNextPodcast = () => {
    if (currentIdx < session.podcasts.length - 1) {
      audioService.stop();
      advanceToNextPodcast();
    } else {
      setIsSessionFinished(true);
    }
  };

  const handleSpeedToggle = () => {
    const nextSpeed = speed === 0.75 ? 1.0 : speed === 1.0 ? 1.25 : 0.75;
    setSpeed(nextSpeed);
    audioService.setSpeed(nextSpeed);
  };

  const handleFinishSummary = () => {
    const summary = SessionService.createSummary(session);
    onFinishSession(summary);
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // If session is complete, render celebration summary screen!
  if (isSessionFinished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-10 h-10 text-white animate-bounce" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              🎉 Session Complete!
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white font-serif">
              {session.sessionName} Finished
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Outstanding work! You completed your planned listening target without interruption.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                {session.totalDurationFormatted}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Listening</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {session.podcasts.length}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Episodes</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                +{session.podcasts.length * 3}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Words Heard</div>
            </div>
          </div>

          {/* Episodes List in Finished Session */}
          <div className="text-left space-y-2 max-h-44 overflow-y-auto pr-1">
            <div className="text-xs font-bold uppercase text-stone-400 dark:text-stone-500">
              Completed Episodes ({session.podcasts.length})
            </div>
            {session.podcasts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/50 dark:border-stone-700/40 text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{p.title}</span>
                </div>
                <span className="text-stone-400">{p.duration}m</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleFinishSummary}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-base shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[94vh] flex flex-col bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Top Session Progress Banner */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              🎧
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {session.targetMinutes}-Minute English · {session.level}
              </div>
              <div className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                <span>Episode {currentIdx + 1} of {session.podcasts.length}</span>
                <span className="text-stone-400 text-xs">({session.totalDurationFormatted} planned)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-stone-800 text-stone-300 border border-stone-700">
              {session.mode === 'relaxed' ? 'Relaxed' : 'Learning'}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition"
              title="Close session"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Podcast Title Bar */}
        <div className="px-5 py-3 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{activePodcast.icon}</span>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white font-serif">
                {activePodcast.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {activePodcast.titleTr} · {activePodcast.category} · {activePodcast.level}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTurkish(!showTurkish)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                showTurkish
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
              }`}
            >
              🇹🇷 {showTurkish ? 'Hide TR' : 'Show TR'}
            </button>
          </div>
        </div>

        {/* Countdown Banner if transitioning */}
        {countdownToNext !== null && (
          <div className="bg-amber-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-pulse">
            <span>Next episode starting in {countdownToNext} seconds...</span>
            <button
              onClick={advanceToNextPodcast}
              className="underline font-extrabold hover:text-stone-900"
            >
              Play Now →
            </button>
          </div>
        )}

        {/* Middle: Transcript View (or Relaxed Mode Visualizer) */}
        <div
          ref={transcriptRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-white dark:bg-stone-900"
        >
          {session.mode === 'relaxed' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 animate-pulse">
                {activePodcast.icon}
              </div>
              <div className="max-w-md">
                <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                  Relaxed Immersion Mode
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  Sit back, listen to the natural spoken English, and absorb rhythm and pronunciation effortlessly.
                </p>
              </div>

              {/* Current Active Sentence Banner */}
              <div className="w-full max-w-lg p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-left space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {activePodcast.transcript[currentSentenceIdx]?.speaker || 'English'}
                </div>
                <div className="text-base font-semibold text-stone-900 dark:text-white">
                  {activePodcast.transcript[currentSentenceIdx]?.text}
                </div>
                {showTurkish && (
                  <div className="text-xs text-stone-500 dark:text-stone-400 italic pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
                    {activePodcast.transcript[currentSentenceIdx]?.translation}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Full interactive transcript for Learning Session
            activePodcast.transcript.map((sentence, idx) => {
              const isActive = idx === currentSentenceIdx;
              return (
                <div
                  key={sentence.id}
                  data-sentence-index={idx}
                  onClick={() => audioService.playSingleSentence(sentence)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 shadow-sm ring-2 ring-amber-500/20'
                      : 'border-stone-100 dark:border-stone-800 hover:border-stone-200 dark:hover:border-stone-700 bg-stone-50/40 dark:bg-stone-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {sentence.speaker || `Line ${idx + 1}`}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold animate-pulse">
                        <Volume2 className="w-3.5 h-3.5" /> Playing
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-medium text-stone-900 dark:text-white leading-relaxed">
                    {sentence.text}
                  </p>

                  {showTurkish && sentence.translation && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic">
                      {sentence.translation}
                    </p>
                  )}

                  {/* Keywords chips */}
                  {sentence.keywords && sentence.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
                      {sentence.keywords.map((kw, kidx) => {
                        const isSaved = savedWords.some((w) => w.word.toLowerCase() === kw.word.toLowerCase());
                        return (
                          <button
                            key={kidx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSaveWord(kw, activePodcast.title, activePodcast.id);
                            }}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border flex items-center gap-1 transition ${
                              isSaved
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                            }`}
                          >
                            <span>{kw.word}</span>
                            <span className="text-[10px] text-stone-400">· {kw.meaning}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Player Controls Bottom Bar */}
        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-3">
          {/* Progress Bar of current podcast */}
          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span>{currentSentenceIdx + 1} / {activePodcast.transcript.length}</span>
            <div className="flex-1 h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentSentenceIdx + 1) / Math.max(activePodcast.transcript.length, 1)) * 100}%`,
                }}
              />
            </div>
            <span>{activePodcast.duration}m</span>
          </div>

          {/* Central Controls */}
          <div className="flex items-center justify-between">
            {/* Speed toggle */}
            <button
              onClick={handleSpeedToggle}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title="Change playback speed"
            >
              {speed}x
            </button>

            {/* Play / Next / Prev */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevPodcast}
                disabled={currentIdx === 0}
                className="p-2 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                title="Previous podcast"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handlePlayPause}
                className="w-13 h-13 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white flex items-center justify-center shadow-md hover:shadow-lg transition transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button
                onClick={handleNextPodcast}
                className="p-2 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-white transition"
                title={currentIdx < session.podcasts.length - 1 ? 'Next podcast' : 'Complete session'}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Session Info button */}
            <div className="text-right">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {session.podcasts.length - currentIdx} left
              </div>
              <div className="text-[10px] text-stone-400">
                Session total: {session.totalDurationFormatted}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
