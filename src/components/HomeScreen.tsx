import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Clock,
  ArrowRight,
  Play,
  BookOpen,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Headphones,
  Zap,
} from 'lucide-react';
import { Podcast, Category, UserProgress, CEFRLevel } from '../types';

interface HomeScreenProps {
  podcasts: Podcast[];
  userProgress: UserProgress;
  onSelectPodcast: (podcast: Podcast, mode?: 'learn' | 'player') => void;
  onOpenAIGenerator: () => void;
  onExploreCategory: (category: Category) => void;
  onOpenSmartSession?: (presetMinutes?: number) => void;
  onViewValidation?: (podcast: Podcast) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  podcasts,
  userProgress,
  onSelectPodcast,
  onOpenAIGenerator,
  onExploreCategory,
  onOpenSmartSession,
  onViewValidation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: Array<{ id: string; label: string; icon: string }> = [
    { id: 'All', label: 'All', icon: '✨' },
    { id: 'Daily Life', label: 'Daily Life', icon: '🏡' },
    { id: 'Real Life', label: 'Real Life', icon: '🏙️' },
    { id: 'Work', label: 'Work', icon: '💼' },
    { id: 'Interests', label: 'Interests', icon: '🎨' },
    { id: 'Travel', label: 'Travel', icon: '✈️' },
    { id: 'Food', label: 'Food', icon: '☕' },
    { id: 'Social', label: 'Social', icon: '👥' },
    { id: 'Real Conversations', label: 'Conversations', icon: '💬' },
  ];

  // 1. In-progress podcast check
  const inProgressPodcast = useMemo(() => {
    const entries = Object.values(userProgress.inProgressPodcasts || {});
    if (entries.length === 0) return null;
    const latest = entries.sort((a, b) => b.lastListenedAt - a.lastListenedAt)[0];
    const found = podcasts.find((p) => p.id === latest.podcastId);
    return found ? { podcast: found, progress: latest } : null;
  }, [userProgress.inProgressPodcasts, podcasts]);

  // 2. Today's Podcast
  const todaysPodcast = useMemo(() => {
    return podcasts.find((p) => p.isFeaturedToday) || podcasts[0];
  }, [podcasts]);

  // 3. Recommended Podcasts: filtered by user's CEFR level
  const recommendedPodcasts = useMemo(() => {
    return podcasts.filter((p) => {
      // Don't show today's podcast again in recommendations
      if (todaysPodcast && p.id === todaysPodcast.id) return false;
      // Match current user level or adjacent
      if (p.level === userProgress.level) return true;
      if (userProgress.level === 'A1' && p.level === 'A2') return true;
      if (userProgress.level === 'A2' && (p.level === 'A1' || p.level === 'B1')) return true;
      if (userProgress.level === 'B1' && (p.level === 'A2' || p.level === 'B2')) return true;
      if (userProgress.level === 'B2' && p.level === 'B1') return true;
      return false;
    });
  }, [podcasts, todaysPodcast, userProgress.level]);

