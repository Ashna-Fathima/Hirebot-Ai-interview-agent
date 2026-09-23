import { Trophy, Mail, Download, RotateCcw, CheckCircle2, XCircle, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { InterviewResult } from '../types';
import { INTERVIEW_CONFIG } from '../config';
import { RadarChart } from '../components/RadarChart';
import { ScoreBar } from '../components/ScoreBar';

interface ResultPageProps {
  result: InterviewResult;
  onRetake: () => void;
}

export function ResultPage({ result, onRetake }: ResultPageProps) {
  const handleDownload = () => {
    window.print();
  };

  const passed = result.passed;
  const competencyColors: Record<string, string> = {
    'Programming': 'sky',
    'AI Leverage': 'cyan',
    'Agency & Ownership': 'teal',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-[fadeInUp_0.4s_ease-out]">
          <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full mb-4 ${passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
            {passed ? (
              <Trophy className="h-10 w-10 text-emerald-500" />
            ) : (
              <XCircle className="h-10 w-10 text-neutral-400 dark:text-neutral-500" />
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
            Interview Complete
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {new Date(result.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {passed ? (
          <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-green-500 p-1 mb-8 animate-[fadeInUp_0.5s_ease-out]">
            <div className="rounded-[22px] bg-white dark:bg-neutral-900 p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <Trophy className="h-7 w-7 text-emerald-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                Congratulations {result.candidateName}!
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl mx-auto">
                You are selected for the next process. Our team will contact you at{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{result.candidateEmail}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-6 sm:p-8 mb-8 text-center animate-[fadeInUp_0.5s_ease-out]">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-700 dark:text-neutral-200 mb-2">
              Thank you {result.candidateName} for your time.
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl mx-auto">
              You are not selected for the next round at this time. We encourage you to keep building and apply again.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 text-center shadow-sm">
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Overall Score</p>
            <p className={`text-3xl font-bold ${passed ? 'text-emerald-500' : 'text-neutral-600 dark:text-neutral-300'}`}>
              {result.overallScore}%
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Pass: {INTERVIEW_CONFIG.passThreshold}%</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 text-center shadow-sm">
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">MCQ Score</p>
            <p className="text-3xl font-bold text-sky-500">{result.mcqScore}%</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{INTERVIEW_CONFIG.mcqWeight * 100}% weight</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 text-center shadow-sm">
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">Written Score</p>
            <p className="text-3xl font-bold text-cyan-500">{result.writtenScore}%</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{INTERVIEW_CONFIG.writtenWeight * 100}% weight</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 mb-8 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-6 text-center">Competency Breakdown</h3>
          <RadarChart scores={result.competencyScores} />
          <div className="mt-6 space-y-4 max-w-md mx-auto">
            {result.competencyScores.map((c) => (
              <ScoreBar
                key={c.competency}
                label={c.label}
                score={c.score}
                color={competencyColors[c.label] || 'sky'}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <h3 className="font-bold text-neutral-800 dark:text-neutral-100">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-amber-500" />
              </div>
              <h3 className="font-bold text-neutral-800 dark:text-neutral-100">Areas to Improve</h3>
            </div>
            <ul className="space-y-2">
              {result.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {result.totalFocusLossCount > 0 && (
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 mb-8 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Tab focus was lost {result.totalFocusLossCount} time{result.totalFocusLossCount > 1 ? 's' : ''} during the interview. This is noted in the report.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
          <button
            onClick={onRetake}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Interview
          </button>
        </div>
      </div>
    </div>
  );
}
