type WaveformVariant = "cyan" | "purple" | "muted";

const VARIANTS: Record<WaveformVariant, { from: string; to: string }> = {
  cyan: { from: "#22d3ee", to: "#3b82f6" },
  purple: { from: "#c084fc", to: "#ec4899" },
  muted: { from: "#64748b", to: "#94a3b8" },
};

/** Bar heights as fractions — each bar bounces on its own delay */
const BAR_HEIGHTS = [0.45, 0.75, 1, 0.6, 0.9, 0.55, 0.85, 0.5, 0.7, 0.4, 0.8, 0.65];

export function AgentWaveform({
  variant = "cyan",
  active = false,
  className = "",
}: {
  variant?: WaveformVariant;
  active?: boolean;
  className?: string;
}) {
  const colors = VARIANTS[variant];
  const gradId = `wave-bars-${variant}`;

  return (
    <div
      className={`flex h-10 items-end justify-center gap-[3px] sm:h-11 ${className}`}
      aria-hidden
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>
      </svg>
      {BAR_HEIGHTS.map((height, i) => (
        <div
          key={i}
          className={`agent-wave-bar w-[3px] rounded-full ${active ? "agent-wave-bar-fast" : ""}`}
          style={{
            height: `${height * 100}%`,
            background: `linear-gradient(to top, ${colors.from}, ${colors.to})`,
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}
