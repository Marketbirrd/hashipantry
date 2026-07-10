"use client";

type Entry = {
  id: string;
  date: string;
  energy: number;
  mood: number;
  brainFog: number;
  joint: number;
};

type Props = { entries: Entry[] };

const METRICS = [
  { key: "energy",   label: "Energy",     color: "#4a7c59" },
  { key: "mood",     label: "Mood",       color: "#6b8cba" },
  { key: "brainFog", label: "Brain Fog",  color: "#e8954a" },
  { key: "joint",    label: "Joint Pain", color: "#c0624a" },
] as const;

const W = 600, H = 180, PL = 28, PR = 12, PT = 12, PB = 32;
const chartW = W - PL - PR;
const chartH = H - PT - PB;

export default function SymptomChart({ entries }: Props) {
  if (entries.length < 2) {
    return (
      <div className="flex items-center justify-center h-32 text-forest/30 text-sm">
        Log at least 2 entries to see your chart
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const n = sorted.length;

  const xOf = (i: number) => PL + (i / (n - 1)) * chartW;
  // Score 10 → top (PT), score 1 → bottom (H - PB)
  const yOf = (v: number) => PT + ((10 - v) / 9) * chartH;

  const getValue = (e: Entry, key: string): number => (e as unknown as Record<string, number>)[key];

  // X-axis date labels — show first, last, and a couple in between
  const labelIdxs = n <= 7
    ? sorted.map((_, i) => i)
    : [0, Math.round(n * 0.33), Math.round(n * 0.66), n - 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
        {/* Grid lines */}
        {[2, 4, 6, 8, 10].map((v) => (
          <g key={v}>
            <line x1={PL} y1={yOf(v)} x2={W - PR} y2={yOf(v)} stroke="#e8ebe4" strokeWidth="1" />
            <text x={PL - 4} y={yOf(v) + 4} textAnchor="end" fontSize="9" fill="#a0a89a">{v}</text>
          </g>
        ))}

        {/* Metric lines */}
        {METRICS.map(({ key, color }) => (
          <polyline
            key={key}
            points={sorted.map((e, i) => `${xOf(i)},${yOf(getValue(e, key))}`).join(" ")}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Dots for latest point */}
        {METRICS.map(({ key, color }) => (
          <circle
            key={key}
            cx={xOf(n - 1)}
            cy={yOf(getValue(sorted[n - 1], key))}
            r="3"
            fill={color}
          />
        ))}

        {/* X-axis date labels */}
        {labelIdxs.map((i) => (
          <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#a0a89a">
            {new Date(sorted[i].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-2 px-1">
        {METRICS.map(({ key, label, color }) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-forest/60">
            <span className="w-4 h-0.5 rounded-full inline-block" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
