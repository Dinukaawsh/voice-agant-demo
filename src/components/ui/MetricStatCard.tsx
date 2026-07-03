"use client";

import type { LucideIcon } from "lucide-react";
import { MetricIconBox, type MetricIconTone } from "@/components/ui/MetricIconBox";
import { cn } from "@/lib/cn";

export type MetricStatCardProps = {
  label: string;
  value: string;
  sub: React.ReactNode;
  icon: LucideIcon;
  tone: MetricIconTone;
  ring: string;
  glow: string;
  badge?: React.ReactNode;
};

export function MetricStatCard({
  label,
  value,
  sub,
  icon,
  tone,
  ring,
  glow,
  badge,
}: MetricStatCardProps) {
  return (
    <div
      className={cn(
        "dashboard-stat-card group relative overflow-hidden rounded-xl border border-border bg-white p-3 shadow-soft ring-1 transition-all hover:-translate-y-0.5 hover:shadow-card sm:p-3.5",
        ring,
      )}
    >
      <div className={cn("dashboard-stat-glow", glow)} />
      <div className="relative flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-ink-hint">
            {label}
          </p>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-xl font-bold tabular-nums tracking-tight text-ink sm:text-[1.35rem]">
              {value}
            </p>
            {badge}
          </div>
          <p className="mt-0.5 truncate text-[11px] leading-snug text-ink-muted">{sub}</p>
        </div>
        <MetricIconBox icon={icon} tone={tone} size="sm" />
      </div>
    </div>
  );
}

export function MetricStatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}