  // 4. Filtered list when searching or filtering category
  const filteredPodcasts = useMemo(() => {
    if (!searchQuery.trim() && selectedCategory === 'All') return null;

    return podcasts.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.titleTr.toLowerCase().includes(query) ||
        p.topic?.toLowerCase().includes(query) ||
        p.format?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.level.toLowerCase().includes(query) ||
        p.transcript.some(
          (t) =>
            t.text.toLowerCase().includes(query) ||
            t.keywords.some((k) => k.word.toLowerCase().includes(query) || k.meaning.toLowerCase().includes(query))
        );

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [podcasts, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics, formats, words (e.g. café, interview, A1)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-500 shadow-2xs transition"
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

      {/* Category Pills Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 🎧 HOW MUCH TIME DO YOU HAVE TODAY? (Smart Session Builder Launcher) */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm">
              🎧
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white font-serif">
                How much time do you have today?
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Pick your time — get a tailored session with complete, untrimmed episodes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenSmartSession?.(20)}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
          >
            <span>All Options</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Presets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onOpenSmartSession?.(5)}
            className="flex flex-col p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 hover:border-amber-400 text-left transition group shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
              <span>⚡ 5 min</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition">→</span>
            </div>
            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 mt-1">
              Quick Listening
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">1 complete episode</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenSmartSession?.(10)}
            className="flex flex-col p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 hover:border-amber-400 text-left transition group shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
              <span>☕ 10 min</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition">→</span>
            </div>
            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 mt-1">
              Daily Listening
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">2 complete episodes</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenSmartSession?.(20)}
            className="flex flex-col p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 hover:border-amber-400 text-left transition group shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
              <span>🧠 20 min</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition">→</span>
            </div>
            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 mt-1">
              Deep Practice
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">3-4 complete episodes</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenSmartSession?.(30)}
            className="flex flex-col p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 hover:border-amber-400 text-left transition group shadow-2xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
              <span>🔥 30 min</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition">→</span>
            </div>
            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 mt-1">
              Intensive Session
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">5-6 complete episodes</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-stone-500 dark:text-stone-400 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Relaxed (hands-free) or Guided Learning modes available
          </span>
          <button
            type="button"
            onClick={() => onOpenSmartSession?.(15)}
            className="text-amber-700 dark:text-amber-400 font-bold hover:underline"
          >
            Custom Minutes →
          </button>
        </div>
      </div>

      {/* Search results view if search or category is active */}
      {filteredPodcasts !== null ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Matching Podcasts ({filteredPodcasts.length})
            </h2>
          </div>

          {filteredPodcasts.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                No podcasts found matching "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={onOpenAIGenerator}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate an AI Podcast on this topic
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredPodcasts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPodcast(p)}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 p-4 rounded-2xl shadow-2xs transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.coverGradient} flex items-center justify-center text-xl text-white shadow-xs shrink-0`}>
                      {p.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {p.level}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {p.category}
                        </span>
                        {p.format && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                            {p.format}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition mt-0.5">
                        {p.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                        {p.descriptionTr || p.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 1. Continue Learning Card */}
          {inProgressPodcast && (
            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-3xl p-4 shadow-2xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Play className="w-3 h-3 fill-amber-600 text-amber-600" />
                  Continue Learning
                </span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  {inProgressPodcast.progress.progressPercent}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${inProgressPodcast.podcast.coverGradient} flex items-center justify-center text-lg text-white shadow-xs shrink-0`}
                  >
                    {inProgressPodcast.podcast.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-900 dark:text-stone-100">
                      {inProgressPodcast.podcast.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5">
                      <span>{inProgressPodcast.podcast.level}</span>
                      <span>·</span>
                      <span>{inProgressPodcast.podcast.duration} min</span>
                      {inProgressPodcast.podcast.format && (
                        <>
                          <span>·</span>
                          <span className="font-semibold">{inProgressPodcast.podcast.format}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPodcast(inProgressPodcast.podcast, 'learn')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-amber-200/50 dark:bg-amber-900/40 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${inProgressPodcast.progress.progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* 2. Today's Podcast (Featured Lesson Card) */}
          {todaysPodcast && (
            <div className="relative group">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-black text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <span>🎧</span>
                  <span>Today's Podcast</span>
                </h2>
                <div className="flex items-center gap-2">
                  {todaysPodcast.validationReport && (
                    <button
                      type="button"
                      onClick={() => onViewValidation?.(todaysPodcast)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 transition"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{todaysPodcast.validationReport.overallScore}% Verified</span>
                    </button>
                  )}
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                    Featured Lesson
                  </span>
                </div>
              </div>

              <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
                {/* Background glow & art */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-500 text-stone-950">
                        {todaysPodcast.level}
                      </span>
                      <span className="text-xs text-stone-300 flex items-center gap-1">
                        <span>{todaysPodcast.icon}</span>
                        <span>{todaysPodcast.category}</span>
                      </span>
                      {todaysPodcast.format && (
                        <span className="text-xs text-amber-300 font-medium">
                          • {todaysPodcast.format}
                        </span>
                      )}
                      <span className="text-xs text-stone-400">
                        • {todaysPodcast.durationSeconds && todaysPodcast.durationSeconds > 0
                            ? `${Math.floor(todaysPodcast.durationSeconds / 60)}:${(todaysPodcast.durationSeconds % 60).toString().padStart(2, '0')}`
                            : `${todaysPodcast.duration} min`}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-serif tracking-tight text-white">
                      {todaysPodcast.title}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                      {todaysPodcast.descriptionTr || todaysPodcast.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs text-stone-400">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>{todaysPodcast.transcript.flatMap((t) => t.keywords).length} key words</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectPodcast(todaysPodcast, 'learn')}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      Start Learning
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectPodcast(todaysPodcast, 'player')}
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-2xl transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Listen Only
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Recommended for You */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-stone-900 dark:text-stone-100">
                  Recommended for You
                </h2>
                <p className="text-[11px] text-stone-500">
                  Tailored for your current level ({userProgress.level}) & vocabulary goals
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedPodcasts.slice(0, 6).map((podcast) => (
                <div
                  key={podcast.id}
                  onClick={() => onSelectPodcast(podcast)}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-400/80 p-4 rounded-2xl shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${podcast.coverGradient} flex items-center justify-center text-xl text-white shadow-xs shrink-0`}
                    >
                      {podcast.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                          {podcast.level}
                        </span>
                        <span className="text-[10px] text-stone-400 truncate">
                          {podcast.category}
                        </span>
                        {podcast.format && (
                          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                            · {podcast.format}
                          </span>
                        )}
                        <span className="text-[10px] text-stone-400 ml-auto shrink-0">
                          {podcast.duration} min
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition truncate">
                        {podcast.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {podcast.descriptionTr || podcast.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-amber-500" />
                        {podcast.transcript.flatMap((t) => t.keywords).length} words
                      </span>
                      {podcast.validationReport && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewValidation?.(podcast);
                          }}
                          className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 font-bold"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{podcast.validationReport.overallScore}%</span>
                        </button>
                      )}
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition font-bold">
                      Learn →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. AI Creator Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border border-amber-800/50 rounded-3xl p-5 text-white shadow-lg flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                <Sparkles className="w-3 h-3" />
                Infinite Content Combinations
              </div>
              <h3 className="text-base font-bold font-serif">
                Generate & Validate Any Topic
              </h3>
              <p className="text-xs text-stone-300 max-w-xs">
                Combine Level + Category + Format + Topic. Every episode is automatically validated by our 7-step pedagogical engine.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAIGenerator}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-2xl shadow-md transition shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Episode</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
