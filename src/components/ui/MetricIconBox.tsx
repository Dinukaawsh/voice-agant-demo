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
  | "indigo";

const TONE_CLASSES: Record<MetricIconTone, string> = {
  emerald: "border-emerald-600 bg-emerald-200 text-emerald-600",
  blue: "border-blue-600 bg-blue-200 text-blue-600",
  violet: "border-violet-600 bg-violet-200 text-violet-600",
  orange: "border-orange-600 bg-orange-200 text-orange-600",
  rose: "border-rose-600 bg-rose-200 text-rose-600",
  cyan: "border-cyan-600 bg-cyan-200 text-cyan-600",
  amber: "border-amber-600 bg-amber-200 text-amber-600",
  indigo: "border-indigo-600 bg-indigo-200 text-indigo-600",
};

export function MetricIconBox({
  icon: Icon,
  tone,
  className,
}: {
  icon: LucideIcon;
  tone: MetricIconTone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2",
        TONE_CLASSES[tone],
        className,
      )}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
    </div>
  );
}
