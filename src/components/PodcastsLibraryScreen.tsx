import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, Clock, BookOpen, ChevronRight, Play, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Podcast, Category, CEFRLevel, UserProgress, ContentFormat } from '../types';

interface PodcastsLibraryScreenProps {
  podcasts: Podcast[];
  userProgress: UserProgress;
  onSelectPodcast: (podcast: Podcast) => void;
  onOpenAIGenerator: () => void;
  onViewValidation?: (podcast: Podcast) => void;
}

export const PodcastsLibraryScreen: React.FC<PodcastsLibraryScreenProps> = ({
  podcasts,
  userProgress,
  onSelectPodcast,
  onOpenAIGenerator,
  onViewValidation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');

  const levels = ['All', 'A1', 'A2', 'B1', 'B2'];
  const categories: Array<Category | 'All'> = [
    'All',
    'Daily Life',
    'Real Life',
    'Work',
    'Interests',
    'Food',
    'Travel',
    'Social',
    'Real Conversations',
  ];

  const formats: Array<ContentFormat | 'All'> = [
    'All',
    'Dialogue',
    'Short Story',
    'Interview',
    'Personal Story',
    'Mini News',
    'Problem & Solution',
    'Real-Life Scenario',
  ];

  const filtered = useMemo(() => {
    return podcasts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.titleTr.toLowerCase().includes(q) ||
        p.topic?.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.transcript.some((t) => t.text.toLowerCase().includes(q));

      const matchesLevel = selectedLevel === 'All' || p.level === selectedLevel;
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesFormat = selectedFormat === 'All' || p.format === selectedFormat;

      return matchesSearch && matchesLevel && matchesCat && matchesFormat;
    });
  }, [podcasts, searchQuery, selectedLevel, selectedCategory, selectedFormat]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Generator CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2 font-serif">
            <span>🎧</span>
            <span>Podcast Library</span>
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {podcasts.length} verified lessons across A1–B2 levels & 12+ real-life categories
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAIGenerator}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Engine</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, topic, format (e.g. café, interview, airport, A1)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        {levels.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setSelectedLevel(lvl)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shrink-0 ${
              selectedLevel === lvl
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-300'
            }`}
          >
            {lvl === 'All' ? 'All Levels' : `Level ${lvl}`}
          </button>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
              selectedCategory === cat
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                : 'bg-stone-100 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Format Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
          Format:
        </span>
        {formats.map((fmt) => (
          <button
            key={fmt}
            type="button"
            onClick={() => setSelectedFormat(fmt)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition shrink-0 ${
              selectedFormat === fmt
                ? 'bg-stone-800 text-stone-100 dark:bg-stone-200 dark:text-stone-900'
                : 'bg-white dark:bg-stone-900 text-stone-500 border border-stone-200 dark:border-stone-800 hover:border-stone-300'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Podcasts List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
            <p className="text-stone-500 text-sm">No podcasts match this filter.</p>
            <button
              type="button"
              onClick={onOpenAIGenerator}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-200 dark:border-amber-800"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate an episode for this filter
            </button>
          </div>
        ) : (
          filtered.map((pod) => {
            const isCompleted = Boolean(userProgress.completedPodcasts?.[pod.id]);
            const inProgress = userProgress.inProgressPodcasts?.[pod.id];

            return (
              <div
                key={pod.id}
                onClick={() => onSelectPodcast(pod)}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-400/80 p-4 rounded-2xl shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pod.coverGradient} flex items-center justify-center text-xl text-white shadow-xs shrink-0`}
                    >
                      {pod.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                          {pod.level}
                        </span>
                        <span className="text-[10px] text-stone-400 truncate">
                          {pod.category}
                        </span>
                        {pod.format && (
                          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                            • {pod.format}
                          </span>
                        )}
                        <span className="text-[10px] text-stone-400 ml-auto shrink-0">
                          {pod.durationSeconds && pod.durationSeconds > 0
                            ? `${Math.floor(pod.durationSeconds / 60)}:${(pod.durationSeconds % 60).toString().padStart(2, '0')}`
                            : `${pod.duration} min`}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
                        {pod.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {pod.descriptionTr || pod.description}
                      </p>
                    </div>
                  </div>

                  {/* Badges row: Challenge & Validation */}
                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/80">
                    {pod.challengeType && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        🎯 {pod.challengeType}
                      </span>
                    )}

                    {pod.validationReport && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewValidation?.(pod);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                        title="Click to view Content Quality and Grammar Audit Report"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{pod.validationReport.overallScore}% Verified</span>
                      </button>
                    )}

                    {isCompleted && (
                      <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {inProgress && !isCompleted && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                      <span>Progress</span>
                      <span>{inProgress.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-stone-800 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${inProgress.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
