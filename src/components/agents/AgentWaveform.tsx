type WaveformVariant = "cyan" | "purple" | "muted";

const VARIANTS: Record<
  WaveformVariant,
  { from: string; to: string; glow: string }
> = {
  cyan: { from: "#22d3ee", to: "#3b82f6", glow: "#22d3ee" },
  purple: { from: "#c084fc", to: "#ec4899", glow: "#a855f7" },
  muted: { from: "#64748b", to: "#94a3b8", glow: "#64748b" },
};

const PATHS: Record<WaveformVariant, string> = {
  cyan: "M0 24 C12 8 18 40 30 24 S48 8 60 24 S78 40 90 24 S108 10 120 24",
  purple: "M0 28 C14 12 20 36 34 22 S52 38 68 20 S84 8 100 26 S112 34 120 18",
  muted: "M0 22 C10 22 16 30 28 22 S40 14 52 22 S64 30 76 22 S92 18 120 22",
};

export function AgentWaveform({
  variant = "cyan",
  className = "",
}: {
  variant?: WaveformVariant;
  className?: string;
}) {
  const colors = VARIANTS[variant];
  const path = PATHS[variant];
  const gradId = `wave-${variant}`;

  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      aria-hidden
      className={`agent-waveform h-10 w-28 shrink-0 sm:h-11 sm:w-32 ${className}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
        <filter id={`${gradId}-glow`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={path}
        stroke={`url(#${gradId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        filter={`url(#${gradId}-glow)`}
        className="agent-waveform-path"
      />
    </svg>
  );
}
