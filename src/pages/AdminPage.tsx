import { useState } from 'react';
import { Shield, Lock, ArrowLeft, Trophy, Mail, Calendar, Eye } from 'lucide-react';
import { getStoredResults } from '../hooks/useInterviewState';
import { INTERVIEW_CONFIG } from '../config';
import type { InterviewResult } from '../types';

interface AdminPageProps {
  onBack: () => void;
}

export function AdminPage({ onBack }: AdminPageProps) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<InterviewResult | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envPass = import.meta.env.VITE_ADMIN_PASSWORD || INTERVIEW_CONFIG.adminPassword;
    if (password === envPass) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to interview
          </button>
          <div className="rounded-3xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 mb-4">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Admin Access</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Enter password to view candidate results</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin password"
                    aria-label="Admin password"
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-11 pr-4 py-3 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold py-3 text-sm hover:opacity-90 transition-opacity"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const results = getStoredResults().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (selected) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </button>
          <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">{selected.candidateName}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{selected.candidateEmail}</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  {new Date(selected.date).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${selected.passed ? 'text-emerald-500' : 'text-neutral-500'}`}>
                  {selected.overallScore}%
                </p>
                <p className={`text-xs font-medium ${selected.passed ? 'text-emerald-500' : 'text-neutral-400'}`}>
                  {selected.passed ? 'PASSED' : 'NOT PASSED'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3 text-center">
                <p className="text-xs text-neutral-400 mb-1">MCQ</p>
                <p className="text-lg font-bold text-sky-500">{selected.mcqScore}%</p>
              </div>
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3 text-center">
                <p className="text-xs text-neutral-400 mb-1">Written</p>
                <p className="text-lg font-bold text-cyan-500">{selected.writtenScore}%</p>
              </div>
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3 text-center">
                <p className="text-xs text-neutral-400 mb-1">Focus Loss</p>
                <p className="text-lg font-bold text-amber-500">{selected.totalFocusLossCount}</p>
              </div>
            </div>
            <div className="space-y-4">
              {selected.writtenFeedback.map((wf, i) => (
                <div key={wf.questionId} className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      {selected.writtenAnswers[i]?.questionId || wf.questionId}
                    </span>
                    <span className="text-sm font-bold text-cyan-500">{wf.score}/10</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">
                    {selected.writtenAnswers[i]?.text || 'No answer provided'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 italic">
                    {wf.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Candidate Results</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{results.length} total candidate{results.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {results.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-12 text-center">
            <p className="text-neutral-400 dark:text-neutral-500 text-sm">No candidate results yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => setSelected(r)}
                className="w-full text-left rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-md transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${r.passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
                    {r.passed ? <Trophy className="h-5 w-5 text-emerald-500" /> : <Calendar className="h-5 w-5 text-neutral-400" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">{r.candidateName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {r.candidateEmail}
                      </span>
                      <span className="text-xs text-neutral-400 dark:text-neutral-500">
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${r.passed ? 'text-emerald-500' : 'text-neutral-500'}`}>{r.overallScore}%</p>
                    <p className={`text-[10px] font-semibold uppercase ${r.passed ? 'text-emerald-500' : 'text-neutral-400'}`}>
                      {r.passed ? 'Pass' : 'Fail'}
                    </p>
                  </div>
                  <Eye className="h-4 w-4 text-neutral-400 group-hover:text-sky-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
