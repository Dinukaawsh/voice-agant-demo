"use client";

import {
  Check,
  CircleDashed,
  LoaderCircle,
  PhoneMissed,
  PhoneOutgoing,
} from "lucide-react";
import { cn } from "@/lib/cn";

const STATUS_META: Record<string, { label: string; hint: string; accent: string }> = {
  Qualified: { label: "Qualified", hint: "Lead qualified on call", accent: "text-emerald-600" },
  Callback: { label: "Callback", hint: "Scheduled for callback", accent: "text-violet-600" },
  "In progress": { label: "In progress", hint: "Call in progress", accent: "text-blue-600" },
  "No answer": { label: "No answer", hint: "No answer after attempts", accent: "text-amber-600" },
  "Not called": { label: "Not called", hint: "Not dialed yet", accent: "text-slate-500" },
};

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

function QualifiedIndicator({ accent }: { accent: string }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <Check className={cn("h-4 w-4 campaign-status-pulse", accent)} strokeWidth={2.75} />
    </div>
  );
}

function CallbackIndicator({ accent }: { accent: string }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <PhoneOutgoing className={cn("h-4 w-4 campaign-status-draft-icon", accent)} strokeWidth={2.5} />
    </div>
  );
}

function InProgressIndicator({ accent }: { accent: string }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <LoaderCircle className={cn("h-4 w-4 campaign-status-spin", accent)} strokeWidth={2.5} />
    </div>
  );
}

function NoAnswerIndicator() {
  return (
    <div className="flex h-9 w-9 items-center justify-center gap-1">
      <span className="campaign-status-pause-bar h-3.5 w-1 rounded-full bg-amber-600" />
      <span className="campaign-status-pause-bar h-3.5 w-1 rounded-full bg-amber-600 [animation-delay:0.35s]" />
    </div>
  );
}

function NotCalledIndicator({ accent }: { accent: string }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <CircleDashed className={cn("h-4 w-4 text-slate-500", accent)} strokeWidth={2.25} />
    </div>
  );
}

function DefaultIndicator({ accent }: { accent: string }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <PhoneMissed className={cn("h-4 w-4", accent)} strokeWidth={2.5} />
    </div>
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
  const meta = STATUS_META[status] ?? {
    label: status,
    hint: "Lead status",
    accent: "text-slate-600",
  };

  return (
    <StatusTooltip label={meta.label} hint={meta.hint}>
      {status === "Qualified" && <QualifiedIndicator accent={meta.accent} />}
      {status === "Callback" && <CallbackIndicator accent={meta.accent} />}
      {status === "In progress" && <InProgressIndicator accent={meta.accent} />}
      {status === "No answer" && <NoAnswerIndicator />}
      {status === "Not called" && <NotCalledIndicator accent={meta.accent} />}
      {!STATUS_META[status] && <DefaultIndicator accent={meta.accent} />}
    </StatusTooltip>
  );
}
