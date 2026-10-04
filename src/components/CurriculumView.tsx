import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  Award,
  ChevronRight,
  Headphones,
  Compass,
} from 'lucide-react';
import { CurriculumUnit, CEFRLevel, Podcast, CurriculumLesson } from '../types';
import { CURRICULUM_UNITS, CurriculumService } from '../data/curriculum';

interface CurriculumViewProps {
  userLevel: CEFRLevel;
  completedLessonIds: string[];
  podcasts: Podcast[];
  onSelectLesson: (podcast: Podcast, mode: 'learn' | 'player') => void;
  onSwitchToFreeListening: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  userLevel,
  completedLessonIds,
  podcasts,
  onSelectLesson,
  onSwitchToFreeListening,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(userLevel);

  const units = CurriculumService.getUnitsForLevel(selectedLevel);

  const isLessonCompleted = (lessonId: string) => completedLessonIds.includes(lessonId);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Top Banner & Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wide mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Curriculum Mode
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 dark:text-white">
            Structured Learning Path
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Step-by-step progressive units with target grammar & Oxford 3000 vocabulary.
          </p>
        </div>

        <button
          onClick={onSwitchToFreeListening}
          className="px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold transition flex items-center gap-1.5"
          title="Switch to Free Listening"
        >
          <Compass className="w-3.5 h-3.5 text-stone-500" />
          <span>Free Browse</span>
        </button>
      </div>

      {/* Level Selector */}
      <div className="flex items-center gap-2">
        {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
              selectedLevel === lvl
                ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            {lvl} Path
          </button>
        ))}
      </div>

      {/* Units Stack */}
      <div className="space-y-4">
        {units.length === 0 ? (
          <div className="text-center py-12 text-xs text-stone-400 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
            Curriculum for {selectedLevel} is being generated.
          </div>
        ) : (
          units.map((unit) => {
            const completedCount = unit.lessons.filter((l) => isLessonCompleted(l.id)).length;
            const isUnitFinished = completedCount === unit.lessons.length && unit.lessons.length > 0;

            return (
              <div
                key={unit.id}
                className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-2xs space-y-4 overflow-hidden"
              >
                {/* Unit Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl shadow-xs">
                      {unit.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          Unit {unit.unitNumber}
                        </span>
                        <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                          {unit.topicGroup}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-white font-serif mt-0.5">
                        {unit.title}
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        {unit.titleTr}
                      </p>
                    </div>
                  </div>

                  {isUnitFinished && (
                    <span className="px-2 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Passed
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {unit.description}
                </p>

                {/* Lessons in Unit */}
                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  {unit.lessons.map((lesson, lidx) => {
                    const matchedPodcast = podcasts.find((p) => p.id === lesson.podcastId);
                    const done = isLessonCompleted(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => {
                          if (matchedPodcast) {
                            onSelectLesson(matchedPodcast, 'learn');
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          done
                            ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'border-stone-200/80 dark:border-stone-800 hover:border-amber-400 bg-stone-50/50 dark:bg-stone-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                            done
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                          }`}>
                            {done ? '✓' : lidx + 1}
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                              <span className="text-amber-700 dark:text-amber-400 font-semibold">
                                {lesson.grammarTarget}
                              </span>
                              <span>•</span>
                              <span>{lesson.oxfordTargetCount} Oxford words</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition shadow-2xs"
                            title="Start Lesson"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
