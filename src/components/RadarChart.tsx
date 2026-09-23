import type { CompetencyScore } from '../types';

interface RadarChartProps {
  scores: CompetencyScore[];
  size?: number;
}

export function RadarChart({ scores, size = 240 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = (Math.PI * 2) / scores.length;

  const points = scores.map((s, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (s.score / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 28) * Math.cos(angle),
      labelY: center + (radius + 28) * Math.sin(angle),
      label: s.label,
      score: s.score,
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex justify-center">
      <svg width={size + 120} height={size + 60} viewBox={`0 0 ${size + 120} ${size + 60}`} className="overflow-visible">
        <g transform={`translate(60, 20)`}>
          {gridLevels.map((level, li) => {
            const gridPts = scores.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = level * radius;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ');
            return (
              <polygon
                key={li}
                points={gridPts}
                fill="none"
                className="stroke-neutral-300 dark:stroke-neutral-600"
                strokeWidth="1"
                opacity={0.5}
              />
            );
          })}
          {scores.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(angle)}
                y2={center + radius * Math.sin(angle)}
                className="stroke-neutral-300 dark:stroke-neutral-600"
                strokeWidth="1"
                opacity={0.4}
              />
            );
          })}
          <polygon
            points={polygonPoints}
            fill="rgba(14,165,233,0.2)"
            className="stroke-sky-500"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" className="fill-sky-500" />
          ))}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.labelX}
              y={p.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-neutral-700 dark:fill-neutral-300 text-[11px] font-semibold"
            >
              {p.label}
            </text>
          ))}
          {points.map((p, i) => (
            <text
              key={`score-${i}`}
              x={p.labelX}
              y={p.labelY + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-sky-600 dark:fill-sky-400 text-[10px] font-bold"
            >
              {p.score}%
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
