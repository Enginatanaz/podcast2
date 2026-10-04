import React from 'react';
import { X, Play, Headphones, BookOpen, Clock, CheckCircle2, Volume2, Sparkles } from 'lucide-react';
import { Podcast, Keyword } from '../types';
import { audioService } from '../services/audioService';

interface PodcastDetailModalProps {
  podcast: Podcast;
  onClose: () => void;
  onStartLearning: (podcast: Podcast) => void;
  onStartListening: (podcast: Podcast) => void;
  onWordClick: (word: Keyword, podcastTitle: string) => void;
  onViewValidation?: (podcast: Podcast) => void;
}

export const PodcastDetailModal: React.FC<PodcastDetailModalProps> = ({
  podcast,
  onClose,
  onStartLearning,
  onStartListening,
  onWordClick,
  onViewValidation,
}) => {
  // Extract all distinct keywords
  const allKeywords = React.useMemo(() => {
    const map = new Map<string, Keyword>();
    podcast.transcript.forEach((s) => {
      s.keywords.forEach((k) => {
        if (!map.has(k.word.toLowerCase())) {
          map.set(k.word.toLowerCase(), k);
        }
      });
    });
    return Array.from(map.values());
  }, [podcast]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-500 text-stone-950">
              {podcast.level}
            </span>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {podcast.category}
            </span>
            {podcast.format && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {podcast.format}
              </span>
            )}
            {podcast.validationReport && (
              <button
                type="button"
                onClick={() => onViewValidation?.(podcast)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 transition"
              >
                <span>🛡️ {podcast.validationReport.overallScore}% Verified</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cover & Main Info */}
        <div className="mt-4 flex items-start gap-4">
          <div
            className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${podcast.coverGradient} flex items-center justify-center text-4xl text-white shadow-lg shrink-0`}
          >
            {podcast.icon}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
              {podcast.title}
            </h2>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {podcast.titleTr}
            </p>
            <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {podcast.duration} min
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                {allKeywords.length} key words
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {podcast.description}
        </p>
        <p className="mt-1 text-xs text-stone-400 italic">
          {podcast.descriptionTr}
        </p>

        {/* What you'll learn */}
        <div className="mt-5 bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 border border-stone-100 dark:border-stone-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            What you'll learn
          </h3>
          <ul className="space-y-2">
            {podcast.whatYoullLearn.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 dark:text-stone-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Vocabulary tags */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Key Vocabulary (Tap to explore)
            </h3>
            <span className="text-[11px] text-stone-400">
              {allKeywords.length} words
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allKeywords.map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  audioService.speakSingleWord(kw.word);
                  onWordClick(kw, podcast.title);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-stone-800 dark:text-stone-200 hover:border-amber-400 hover:scale-102 transition text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <span>{kw.word}</span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-normal">
                  ({kw.meaning})
                </span>
                <Volume2 className="w-3 h-3 text-stone-400 ml-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => onStartLearning(podcast)}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            ▶ Start Learning
          </button>
          <button
            type="button"
            onClick={() => onStartListening(podcast)}
            className="sm:w-36 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Headphones className="w-4 h-4 text-stone-500" />
            Listen Only
          </button>
        </div>
      </div>
    </div>
  );
};
