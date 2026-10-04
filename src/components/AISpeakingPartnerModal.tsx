import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Bot,
  User,
} from 'lucide-react';
import { Podcast, AIPartnerMessage } from '../types';
import { audioService } from '../services/audioService';

interface AISpeakingPartnerModalProps {
  podcast: Podcast;
  onClose: () => void;
  onProceedToQuiz: () => void;
}

export const AISpeakingPartnerModal: React.FC<AISpeakingPartnerModalProps> = ({
  podcast,
  onClose,
  onProceedToQuiz,
}) => {
  const [messages, setMessages] = useState<AIPartnerMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize first question from speakingTask
  useEffect(() => {
    const initialQ =
      podcast.speakingTask?.initialQuestion ||
      `What did you enjoy most about this episode?`;
    const initialQTr =
      podcast.speakingTask?.initialQuestionTr ||
      `Bu bölümde en çok ne hoşuna gitti?`;

    setMessages([
      {
        id: 'msg-init',
        role: 'assistant',
        text: initialQ,
        textTr: initialQTr,
      },
    ]);

    // Speak initial question aloud for natural immersive feel
    audioService.speakSingleWord(initialQ);
  }, [podcast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setInputText('');

    // Append user message
    const userMsg: AIPartnerMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-partner-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          podcastTitle: podcast.title,
          podcastTopic: podcast.category,
          level: podcast.level,
          history: newHistory.map((m) => ({ role: m.role, text: m.text })),
          userMessage: trimmed,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: AIPartnerMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: data.nextQuestion || 'What else would you like to share?',
          textTr: data.nextQuestionTr,
          correction: data.correction,
          correctionTr: data.correctionTr,
          explanation: data.explanation,
        };

        setMessages((prev) => [...prev, botMsg]);
        if (data.nextQuestion) {
          audioService.speakSingleWord(data.nextQuestion);
        }
      } else {
        // Fallback response following the 1-question rule
        const fallbackMsg: AIPartnerMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: `That sounds great! Do you usually do that on weekdays or weekends?`,
          textTr: 'Kulağa harika geliyor! Bunu genellikle hafta içi mi yoksa hafta sonu mu yaparsın?',
          correction: `Better: "${trimmed}"`,
          correctionTr: 'Cümleniz gayet net anlaşıldı.',
          explanation: 'Clear communication is key.',
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch {
      const fallbackMsg: AIPartnerMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: `Nice answer! What is one other thing you like about this?`,
        correction: `Great effort!`,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your answer below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setIsRecording(false);
        handleSendMessage(text);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[90vh] max-h-[700px] overflow-hidden animate-in slide-in-from-bottom-8 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                  AI Speaking Partner
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  1-on-1
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                1 question at a time · Friendly corrections
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="space-y-2">
              {/* If there is a correction from previous response */}
              {m.correction && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3 text-xs space-y-1 max-w-[85%] mx-auto">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Correction & Tip:</span>
                  </div>
                  <p className="font-semibold text-stone-800 dark:text-stone-200">
                    {m.correction}
                  </p>
                  {m.explanation && (
                    <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                      {m.explanation}
                    </p>
                  )}
                  {m.correctionTr && (
                    <p className="text-amber-600 dark:text-amber-400/90 text-[10px] italic">
                      {m.correctionTr}
                    </p>
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`flex items-start gap-2.5 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[80%] ${
                    m.role === 'user'
                      ? 'bg-amber-600 text-white rounded-tr-xs shadow-xs font-medium'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-tl-xs'
                  }`}
                >
                  <p className="font-semibold">{m.text}</p>
                  {m.textTr && (
                    <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-400 italic">
                      {m.textTr}
                    </p>
                  )}

                  {m.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => audioService.speakSingleWord(m.text)}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400"
                    >
                      <Volume2 className="w-3 h-3" />
                      Listen Question
                    </button>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-400 pl-9">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>AI is thinking & listening...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-800 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleStartRecording}
              className={`p-2.5 rounded-2xl transition shadow-xs ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/20'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-300'
              }`}
              title="Speak your answer"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Answer in English (or tap mic)..."
              disabled={isLoading || isRecording}
              className="flex-1 px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-stone-400">
              One question at a time · Don't worry about mistakes!
            </span>
            <button
              type="button"
              onClick={onProceedToQuiz}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              Ready for Quiz <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
