import React from 'react';
import { Flame, Moon, Sun, ChevronDown, User } from 'lucide-react';
import { CEFRLevel, UserAccount } from '../types';

interface HeaderProps {
  currentUser?: UserAccount;
  level: CEFRLevel;
  streak: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onChangeLevel: (level: CEFRLevel) => void;
  onOpenUserSwitcher: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  level,
  streak,
  isDark,
  onToggleTheme,
  onChangeLevel,
  onOpenUserSwitcher,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 18) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  const [isLevelMenuOpen, setIsLevelMenuOpen] = React.useState(false);
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

  return (
    <header className="px-4 pt-5 pb-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Streak & Daily Badge */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-2xs">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streak} day streak</span>
          </div>

          {/* CEFR Level Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLevelMenuOpen(!isLevelMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold border border-stone-200 dark:border-stone-700 transition cursor-pointer"
            >
              <span>Level: {level}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isLevelMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsLevelMenuOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-32 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl py-1 z-40 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Switch Level
                  </div>
                  {levels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        onChangeLevel(lvl);
                        setIsLevelMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between transition ${
                        level === lvl
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span>{lvl}</span>
                      {level === lvl && <span className="text-[10px] text-amber-500 font-bold">Active</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side: User Switcher pill & Theme Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenUserSwitcher}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/70 hover:bg-amber-200/80 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs font-bold transition cursor-pointer"
            title="Switch User Account"
          >
            <User className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span className="truncate max-w-20 sm:max-w-28">
              {currentUser?.displayName || 'User'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="p-1.5 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          What do you want to listen to today?
        </p>
      </div>
    </header>
  );
};
