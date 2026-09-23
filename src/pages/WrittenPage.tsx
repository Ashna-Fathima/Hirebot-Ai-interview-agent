import { useState, useCallback, useRef, useEffect } from 'react';
import { WRITTEN_QUESTIONS, INTERVIEW_CONFIG } from '../config';
import type { WrittenAnswer } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { CountdownTimer } from '../components/CountdownTimer';
import { TypingBubble } from '../components/TypingBubble';
import { useTimer } from '../hooks/useTimer';

interface WrittenPageProps {
  currentIndex: number;
  onAnswer: (answer: WrittenAnswer) => void;
  focusLossCount: number;
  onFocusLoss: () => void;
}

export function WrittenPage({ currentIndex, onAnswer, focusLossCount, onFocusLoss }: WrittenPageProps) {
  const question = WRITTEN_QUESTIONS[currentIndex];
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [typedDone, setTypedDone] = useState(false);
  const [showPasteWarning, setShowPasteWarning] = useState(false);
  const startTimeRef = useRef(Date.now());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submittedRef = useRef(false);

  const handleTypingDone = useCallback(() => {
    setTypedDone(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return;
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length < INTERVIEW_CONFIG.writtenMinWords) return;
    submittedRef.current = true;
    setSubmitted(true);
    const answer: WrittenAnswer = {
      questionId: question.id,
      text: text.trim(),
      timedOut: false,
      timeSpent: Math.round((Date.now() - startTimeRef.current) / 1000),
      wordCount: words.length,
      focusLossCount,
    };
    setTimeout(() => onAnswer(answer), 300);
  }, [text, question.id, focusLossCount, onAnswer]);

  const handleTimeout = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    const words = text.trim().split(/\s+/).filter(Boolean);
    const answer: WrittenAnswer = {
      questionId: question.id,
      text: text.trim() || '',
      timedOut: true,
      timeSpent: INTERVIEW_CONFIG.writtenTimePerQuestion,
      wordCount: words.length,
      focusLossCount,
    };
    setTimeout(() => onAnswer(answer), 300);
  }, [text, question.id, focusLossCount, onAnswer]);

  const { timeLeft } = useTimer(
    INTERVIEW_CONFIG.writtenTimePerQuestion,
    handleTimeout,
    typedDone && !submitted
  );

  useEffect(() => {
    if (typedDone && textareaRef.current && !submitted) {
      textareaRef.current.focus();
    }
  }, [typedDone, submitted]);

  useEffect(() => {
    const handler = () => {
      if (document.hidden && !submittedRef.current && typedDone) {
        onFocusLoss();
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [typedDone, onFocusLoss]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = wordCount >= INTERVIEW_CONFIG.writtenMinWords && !submitted;

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setShowPasteWarning(true);
    setTimeout(() => setShowPasteWarning(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="mb-6">
          <ProgressBar
            current={currentIndex + 1}
            total={WRITTEN_QUESTIONS.length}
            label="Round 2 — Written Response"
          />
        </div>

        <div className="rounded-3xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-[fadeInUp_0.4s_ease-out]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
              Question {currentIndex + 1} of {WRITTEN_QUESTIONS.length}
            </span>
            {typedDone && !submitted && (
              <CountdownTimer
                seconds={timeLeft}
                total={INTERVIEW_CONFIG.writtenTimePerQuestion}
                variant="written"
              />
            )}
          </div>

          <div className="px-6 py-6 space-y-4 min-h-[120px]">
            <TypingBubble text={question.question} onDone={handleTypingDone} />
          </div>

          {typedDone && (
            <div className="px-6 pb-6 animate-[fadeInUp_0.3s_ease-out]">
              {showPasteWarning && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-xs text-amber-700 dark:text-amber-300">
                  Pasting is disabled. Please type your own answer.
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPaste={handlePaste}
                disabled={submitted}
                placeholder="Type your answer here..."
                aria-label="Your answer"
                rows={6}
                className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none disabled:opacity-60"
              />
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs font-medium ${
                  wordCount >= INTERVIEW_CONFIG.writtenMinWords
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-neutral-400 dark:text-neutral-500'
                }`}>
                  {wordCount} words {wordCount < INTERVIEW_CONFIG.writtenMinWords && `(minimum ${INTERVIEW_CONFIG.writtenMinWords})`}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold text-sm shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  Submit Answer
                </button>
              </div>
              {submitted && (
                <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 animate-[fadeIn_0.3s_ease-out]">
                  Answer submitted. Loading next question...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
