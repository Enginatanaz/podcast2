import React from 'react';
import { Home, Headphones, BookOpen, BarChart3, User } from 'lucide-react';

export type TabType = 'home' | 'podcasts' | 'words' | 'progress' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  savedWordsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  savedWordsCount = 0,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'podcasts' as TabType, label: 'Podcasts', icon: Headphones },
    {
      id: 'words' as TabType,
      label: 'My Words',
      icon: BookOpen,
      badge: savedWordsCount > 0 ? savedWordsCount : undefined,
    },
    { id: 'progress' as TabType, label: 'Progress', icon: BarChart3 },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center relative w-16 py-1 transition-all ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 min-w-4 text-[9px] font-black bg-amber-500 text-white rounded-full text-center">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-amber-600 dark:bg-amber-400 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
