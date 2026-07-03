"use client";

import { FilePen, PhoneCall } from "lucide-react";
import { cn } from "@/lib/cn";

const STATUS_META = {
  Running: {
    label: "Running",
    hint: "Actively dialing leads",
    accent: "text-emerald-600",
  },
  Paused: {
    label: "Paused",
    hint: "Campaign paused by admin",
    accent: "text-amber-600",
  },
  Draft: {
    label: "Draft",
    hint: "Not scheduled yet",
    accent: "text-slate-600",
  },
} as const;

function StatusTooltip({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group/status relative inline-flex">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover/status:opacity-100">
        <div className="whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-center shadow-lg">
          <p className="text-[11px] font-semibold text-white">{label}</p>
          <p className="text-[10px] text-slate-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}

function RunningIndicator({ meta }: { meta: (typeof STATUS_META)["Running"] }) {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center">
      <div className="relative flex flex-col items-center gap-0.5">
        <PhoneCall className={cn("h-4 w-4 campaign-status-pulse", meta.accent)} strokeWidth={2.5} />
        <span className="flex items-end gap-[2px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="campaign-status-walk-dot w-[3px] rounded-full bg-emerald-600"
              style={{ animationDelay: `${i * 0.12}s`, height: i === 1 ? 5 : 3 }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function PausedIndicator() {
  return (
    <div className="flex h-9 w-9 items-center justify-center gap-1">
      <span className="campaign-status-pause-bar h-3.5 w-1 rounded-full bg-amber-600" />
      <span className="campaign-status-pause-bar h-3.5 w-1 rounded-full bg-amber-600 [animation-delay:0.35s]" />
    </div>
  );
}

function DraftIndicator({ meta }: { meta: (typeof STATUS_META)["Draft"] }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <FilePen className={cn("h-4 w-4 campaign-status-draft-icon", meta.accent)} strokeWidth={2.5} />
    </div>
  );
}

export function CampaignStatusIndicator({ status }: { status: string }) {
  const key = status in STATUS_META ? (status as keyof typeof STATUS_META) : "Draft";

  return (
    <StatusTooltip label={STATUS_META[key].label} hint={STATUS_META[key].hint}>
      {key === "Running" && <RunningIndicator meta={STATUS_META.Running} />}
      {key === "Paused" && <PausedIndicator />}
      {key === "Draft" && <DraftIndicator meta={STATUS_META.Draft} />}
    </StatusTooltip>
  );
}
