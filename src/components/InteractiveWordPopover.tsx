import React from 'react';
import { Volume2, Bookmark, Check, X } from 'lucide-react';
import { Keyword } from '../types';
import { audioService } from '../services/audioService';

interface InteractiveWordPopoverProps {
  keyword: Keyword;
  podcastId: string;
  podcastTitle: string;
  isSaved: boolean;
  onSave: (word: Keyword) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

export const InteractiveWordPopover: React.FC<InteractiveWordPopoverProps> = ({
  keyword,
  isSaved,
  onSave,
  onClose,
  position,
}) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.speakSingleWord(keyword.word);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(keyword);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        style={{
          // Center on screen or float cleanly
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {keyword.word}
              </span>
              <button
                type="button"
                onClick={handleSpeak}
                className="p-1 rounded-full text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                title="Listen pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-base font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
              {keyword.meaning}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {keyword.example && (
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-2.5 mb-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
            <span className="font-semibold text-stone-400 dark:text-stone-500 block text-[10px] uppercase tracking-wider mb-0.5">
              Example
            </span>
            "{keyword.example}"
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSpeak}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Listen
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                Save Word
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
