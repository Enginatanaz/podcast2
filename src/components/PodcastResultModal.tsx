import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Home,
  BookOpen,
  Volume2,
  Clock,
  Flame,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Podcast, Keyword, Sentence } from '../types';
import { audioService } from '../services/audioService';

interface PodcastResultModalProps {
  podcast: Podcast;
  quizScore: number;
  onClose: () => void;
  onGoHome: () => void;
  onReplayPodcast: () => void;
}

export const PodcastResultModal: React.FC<PodcastResultModalProps> = ({
  podcast,
  quizScore,
  onClose,
  onGoHome,
  onReplayPodcast,
}) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewWordIndex, setReviewWordIndex] = useState(0);

  // Scores
  const listeningScore = 92;
  const vocabularyScore = 88;
  const speakingScore = 80;
  const overallScore = Math.round(
    quizScore * 0.4 + listeningScore * 0.25 + vocabularyScore * 0.2 + speakingScore * 0.15
  );

  // Mastery tier
  let masteryBadge = {
    label: '🟢 Mastered',
    color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
    description: 'You have a solid command of this lesson!',
  };

  if (overallScore < 60) {
    masteryBadge = {
      label: '🔴 Practice Again',
      color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800',
      description: 'Good effort! One more pass will solidify these concepts.',
    };
  } else if (overallScore < 80) {
    masteryBadge = {
      label: '🟡 Review Recommended',
      color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800',
      description: 'Almost mastered! Reviewing key words will boost retention.',
    };
  }

  // Keywords to review
  const allKeywords = podcast.transcript.flatMap((s) => s.keywords);
  const reviewWords: Keyword[] = allKeywords.slice(0, 3);
  const grammarFocus = podcast.grammarTargets?.[0] || 'Simple Present & Daily Phrases';
  const oxfordWordsList = podcast.oxfordWords || allKeywords.slice(0, 4).map((k) => k.word);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 flex flex-col max-h-[92vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {!isReviewOpen ? (
          <div className="space-y-5">
            {/* Header celebration */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-stone-900 dark:text-white font-serif tracking-tight">
                🎉 Well Done!
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                "{podcast.title}" completed
              </p>

              {/* Mastery Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full text-xs font-bold border ${masteryBadge.color}`}
              >
                <span>{masteryBadge.label}</span>
                <span className="font-normal opacity-80">({overallScore}%)</span>
              </div>
            </div>

            {/* Post-Podcast Learning Report Card (Section 31 requirement) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/60 dark:border-stone-700/60 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Learning Report
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  {podcast.level} · {podcast.duration} min
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* You Learned */}
                <div className="flex items-start justify-between">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">You learned:</span>
                  <span className="font-bold text-stone-900 dark:text-white text-right">
                    {allKeywords.length} new words ({oxfordWordsList.length} Oxford 3000)
                  </span>
                </div>

                {/* You Practiced */}
                <div className="flex items-start justify-between">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">You practiced:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400 text-right">
                    {grammarFocus}
                  </span>
                </div>

                {/* You Heard */}
                <div className="flex items-start justify-between">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">You heard:</span>
                  <span className="font-bold text-stone-900 dark:text-white text-right">
                    {podcast.transcript.length} authentic spoken sentences
                  </span>
                </div>

                {/* Review Words */}
                <div className="flex items-start justify-between">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">To review:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400 text-right">
                    {reviewWords.length} words
                  </span>
                </div>

                {/* Listening Score */}
                <div className="flex items-start justify-between pt-1 border-t border-stone-200/50 dark:border-stone-700/50">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">Listening Score:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    {listeningScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/50">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Listening</div>
                <div className="text-sm font-extrabold text-stone-900 dark:text-white mt-0.5">{listeningScore}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/50">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Vocab</div>
                <div className="text-sm font-extrabold text-stone-900 dark:text-white mt-0.5">{vocabularyScore}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/50">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Quiz</div>
                <div className="text-sm font-extrabold text-stone-900 dark:text-white mt-0.5">{quizScore}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/50">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">Speaking</div>
                <div className="text-sm font-extrabold text-stone-900 dark:text-white mt-0.5">{speakingScore}%</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={onGoHome}
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(true)}
                  className="py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Review Words
                </button>
                <button
                  type="button"
                  onClick={onReplayPodcast}
                  className="py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Replay Lesson
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Mini Flashcard Review Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-500 uppercase">
                Word Review ({reviewWordIndex + 1} / {reviewWords.length})
              </span>
              <button
                onClick={() => setIsReviewOpen(false)}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400"
              >
                Done
              </button>
            </div>

            {reviewWords[reviewWordIndex] && (
              <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-3">
                <div className="text-2xl font-bold text-stone-900 dark:text-white">
                  {reviewWords[reviewWordIndex].word}
                </div>
                <div className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  {reviewWords[reviewWordIndex].meaning}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                  "{reviewWords[reviewWordIndex].example}"
                </p>
                <button
                  onClick={() => audioService.speakSingleWord(reviewWords[reviewWordIndex].word)}
                  className="p-2 rounded-full bg-white dark:bg-stone-800 shadow-xs text-amber-600 hover:scale-105 transition"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                disabled={reviewWordIndex === 0}
                onClick={() => setReviewWordIndex((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (reviewWordIndex < reviewWords.length - 1) {
                    setReviewWordIndex((prev) => prev + 1);
                  } else {
                    setIsReviewOpen(false);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold"
              >
                {reviewWordIndex < reviewWords.length - 1 ? 'Next Word →' : 'Finish Review'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
