import React, { useState } from 'react';
import { X, CheckCircle, XCircle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { Podcast, QuizQuestion } from '../types';

interface PodcastQuizModalProps {
  podcast: Podcast;
  onClose: () => void;
  onFinishQuiz: (scorePercent: number, correctCount: number, total: number) => void;
}

export const PodcastQuizModal: React.FC<PodcastQuizModalProps> = ({
  podcast,
  onClose,
  onFinishQuiz,
}) => {
  const questions: QuizQuestion[] = podcast.quiz && podcast.quiz.length > 0 ? podcast.quiz : [
    {
      id: 'default-q1',
      question: `What was the main topic of "${podcast.title}"?`,
      options: [podcast.category, 'Space exploration', 'Gardening'],
      correctIndex: 0,
      explanation: `The episode focuses on ${podcast.category}.`,
      explanationTr: `Bu bölüm ${podcast.category} konusuna odaklanmaktadır.`,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const finalScore = Math.round(
        ((correctAnswers + (selectedOption === currentQ.correctIndex ? 0 : 0)) / questions.length) * 100
      );
      onFinishQuiz(finalScore, correctAnswers, questions.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 flex flex-col max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Quick Check
            </span>
            <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100">
              {podcast.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-400">
              {currentIndex + 1} / {questions.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full my-4 overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Text */}
        <div className="my-2 space-y-1">
          {currentQ.type && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {currentQ.type.replace('_', ' ')}
            </span>
          )}
          <h3 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 leading-snug">
            {currentQ.question}
          </h3>
          {currentQ.questionTr && (
            <p className="text-xs text-stone-500 dark:text-stone-400 italic">
              {currentQ.questionTr}
            </p>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-2.5 my-5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let buttonStyle =
              'border-stone-200 dark:border-stone-800 hover:border-amber-400 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-2xs font-bold';
              } else if (isSelected) {
                buttonStyle =
                  'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
              } else {
                buttonStyle = 'opacity-40 border-stone-200 dark:border-stone-800';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm font-medium flex items-center justify-between gap-3 cursor-pointer ${buttonStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && (
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Answer Explanation */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl mb-4 border text-xs space-y-1 animate-in fade-in duration-150 ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-stone-800 dark:text-stone-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {selectedOption === currentQ.correctIndex ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Explanation:</span>
                </>
              )}
            </div>
            <p className="font-medium">{currentQ.explanation}</p>
            {currentQ.explanationTr && (
              <p className="text-stone-500 dark:text-stone-400 italic text-[11px]">
                🇹🇷 {currentQ.explanationTr}
              </p>
            )}
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
          >
            <span>
              {currentIndex + 1 === questions.length ? 'View Results 🎉' : 'Next Question'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
