"use client";

import {
  Check,
  CircleDashed,
  LoaderCircle,
  PhoneMissed,
  PhoneOutgoing,
} from "lucide-react";
import { cn } from "@/lib/cn";

type StatusKey = "Qualified" | "Callback" | "In progress" | "No answer" | "Not called";

const STATUS_META: Record<
  StatusKey,
  { label: string; hint: string; chip: string; bar?: string }
> = {
  Qualified: {
    label: "Qualified",
    hint: "Lead qualified on call",
    chip: "border-emerald-600/25 bg-emerald-50 text-emerald-600",
  },
  Callback: {
    label: "Callback",
    hint: "Scheduled for callback",
    chip: "border-violet-600/25 bg-violet-50 text-violet-600",
  },
  "In progress": {
    label: "In progress",
    hint: "Call in progress",
    chip: "border-blue-600/25 bg-blue-50 text-blue-600",
  },
  "No answer": {
    label: "No answer",
    hint: "No answer after attempts",
    chip: "border-amber-600/25 bg-amber-50 text-amber-600",
    bar: "bg-amber-600",
  },
  "Not called": {
    label: "Not called",
    hint: "Not dialed yet",
    chip: "border-slate-500/25 bg-slate-50 text-slate-600",
  },
};

function StatusTooltip({
  hint,
  children,
}: {
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group/status relative inline-flex max-w-full">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover/status:opacity-100">
        <div className="whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-center shadow-lg">
          <p className="text-[10px] text-slate-300">{hint}</p>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status, barClass }: { status: StatusKey; barClass?: string }) {
  switch (status) {
    case "Qualified":
      return <Check className="h-3 w-3 campaign-status-pulse" strokeWidth={2.75} />;
    case "Callback":
      return <PhoneOutgoing className="h-3 w-3 campaign-status-draft-icon" strokeWidth={2.5} />;
    case "In progress":
      return <LoaderCircle className="h-3 w-3 campaign-status-spin" strokeWidth={2.5} />;
    case "No answer":
      return (
        <span className="flex items-center gap-[2px]" aria-hidden>
          <span className={cn("campaign-status-pause-bar h-2.5 w-[3px] rounded-full", barClass)} />
          <span
            className={cn("campaign-status-pause-bar h-2.5 w-[3px] rounded-full [animation-delay:0.35s]", barClass)}
          />
        </span>
      );
    case "Not called":
      return <CircleDashed className="h-3 w-3" strokeWidth={2.25} />;
    default:
      return <PhoneMissed className="h-3 w-3" strokeWidth={2.5} />;
  }
}

function StatusChip({
  label,
  hint,
  chipClass,
  status,
  barClass,
}: {
  label: string;
  hint: string;
  chipClass: string;
  status: StatusKey;
  barClass?: string;
}) {
  return (
    <StatusTooltip hint={hint}>
      <span
        className={cn(
          "inline-flex max-w-full items-center gap-1.5 rounded-[5px] border px-2 py-1 text-[11px] font-semibold leading-none",
          chipClass,
        )}
      >
        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
          <StatusIcon status={status} barClass={barClass} />
        </span>
        <span className="truncate">{label}</span>
      </span>
    </StatusTooltip>
  );
}

export function leadStatusAccent(status: string) {
  if (status === "Qualified") return "border-l-emerald-500";
  if (status === "Callback") return "border-l-violet-500";
  if (status === "In progress") return "border-l-blue-500";
  if (status === "No answer") return "border-l-amber-500";
  return "border-l-slate-300";
}

export function LeadStatusIndicator({ status }: { status: string }) {
  const key = status in STATUS_META ? (status as StatusKey) : null;
  const meta = key
    ? STATUS_META[key]
    : {
        label: status,
        hint: "Lead status",
        chip: "border-slate-500/25 bg-slate-50 text-slate-600",
      };

  if (key) {
    return (
      <StatusChip
        label={meta.label}
        hint={meta.hint}
        chipClass={meta.chip}
        status={key}
        barClass={STATUS_META[key].bar}
      />
    );
  }

  return (
    <StatusTooltip hint={meta.hint}>
      <span
        className={cn(
          "inline-flex max-w-full items-center gap-1.5 rounded-[5px] border px-2 py-1 text-[11px] font-semibold leading-none",
          meta.chip,
        )}
      >
        <PhoneMissed className="h-3 w-3 shrink-0" strokeWidth={2.5} />
        <span className="truncate">{meta.label}</span>
      </span>
    </StatusTooltip>
  );
}
