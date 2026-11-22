"use client";

type Entry = {
  id: string;
  date: string;
  energy: number;
  mood: number;
  brainFog: number;
  joint: number;
  weight?: number | null;
};

type Props = { entries: Entry[] };

const METRICS = [
  { key: "energy",   label: "Energy",                  color: "#4a7c59" },
  { key: "mood",     label: "Mood",                    color: "#6b8cba" },
  { key: "brainFog", label: "Brain Fog (10 = clear)",  color: "#e8954a" },
  { key: "joint",    label: "Joint Pain (10 = none)",  color: "#c0624a" },
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
  const yOf = (v: number) => PT + ((10 - v) / 9) * chartH;

  const getValue = (e: Entry, key: string): number => (e as unknown as Record<string, number>)[key];

  // Weight: normalize to 1–10 scale using min/max across entries that have weight
  const weightEntries = sorted.filter(e => e.weight != null) as (Entry & { weight: number })[];
  const hasWeight = weightEntries.length >= 2;
  const wMin = hasWeight ? Math.min(...weightEntries.map(e => e.weight)) : 0;
  const wMax = hasWeight ? Math.max(...weightEntries.map(e => e.weight)) : 1;
  const wRange = wMax - wMin || 1;
  // Map weight to 1–10: lower weight → higher score (so trending down shows as rising line)
  // Actually just show weight as-is normalized, with its own label. No inversion.
  const yOfWeight = (w: number) => PT + ((wMax - w) / wRange) * chartH;

  const labelIdxs = n <= 7
    ? sorted.map((_, i) => i)
    : [0, Math.round(n * 0.33), Math.round(n * 0.66), n - 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }} role="img" aria-label="Symptom trends chart. Scores from 1 to 10, higher is better.">
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

        {/* Weight line (dashed, normalized to chart height) */}
        {hasWeight && (
          <polyline
            points={weightEntries.map((e, _i) => {
              const globalIdx = sorted.findIndex(s => s.id === e.id);
              return `${xOf(globalIdx)},${yOfWeight(e.weight)}`;
            }).join(" ")}
            fill="none"
            stroke="#9b7cb8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Dots for latest point */}
        {METRICS.map(({ key, color }) => (
          <circle key={key} cx={xOf(n - 1)} cy={yOf(getValue(sorted[n - 1], key))} r="3" fill={color} />
        ))}
        {hasWeight && (() => {
          const last = weightEntries[weightEntries.length - 1];
          const idx = sorted.findIndex(s => s.id === last.id);
          return <circle cx={xOf(idx)} cy={yOfWeight(last.weight)} r="3" fill="#9b7cb8" />;
        })()}

        {/* X-axis date labels */}
        {labelIdxs.map((i) => (
          <text key={i} x={xOf(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize="9" fill="#a0a89a">
            {new Date(sorted[i].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <p className="text-[11px] text-forest/40 mt-2 px-1">Higher is better on every symptom line.</p>
      <div className="flex flex-wrap gap-4 mt-1 px-1">
        {METRICS.map(({ key, label, color }) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-forest/60">
            <span className="w-4 h-0.5 rounded-full inline-block" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
        {hasWeight && (
          <span className="flex items-center gap-1.5 text-xs text-forest/60">
            <span className="w-4 inline-block" style={{ borderTop: "1.5px dashed #9b7cb8" }} />
            Weight (scaled)
          </span>
        )}
      </div>
      {hasWeight && wMin !== wMax && (
        <p className="text-[10px] text-forest/30 mt-1 px-1">
          Weight range: {wMin}–{wMax} lbs. Line shows relative trend only.
        </p>
      )}
    </div>
  );
}
