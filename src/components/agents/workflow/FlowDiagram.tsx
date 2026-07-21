"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  Trash2,
  Pencil,
  Phone,
  PhoneOff,
  ArrowDown,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { FlowNode, AnswerType } from "./types";

const NODE_STYLES: Record<
  FlowNode["type"],
  { border: string; bg: string; icon: string; accent: string }
> = {
  opening: {
    border: "border-[#5B58EB]/30",
    bg: "bg-[#5B58EB]/5",
    icon: "text-[#5B58EB] bg-[#5B58EB]/10",
    accent: "text-[#5B58EB]",
  },
  question: {
    border: "border-[#8B63FF]/30",
    bg: "bg-[#8B63FF]/5",
    icon: "text-[#8B63FF] bg-[#8B63FF]/10",
    accent: "text-[#8B63FF]",
  },
  eligibility: {
    border: "border-[#56E1E9]/40",
    bg: "bg-[#56E1E9]/8",
    icon: "text-[#0A2353] bg-[#56E1E9]/20",
    accent: "text-[#0A2353]",
  },
  success: {
    border: "border-[#56E1E9]/40",
    bg: "bg-[#56E1E9]/5",
    icon: "text-[#0A2353] bg-[#56E1E9]/15",
    accent: "text-[#0A2353]",
  },
  exit: {
    border: "border-red-300",
    bg: "bg-red-50/60",
    icon: "text-red-600 bg-red-100",
    accent: "text-red-700",
  },
};

const ANSWER_LABELS: Record<AnswerType, { label: string; color: string }> = {
  yesno: { label: "Yes / No", color: "bg-[#56E1E9]/15 text-[#0A2353]" },
  open: { label: "Open answer", color: "bg-[#8B63FF]/15 text-[#8B63FF]" },
  choice: { label: "Multiple choice", color: "bg-[#5B58EB]/15 text-[#5B58EB]" },
};

const TYPE_ICONS: Record<FlowNode["type"], typeof Phone> = {
  opening: Phone,
  question: MessageSquare,
  eligibility: ShieldCheck,
  success: Sparkles,
  exit: PhoneOff,
};

function UploadBadge({ has }: { has: boolean }) {
  return (
    <button
      className={cn(
        "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all",
        has
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "border border-dashed border-[#5B58EB]/30 bg-white text-[#5B58EB] hover:bg-[#5B58EB]/5",
      )}
    >
      {has ? <Check className="h-3 w-3" /> : <Upload className="h-3 w-3" />}
      {has ? "Uploaded" : "Upload"}
    </button>
  );
}

