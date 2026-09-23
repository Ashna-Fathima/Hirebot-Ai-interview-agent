import { useState, useCallback } from 'react';
import { MCQ_BANK, INTERVIEW_CONFIG } from '../config';
import type { MCQAnswer } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { CountdownTimer } from '../components/CountdownTimer';
import { useTimer } from '../hooks/useTimer';

interface MCQPageProps {
  currentIndex: number;
  onAnswer: (answer: MCQAnswer) => void;
}

export function MCQPage({ currentIndex, onAnswer }: MCQPageProps) {
  const question = MCQ_BANK[currentIndex];
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setAnswered(true);
    const answer: MCQAnswer = {
      questionId: question.id,
      selected: null,
      timedOut: true,
      timeSpent: INTERVIEW_CONFIG.mcqTimePerQuestion,
    };
    setTimeout(() => onAnswer(answer), 300);
  }, [answered, question.id, onAnswer]);

  const { timeLeft } = useTimer(INTERVIEW_CONFIG.mcqTimePerQuestion, handleTimeout, !answered);

  const handleSelect = (label: string) => {
    if (answered) return;
    setSelected(label);
    setAnswered(true);
    const answer: MCQAnswer = {
      questionId: question.id,
      selected: label,
      timedOut: false,
      timeSpent: INTERVIEW_CONFIG.mcqTimePerQuestion - timeLeft,
    };
    setTimeout(() => onAnswer(answer), 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <ProgressBar
            current={currentIndex + 1}
            total={MCQ_BANK.length}
            label="Round 1 — Multiple Choice"
          />
        </div>

        <div className="rounded-3xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 animate-[fadeInUp_0.4s_ease-out]">
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-semibold">
              Question {currentIndex + 1} of {MCQ_BANK.length}
            </span>
            <CountdownTimer seconds={timeLeft} total={INTERVIEW_CONFIG.mcqTimePerQuestion} variant="mcq" />
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((opt) => {
              const isSelected = selected === opt.label;
              const isCorrect = answered && opt.label === question.correctAnswer;
              const isWrong = answered && isSelected && opt.label !== question.correctAnswer;

              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelect(opt.label)}
                  disabled={answered}
                  aria-label={`Option ${opt.label}: ${opt.text}`}
                  className={`w-full text-left rounded-2xl border p-4 flex items-start gap-3 transition-all duration-200
                    ${isCorrect
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                      : isWrong
                        ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                        : isSelected
                          ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/20'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-sky-300 dark:hover:border-sky-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }
                    ${answered ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]'}
                  `}
                >
                  <span className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold
                    ${isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isWrong
                        ? 'bg-red-500 text-white'
                        : isSelected
                          ? 'bg-sky-500 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                    }
                  `}>
                    {opt.label}
                  </span>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 pt-0.5 leading-relaxed">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {answered && (
            <p className="mt-5 text-sm text-neutral-500 dark:text-neutral-400 animate-[fadeIn_0.3s_ease-out]">
              {selected ? 'Answer recorded. Moving to next question...' : 'Time\u2019s up! Moving to next question...'}
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
          You cannot go back to previous questions. Answer carefully.
        </p>
      </div>
    </div>
  );
}
