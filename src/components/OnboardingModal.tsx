import React, { useState } from 'react';
import { Headphones, CheckCircle2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { CEFRLevel } from '../types';

interface OnboardingModalProps {
  onComplete: (level: CEFRLevel) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'unsure' | null>(null);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [diagnosticStep, setDiagnosticStep] = useState(0);
  const [diagnosticScore, setDiagnosticScore] = useState(0);

  const levels: Array<{ id: CEFRLevel; title: string; desc: string; tr: string }> = [
    {
      id: 'A1',
      title: 'A1 — Beginner',
      desc: 'Simple phrases, daily greetings, ordering food & drinks.',
      tr: 'Temel günlük kalıplar, basit tanışma ve sipariş verme.',
    },
    {
      id: 'A2',
      title: 'A2 — Elementary',
      desc: 'Daily routines, past events, travel & shopping.',
      tr: 'Günlük rutinler, geçmiş zaman, seyahat ve alışveriş.',
    },
    {
      id: 'B1',
      title: 'B1 — Intermediate',
      desc: 'Natural conversations, personal stories, opinions.',
      tr: 'Akıcı sohbetler, hikaye anlatımı, fikir belirtme.',
    },
    {
      id: 'B2',
      title: 'B2 — Upper-Intermediate',
      desc: 'Complex discussions, idiomatic native pace, work topics.',
      tr: 'İleri düzey tartışmalar, deyimler ve iş dünyası.',
    },
  ];

  const diagnosticQuestions = [
    {
      q: 'Which sentence is grammatically correct?',
      options: ['I has two brothers.', 'I have two brothers.', 'I having two brothers.'],
      answer: 1,
      points: 1, // Basic
    },
    {
      q: 'Complete: "Yesterday, I _______ my friends at the café."',
      options: ['meet', 'met', 'will meet'],
      answer: 1,
      points: 2, // A2 past tense
    },
    {
      q: 'What does "spontaneous" mean?',
      options: ['Planned for months', 'Happening naturally without preparation', 'Very boring'],
      answer: 1,
      points: 3, // B1
    },
  ];

  const handleDiagnosticAnswer = (index: number) => {
    let newScore = diagnosticScore;
    if (index === diagnosticQuestions[diagnosticStep].answer) {
      newScore += diagnosticQuestions[diagnosticStep].points;
      setDiagnosticScore(newScore);
    }

    if (diagnosticStep + 1 < diagnosticQuestions.length) {
      setDiagnosticStep((prev) => prev + 1);
    } else {
      // Determine level based on score
      let calculatedLevel: CEFRLevel = 'A1';
      if (newScore >= 5) calculatedLevel = 'B1';
      else if (newScore >= 2) calculatedLevel = 'A2';
      else calculatedLevel = 'A1';

      onComplete(calculatedLevel);
    }
  };

  const handleFinish = () => {
    if (selectedLevel === 'unsure') {
      setIsDiagnosticOpen(true);
      return;
    }
    if (selectedLevel) {
      onComplete(selectedLevel);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden relative">
        {/* Glow ambient decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-400/15 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {!isDiagnosticOpen ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                <Headphones className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                Learn English with Podcasts
              </h1>
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Listen. Understand. Speak.
              </p>
            </div>

            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">
                What's your English level?
              </h2>

              <div className="space-y-2">
                {levels.map((lvl) => {
                  const isSelected = selectedLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          {lvl.title}
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {lvl.desc}
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 italic">
                        {lvl.tr}
                      </p>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setSelectedLevel('unsure')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    selectedLevel === 'unsure'
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40'
                      : 'border-dashed border-stone-300 dark:border-stone-700 hover:border-stone-400 bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                        I'm not sure
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Take a quick 1-minute level test
                      </div>
                    </div>
                  </div>
                  {selectedLevel === 'unsure' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={!selectedLevel}
              onClick={handleFinish}
              className="w-full mt-4 py-3.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {selectedLevel === 'unsure' ? 'Start Quick Level Check' : 'Start Learning'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Quick Level Check ({diagnosticStep + 1}/{diagnosticQuestions.length})
              </span>
              <span className="text-xs text-stone-400">
                Question {diagnosticStep + 1} of {diagnosticQuestions.length}
              </span>
            </div>

            <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full mb-6 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{
                  width: `${((diagnosticStep + 1) / diagnosticQuestions.length) * 100}%`,
                }}
              />
            </div>

            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-4">
              {diagnosticQuestions[diagnosticStep].q}
            </h3>

            <div className="space-y-2.5 mb-6">
              {diagnosticQuestions[diagnosticStep].options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDiagnosticAnswer(i)}
                  className="w-full text-left p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-stone-800 dark:text-stone-200 text-sm font-medium transition cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-stone-400">
              No pressure! We will adjust podcasts to match your pace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
