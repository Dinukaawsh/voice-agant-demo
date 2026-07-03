import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type MetricIconTone =
  | "emerald"
  | "blue"
  | "violet"
  | "orange"
  | "rose"
  | "cyan"
  | "amber"
  | "indigo"
  | "slate";

export const METRIC_ICON_TONE_CLASSES: Record<MetricIconTone, string> = {
  emerald: "border-emerald-600 bg-emerald-200 text-emerald-600",
  blue: "border-blue-600 bg-blue-200 text-blue-600",
  violet: "border-violet-600 bg-violet-200 text-violet-600",
  orange: "border-orange-600 bg-orange-200 text-orange-600",
  rose: "border-rose-600 bg-rose-200 text-rose-600",
  cyan: "border-cyan-600 bg-cyan-200 text-cyan-600",
  amber: "border-amber-600 bg-amber-200 text-amber-600",
  indigo: "border-indigo-600 bg-indigo-200 text-indigo-600",
  slate: "border-slate-600 bg-slate-200 text-slate-600",
};

const TONE_CLASSES = METRIC_ICON_TONE_CLASSES;

const ICON_SIZES = {
  md: { box: "h-10 w-10 rounded-xl", icon: "h-[18px] w-[18px]" },
  sm: { box: "h-8 w-8 rounded-lg", icon: "h-[15px] w-[15px]" },
} as const;

export function MetricIconBox({
  icon: Icon,
  tone,
  className,
  size = "md",
}: {
  icon: LucideIcon;
  tone: MetricIconTone;
  className?: string;
  size?: keyof typeof ICON_SIZES;
}) {
  const s = ICON_SIZES[size];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border-2",
        s.box,
        TONE_CLASSES[tone],
        className,
      )}
    >
      <Icon className={s.icon} strokeWidth={2.25} />
    </div>
  );
}

export function MetricIconButton({
  icon: Icon,
  tone,
  label,
  onClick,
  className,
}: {
  icon: LucideIcon;
  tone: MetricIconTone;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div className="group/tip relative inline-flex">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-transform hover:scale-105 active:scale-95",
          TONE_CLASSES[tone],
          className,
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}