function NodeCard({
  node,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: {
  node: FlowNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  const style = NODE_STYLES[node.type];
  const Icon = TYPE_ICONS[node.type];
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="group/node relative">
      <div
        className={cn(
          "rounded-xl border-2 transition-all hover:shadow-md",
          style.border,
          style.bg,
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          {node.type === "question" && (
            <div className="flex flex-col gap-0.5 opacity-0 transition-opacity group-hover/node:opacity-100">
              <button
                onClick={onMoveUp}
                disabled={!onMoveUp}
                className="rounded p-0.5 text-[#7b89a8] hover:bg-white hover:text-[#0A2353] disabled:invisible"
              >
                <ChevronUp className="h-3 w-3" />
              </button>
              <button
                onClick={onMoveDown}
                disabled={!onMoveDown}
                className="rounded p-0.5 text-[#7b89a8] hover:bg-white hover:text-[#0A2353] disabled:invisible"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", style.icon)}>
            <Icon className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={cn("text-[13px] font-semibold", style.accent)}>
                {node.label}
              </span>
              {node.answerType && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    ANSWER_LABELS[node.answerType].color,
                  )}
                >
                  {ANSWER_LABELS[node.answerType].label}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <UploadBadge has={node.type === "opening" ? false : node.hasRecording} />
            <button
              onClick={onEdit}
              className="rounded-lg p-1.5 text-[#7b89a8] transition-colors hover:bg-white hover:text-[#5B58EB]"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded-lg p-1.5 text-[#7b89a8] transition-colors hover:bg-white hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg p-1.5 text-[#7b89a8] transition-colors hover:bg-white hover:text-[#0A2353]"
            >
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Body */}
        {expanded && (
          <div className="border-t border-white/60 px-3 pb-3 pt-2">
            {/* Opening substages */}
            {node.type === "opening" && node.substages ? (
              <div className="space-y-2">
                {node.substages.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-start gap-2 rounded-lg bg-white/70 p-2"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#5B58EB]/10 text-[10px] font-bold text-[#5B58EB]">
                      {sub.label.replace("Opening ", "")}
                    </div>
                    <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-[#0A2353]/80">
                      {sub.script}
                    </p>
                    <UploadBadge has={sub.hasRecording} />
                  </div>
                ))}
                <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-[#5B58EB] transition-colors hover:bg-[#5B58EB]/5">
                  <Plus className="h-3 w-3" />
                  Add opening part
                </button>
              </div>
            ) : (
              <p className="text-[12px] leading-relaxed text-[#0A2353]/80">
                {node.script}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FailBranch({
  rule,
  failScript,
  hasRecording,
}: {
  rule: string;
  failScript: string;
  hasRecording: boolean;
}) {
  return (
    <div className="relative ml-8 mt-1 flex items-start gap-0">
      {/* Horizontal connector from the main line */}
      <div className="absolute -left-8 top-0 flex items-center">
        <div className="h-0.5 w-8 bg-red-300" />
      </div>
      {/* Fail branch card */}
      <div className="w-full max-w-sm rounded-xl border-2 border-dashed border-red-300 bg-red-50/70">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <PhoneOff className="h-3 w-3" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wide text-red-500">
            Rule fails → End call
          </span>
          <div className="flex-1" />
          <UploadBadge has={hasRecording} />
          <button className="rounded-lg p-1 text-[#7b89a8] hover:bg-white hover:text-[#5B58EB]">
            <Pencil className="h-3 w-3" />
          </button>
        </div>
        <div className="border-t border-red-200/60 px-3 pb-2.5 pt-2">
          <div className="mb-1.5 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
            <span className="text-[10px] font-semibold text-red-500">Rule: {rule}</span>
          </div>
          <p className="text-[11px] italic leading-relaxed text-red-700/80">
            {failScript}
          </p>
        </div>
        {/* End indicator */}
        <div className="flex items-center justify-center border-t border-red-200/60 py-1.5">
          <div className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-0.5">
            <PhoneOff className="h-3 w-3 text-red-500" />
            <span className="text-[10px] font-semibold text-red-600">Call ends</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Connector({ hasRule }: { hasRule?: boolean }) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className={cn("w-0.5", hasRule ? "h-3 bg-[#d0d5e4]" : "h-6 bg-[#d0d5e4]")} />
      {hasRule && (
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
            PASS → Next
          </span>
        </div>
      )}
      <ArrowDown className="h-3 w-3 text-[#d0d5e4] -mt-0.5" />
      <div className="h-2 w-0.5 bg-[#d0d5e4]" />
    </div>
  );
}

export function FlowDiagram({
  nodes,
  onEdit,
}: {
  nodes: FlowNode[];
  onEdit?: (nodeId: string) => void;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-4">
      {/* Start pill */}
      <div className="flex items-center gap-2 rounded-full bg-[#112C70] px-4 py-1.5 shadow-sm">
        <Phone className="h-3.5 w-3.5 text-[#56E1E9]" />
        <span className="text-[11px] font-semibold text-white">
          Call starts
        </span>
      </div>
      <div className="h-4 w-0.5 bg-[#d0d5e4]" />

      {nodes.map((node, i) => (
        <div key={node.id} className="w-full max-w-lg">
          <NodeCard
            node={node}
            onEdit={() => onEdit?.(node.id)}
            onMoveUp={
              node.type === "question" && i > 1
                ? () => {}
                : undefined
            }
            onMoveDown={
              node.type === "question" &&
              i < nodes.length - 3
                ? () => {}
                : undefined
            }
            onDelete={
              node.type === "question" ? () => {} : undefined
            }
          />
          {/* Fail branch — rendered as a side path from the question node */}
          {node.rule && node.failScript && (
            <FailBranch
              rule={node.rule}
              failScript={node.failScript}
              hasRecording={false}
            />
          )}
          {i < nodes.length - 1 && <Connector hasRule={!!node.rule} />}
        </div>
      ))}

      {/* Add question button */}
      <div className="mt-1 flex flex-col items-center">
        <div className="h-3 w-0.5 bg-[#d0d5e4]" />
        <button className="flex items-center gap-1.5 rounded-full border-2 border-dashed border-[#8B63FF]/30 bg-[#8B63FF]/5 px-4 py-2 text-[12px] font-medium text-[#8B63FF] transition-all hover:border-[#8B63FF]/50 hover:bg-[#8B63FF]/10">
          <Plus className="h-3.5 w-3.5" />
          Add question
        </button>
      </div>

      {/* End pill */}
      <div className="mt-3 flex flex-col items-center">
        <div className="h-4 w-0.5 bg-[#d0d5e4]" />
        <div className="flex items-center gap-2 rounded-full bg-[#112C70] px-4 py-1.5 shadow-sm">
          <PhoneOff className="h-3.5 w-3.5 text-[#56E1E9]" />
          <span className="text-[11px] font-semibold text-white">
            Call ends
          </span>
        </div>
      </div>
    </div>
  );
}
