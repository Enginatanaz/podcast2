import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  SkipForward,
  BookOpen,
} from 'lucide-react';
import { Podcast, Sentence, Keyword, SpeechEvaluationResult } from '../types';
import { audioService } from '../services/audioService';

interface LearnModeViewProps {
  podcast: Podcast;
  startIndex?: number;
  onBack: () => void;
  onOpenWordPopover: (keyword: Keyword) => void;
  onFinishLearnMode: () => void;
  onSentenceComplete: (index: number, total: number) => void;
}

export const LearnModeView: React.FC<LearnModeViewProps> = ({
  podcast,
  startIndex = 0,
  onBack,
  onOpenWordPopover,
  onFinishLearnMode,
  onSentenceComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showHint, setShowHint] = useState(false);
  const [isListeningToSentence, setIsListeningToSentence] = useState(false);

  // Speech practice state
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [evaluation, setEvaluation] = useState<SpeechEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [manualInputFallback, setManualInputFallback] = useState('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const currentSentence: Sentence = podcast.transcript[currentIndex] || podcast.transcript[0];
  const progressPercent = Math.round(((currentIndex + 1) / podcast.transcript.length) * 100);

  // Play audio when sentence opens
  useEffect(() => {
    setShowHint(false);
    setSpokenText('');
    setEvaluation(null);
    setRecognitionError(null);
    setManualInputFallback('');
    playCurrentSentence();
    onSentenceComplete(currentIndex, podcast.transcript.length);
  }, [currentIndex]);

  const playCurrentSentence = async () => {
    setIsListeningToSentence(true);
    await audioService.playSentence(currentIndex, false);
    setIsListeningToSentence(false);
  };

  // Web Speech Recognition for recording
  const startRecording = () => {
    setRecognitionError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionError('Speech recognition is not supported in this browser. You can type what you said below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        setIsRecording(false);
        evaluateSpeech(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setRecognitionError('Microphone permission was denied. You can type your sentence below!');
        } else {
          setRecognitionError('Could not clearly detect speech. Try again or type below.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsRecording(false);
      setRecognitionError('Microphone could not be started. You can type below.');
    }
  };

  const evaluateSpeech = async (text: string) => {
    if (!text.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/evaluate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSentence: currentSentence.text,
          userSpokenText: text,
          level: podcast.level,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation(data);
      } else {
        // Fallback local evaluation
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        const targetWords = normalize(currentSentence.text).split(/\s+/);
        const userWords = normalize(text).split(/\s+/);
        const matched = targetWords.filter((w) => userWords.includes(w));
        const accuracy = Math.round((matched.length / Math.max(targetWords.length, 1)) * 100);

        setEvaluation({
          score: Math.max(accuracy, 60),
          accuracyScore: accuracy,
          feedback: accuracy >= 70 ? 'Well said! Very clear.' : 'Good try! Keep practicing.',
          feedbackTr: accuracy >= 70 ? 'Çok iyi söylediniz!' : 'Güzel bir deneme!',
          missingWords: targetWords.filter((w) => !userWords.includes(w)),
          tip: 'Practice linking words naturally.',
        });
      }
    } catch {
      setEvaluation({
        score: 80,
        accuracyScore: 80,
        feedback: 'Great speaking effort! Keep it up.',
        feedbackTr: 'Tebrikler, konuşma pratiğiniz kaydedildi.',
        missingWords: [],
        tip: 'Keep your rhythm natural.',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < podcast.transcript.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishLearnMode();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] max-w-xl mx-auto bg-stone-50 dark:bg-stone-950 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={onBack}
          className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center flex-1 px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Learn Mode
          </span>
          <h2 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
            {podcast.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 transition"
        >
          <span>Skip</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5">
        <div
          className="bg-amber-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Learning Card */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400">
              Sentence {currentIndex + 1} of {podcast.transcript.length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              {podcast.level} Level
            </span>
          </div>

          {/* Sentence Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {currentSentence.speaker || 'Speaker'}
              </span>

              <button
                type="button"
                onClick={playCurrentSentence}
                className="p-2 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition shadow-2xs"
                title="Listen again"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Target English Sentence */}
            <p className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 leading-relaxed mb-4">
              {currentSentence.text}
            </p>

            {/* 🇹🇷 Turkish Hint Button / Card */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
              {showHint ? (
                <div className="text-sm font-semibold text-amber-700 dark:text-amber-400/90 italic flex items-start justify-between gap-2">
                  <span>{currentSentence.translation}</span>
                  <button
                    type="button"
                    onClick={() => setShowHint(false)}
                    className="text-[11px] text-stone-400 hover:text-stone-600 not-italic shrink-0"
                  >
                    Gizle
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition cursor-pointer"
                >
                  <span>🇹🇷</span>
                  <span>Türkçe İpucu Al</span>
                </button>
              )}
            </div>
          </div>

          {/* Keywords for this sentence */}
          {currentSentence.keywords && currentSentence.keywords.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                Key Words in this Sentence
              </span>
              <div className="flex flex-wrap gap-2">
                {currentSentence.keywords.map((kw, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onOpenWordPopover(kw)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-amber-400 text-xs font-semibold shadow-2xs transition"
                  >
                    <span className="font-bold">{kw.word}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-normal">
                      · {kw.meaning}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Speaking Section */}
          <div className="bg-amber-50/50 dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-amber-600" />
                Practice Speaking
              </span>
              <span className="text-[11px] text-stone-400">
                Optional · Repeat after audio
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <button
                type="button"
                onClick={startRecording}
                disabled={isRecording || isEvaluating}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30'
                    : 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer active:scale-95'
                }`}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              <p className="text-xs font-semibold text-stone-600 dark:text-stone-300 text-center">
                {isRecording
                  ? 'Listening... Speak the sentence now!'
                  : isEvaluating
                  ? 'Analyzing pronunciation...'
                  : 'Tap the mic and repeat the sentence'}
              </p>
            </div>

            {/* Recognition error / manual fallback */}
            {recognitionError && (
              <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-2xl text-xs space-y-2">
                <p className="text-stone-600 dark:text-stone-300">{recognitionError}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualInputFallback}
                    onChange={(e) => setManualInputFallback(e.target.value)}
                    placeholder="Type what you spoke..."
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => evaluateSpeech(manualInputFallback)}
                    className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-xl text-xs"
                  >
                    Check
                  </button>
                </div>
              </div>
            )}

            {/* Evaluation Results Card */}
            {evaluation && (
              <div className="p-4 bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 rounded-2xl space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-xs text-stone-800 dark:text-stone-100">
                      Pronunciation Score: {evaluation.score}%
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {evaluation.score >= 80 ? 'Excellent' : 'Good effort'}
                  </span>
                </div>

                {spokenText && (
                  <p className="text-xs text-stone-500">
                    You said: <span className="font-semibold text-stone-800 dark:text-stone-200">"{spokenText}"</span>
                  </p>
                )}

                <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  {evaluation.feedback}
                </p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  {evaluation.feedbackTr}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs disabled:opacity-40 disabled:pointer-events-none transition"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {currentIndex + 1 === podcast.transcript.length
                ? 'Finish & Quiz'
                : 'Next Sentence'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
