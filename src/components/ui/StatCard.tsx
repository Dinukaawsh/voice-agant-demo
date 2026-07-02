import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  trend = "up",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  trend?: "up" | "down" | "neutral";
}) {
  const trendColor =
    trend === "up"
      ? "text-green"
      : trend === "down"
        ? "text-red-600"
        : "text-ink-muted";

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-soft transition-shadow hover:shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-muted">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {change && (
        <p className={`mt-1 text-xs font-medium ${trendColor}`}>{change}</p>
      )}
    </div>
  );
}
