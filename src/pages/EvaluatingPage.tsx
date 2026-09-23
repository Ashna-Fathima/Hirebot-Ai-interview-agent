import { Bot } from 'lucide-react';

export function EvaluatingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-ping" />
        <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-xl">
          <Bot className="h-12 w-12 text-white animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2 animate-[fadeInUp_0.4s_ease-out]">
        Evaluating your responses...
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        Our AI interviewer is reviewing your answers
      </p>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-sky-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
