import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  seconds: number;
  total: number;
  variant?: 'mcq' | 'written';
}

export function CountdownTimer({ seconds, total, variant = 'mcq' }: CountdownTimerProps) {
  const pct = total > 0 ? (seconds / total) * 100 : 0;
  const isLow = seconds <= 10;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = variant === 'written'
    ? `${mins}:${secs.toString().padStart(2, '0')}`
    : `${seconds}s`;

  const color = isLow
    ? 'text-red-500 dark:text-red-400'
    : 'text-sky-600 dark:text-sky-400';

  const barColor = isLow
    ? 'bg-red-500'
    : 'bg-sky-500';

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-4 w-4 ${color} ${isLow ? 'animate-pulse' : ''}`} />
      <span className={`font-mono font-semibold text-sm tabular-nums ${color}`}>
        {display}
      </span>
      <div className="h-1.5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-linear`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
