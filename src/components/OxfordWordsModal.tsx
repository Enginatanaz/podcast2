import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Layers,
  Award,
} from 'lucide-react';
import { OxfordWord, CEFRLevel, OxfordWordStatus, UserOxfordProgress } from '../types';
import { OXFORD_3000_WORDS } from '../data/oxford3000';
import { audioService } from '../services/audioService';

interface OxfordWordsModalProps {
  userLevel: CEFRLevel;
  oxfordProgress: Record<string, UserOxfordProgress>;
  onUpdateWordStatus: (word: string, status: OxfordWordStatus) => void;
  onClose: () => void;
}

export const OxfordWordsModal: React.FC<OxfordWordsModalProps> = ({
  userLevel,
  oxfordProgress,
  onUpdateWordStatus,
  onClose,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(userLevel);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter words by level
  const levelWords = useMemo(() => {
    return OXFORD_3000_WORDS.filter((w) => w.cefr === selectedLevel);
  }, [selectedLevel]);

  // Aggregate stats strictly based on this user's oxfordProgress
  const stats = useMemo(() => {
    let mastered = 0;
    let familiar = 0;
    let learning = 0;
    let seen = 0;

    levelWords.forEach((w) => {
      const p = oxfordProgress[w.word.toLowerCase()];
      if (p) {
        if (p.status === 'mastered') mastered++;
        else if (p.status === 'familiar') familiar++;
        else if (p.status === 'learning') learning++;
        else if (p.status === 'seen') seen++;
      }
    });

    const learnedTotal = mastered + familiar + learning + seen;
    const newWords = Math.max(0, levelWords.length - learnedTotal);

    return {
      total: levelWords.length,
      learned: learnedTotal,
      mastered,
      familiar,
      learning,
      seen,
      newWords,
    };
  }, [levelWords, oxfordProgress]);

  // Filtered word list
  const filteredWords = useMemo(() => {
    return levelWords.filter((w) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        w.word.toLowerCase().includes(q) ||
        w.meaningTr.toLowerCase().includes(q) ||
        w.exampleEn.toLowerCase().includes(q);

      const userProg = oxfordProgress[w.word.toLowerCase()];
      const currentStatus: OxfordWordStatus = userProg ? userProg.status : 'new';

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'new' && currentStatus === 'new') ||
        (statusFilter === 'learning' && currentStatus === 'learning') ||
        (statusFilter === 'familiar' && currentStatus === 'familiar') ||
        (statusFilter === 'mastered' && currentStatus === 'mastered');

      return matchesSearch && matchesStatus;
    });
  }, [levelWords, searchQuery, statusFilter, oxfordProgress]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-stone-100 dark:border-stone-800 flex items-start justify-between bg-stone-50/50 dark:bg-stone-900/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold tracking-wide uppercase mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Oxford 3000™ Curriculum Hub
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white font-serif">
              Oxford 3000 Vocabulary
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              The essential core of the English language, seamlessly recycled through your listening lessons.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Tabs & Stats Overview */}
        <div className="p-5 sm:p-6 space-y-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-800/20">
          {/* Level Switcher */}
          <div className="flex items-center gap-2">
            {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  selectedLevel === lvl
                    ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* User Progress Stats Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">
              <span className="uppercase tracking-wider">
                Oxford 3000 · {selectedLevel} Progress
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                {stats.learned} / {stats.total} Target Words
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(stats.mastered / Math.max(stats.total, 1)) * 100}%` }}
                title={`Mastered: ${stats.mastered}`}
              />
              <div
                className="bg-sky-500 h-full transition-all duration-300"
                style={{ width: `${(stats.familiar / Math.max(stats.total, 1)) * 100}%` }}
                title={`Familiar: ${stats.familiar}`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${(stats.learning / Math.max(stats.total, 1)) * 100}%` }}
                title={`Learning: ${stats.learning}`}
              />
            </div>

            {/* 4 Mini Counters */}
            <div className="grid grid-cols-4 gap-2 pt-3 mt-3 border-t border-stone-100 dark:border-stone-700/60 text-center">
              <div>
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {stats.mastered}
                </div>
                <div className="text-[10px] text-stone-400 font-medium uppercase">Mastered</div>
              </div>
              <div>
                <div className="text-base font-extrabold text-sky-600 dark:text-sky-400">
                  {stats.familiar}
                </div>
                <div className="text-[10px] text-stone-400 font-medium uppercase">Familiar</div>
              </div>
              <div>
                <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                  {stats.learning}
                </div>
                <div className="text-[10px] text-stone-400 font-medium uppercase">Learning</div>
              </div>
              <div>
                <div className="text-base font-extrabold text-stone-400">
                  {stats.newWords}
                </div>
                <div className="text-[10px] text-stone-400 font-medium uppercase">New</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-5 sm:px-6 pt-3 pb-2 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Oxford words, meanings..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['all', 'mastered', 'learning', 'new'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Word Cards List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 pt-2">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 text-xs text-stone-400">
              No Oxford words match this query.
            </div>
          ) : (
            filteredWords.map((word) => {
              const userProg = oxfordProgress[word.word.toLowerCase()];
              const currentStatus: OxfordWordStatus = userProg ? userProg.status : 'new';

              const statusBadgeColor = {
                mastered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
                familiar: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300',
                learning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
                seen: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300',
                new: 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 border-stone-200',
              }[currentStatus];

              return (
                <div
                  key={word.id}
                  className="p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:border-amber-300 transition shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-stone-900 dark:text-white">
                        {word.word}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-400 italic">
                        ({word.partOfSpeech})
                      </span>
                      <button
                        onClick={() => audioService.speakSingleWord(word.word)}
                        className="p-1 rounded-full text-stone-400 hover:text-amber-600 transition"
                        title="Pronounce word"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize ${statusBadgeColor}`}>
                        {currentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    🇹🇷 {word.meaningTr}
                  </div>

                  {/* Contextual Examples */}
                  <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900/40 p-2 rounded-xl">
                    <div className="font-medium text-stone-800 dark:text-stone-200">
                      "{word.exampleEn}"
                    </div>
                    <div className="text-[11px] text-stone-400 italic mt-0.5">
                      {word.exampleTr}
                    </div>
                  </div>

                  {/* Collocations */}
                  {word.collocations && word.collocations.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-stone-400">
                      <span className="font-semibold text-stone-500">Collocations:</span>
                      {word.collocations.map((col, cidx) => (
                        <span
                          key={cidx}
                          className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Toggle */}
                  <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-stone-100 dark:border-stone-700/60">
                    <button
                      onClick={() => onUpdateWordStatus(word.word, 'learning')}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-800 transition"
                    >
                      Mark Learning
                    </button>
                    <button
                      onClick={() => onUpdateWordStatus(word.word, 'mastered')}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 transition"
                    >
                      Mark Mastered ✓
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
