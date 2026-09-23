interface ScoreBarProps {
  label: string;
  score: number;
  max?: number;
  color?: string;
}

export function ScoreBar({ label, score, max = 100, color = 'sky' }: ScoreBarProps) {
  const pct = Math.round((score / max) * 100);
  const colorMap: Record<string, string> = {
    sky: 'from-sky-500 to-cyan-400',
    green: 'from-emerald-500 to-green-400',
    amber: 'from-amber-500 to-orange-400',
    red: 'from-red-500 to-rose-400',
  blue: 'from-blue-500 to-indigo-400',
  teal: 'from-teal-500 to-cyan-400',
  violet: 'from-violet-500 to-purple-400',
  rose: 'from-rose-500 to-pink-400',
  cyan: 'from-cyan-500 to-sky-400',
    emerald: 'from-emerald-500 to-teal-400',
  orange: 'from-orange-500 to-amber-400',
  slate: 'from-slate-500 to-neutral-400',
  purple: 'from-purple-500 to-fuchsia-400',
  pink: 'from-pink-500 to-rose-400',
    indigo: 'from-indigo-500 to-blue-400',
  fuchsia: 'from-fuchsia-500 to-pink-400',
  neutral: 'from-neutral-500 to-neutral-400',
  lime: 'from-lime-500 to-green-400',
    yellow: 'from-yellow-500 to-amber-400',
  lightblue: 'from-sky-400 to-cyan-300',
    darkblue: 'from-blue-600 to-sky-500',
    lightgreen: 'from-green-400 to-emerald-300',
    lightred: 'from-red-400 to-rose-300',
    lightamber: 'from-amber-400 to-orange-300',
    darkgreen: 'from-green-600 to-emerald-500',
    darkred: 'from-red-600 to-rose-500',
    darkamber: 'from-amber-600 to-orange-500',
    darkcyan: 'from-cyan-600 to-sky-500',
    darkslate: 'from-slate-600 to-neutral-500',
    darkpurple: 'from-purple-600 to-fuchsia-500',
    darkpink: 'from-pink-600 to-rose-500',
    darkindigo: 'from-indigo-600 to-blue-500',
    darkfuchsia: 'from-fuchsia-600 to-pink-500',
    darklime: 'from-lime-600 to-green-500',
    darkyellow: 'from-yellow-600 to-amber-500',
    darkorange: 'from-orange-600 to-amber-500',
    darkteal: 'from-teal-600 to-cyan-500',
    darkviolet: 'from-violet-600 to-purple-500',
    darkrose: 'from-rose-600 to-pink-500',
    darkemerald: 'from-emerald-600 to-green-500',
    darkneutral: 'from-neutral-600 to-neutral-500',
    lightviolet: 'from-violet-400 to-purple-300',
    lightpink: 'from-pink-400 to-rose-300',
    lightindigo: 'from-indigo-400 to-blue-300',
    lightfuchsia: 'from-fuchsia-400 to-pink-300',
    lightlime: 'from-lime-400 to-green-300',
    lightyellow: 'from-yellow-400 to-amber-300',
    lightorange: 'from-orange-400 to-amber-300',
    lightteal: 'from-teal-400 to-cyan-300',
    lightemerald: 'from-emerald-400 to-green-300',
    lightneutral: 'from-neutral-400 to-neutral-300',
  };
  const gradient = colorMap[color] || colorMap.sky;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 tabular-nums">{pct}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
