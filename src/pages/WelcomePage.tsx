import { useState } from 'react';
import { Bot, Mail, User, Clock, ListChecks, PenLine, ArrowRight, ShieldCheck } from 'lucide-react';
import { INTERVIEW_CONFIG } from '../config';

interface WelcomePageProps {
  onStart: (name: string, email: string) => void;
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = (): boolean => {
    const e: { name?: string; email?: string } = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Please enter your full name';
    if (!email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onStart(name.trim(), email.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-lg mb-5">
            <Bot className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 dark:from-sky-400 dark:via-cyan-400 dark:to-sky-400 bg-clip-text text-transparent mb-3">
            HireBot
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">AI Interview Agent</p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-[fadeInUp_0.6s_ease-out]">
          <div className="bg-gradient-to-br from-sky-500 via-cyan-500 to-sky-600 px-6 py-8 sm:px-10 sm:py-10 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Software Engineer — Generative AI</h2>
            <p className="text-sky-50 text-sm sm:text-base leading-relaxed max-w-2xl">
              Join our team building AI Agent, ChatLLM, and Abacus AI Desktop. We evaluate
              programming skills, ability to leverage AI for productivity, and high agency and ownership.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">What to expect</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2 mb-2">
                  <ListChecks className="h-5 w-5 text-sky-500" />
                  <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">Round 1</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{INTERVIEW_CONFIG.mcqCount} multiple-choice questions · {INTERVIEW_CONFIG.mcqTimePerQuestion}s each</p>
              </div>
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2 mb-2">
                  <PenLine className="h-5 w-5 text-cyan-500" />
                  <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">Round 2</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{INTERVIEW_CONFIG.writtenCount} written questions · {INTERVIEW_CONFIG.writtenTimePerQuestion / 60} min each</p>
              </div>
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-teal-500" />
                  <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">Duration</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">~20 minutes total</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    aria-label="Full name"
                    aria-invalid={!!errors.name}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-11 pr-4 py-3 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    aria-label="Email address"
                    aria-invalid={!!errors.email}
                    className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-11 pr-4 py-3 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3.5 text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                Start Interview
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
              <ShieldCheck className="h-4 w-4" />
              <span>Your responses are stored locally and used only for this interview.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
