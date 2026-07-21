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
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Upload,
  Settings2,
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

function UploadBadge({
  has,
  onClick,
}: {
  has: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
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

function RuleBadge({ rule, onEditRule }: { rule: string; onEditRule?: () => void }) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-amber-300/60 bg-amber-50/80 px-3 py-1.5">
      <Settings2 className="h-3.5 w-3.5 shrink-0 text-amber-600" />
      <span className="min-w-0 flex-1 text-[11px] font-medium text-amber-800">
        Rule: {rule}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditRule?.();
        }}
        className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 transition-colors hover:bg-amber-100"
      >
        <Pencil className="h-2.5 w-2.5" />
        Edit rule
      </button>
    </div>
  );
}

function NodeCard({
  node,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onUpload,
}: {
  node: FlowNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onUpload?: () => void;
}) {
  const style = NODE_STYLES[node.type];
  const Icon = TYPE_ICONS[node.type];
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="group/node relative w-full">
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
            <UploadBadge has={node.type === "opening" ? false : node.hasRecording} onClick={onUpload} />
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
                    <UploadBadge has={sub.hasRecording} onClick={onUpload} />
                  </div>
                ))}
                <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-[#5B58EB] transition-colors hover:bg-[#5B58EB]/5">
                  <Plus className="h-3 w-3" />
                  Add opening part
                </button>
              </div>
            ) : (
              <>
                <p className="text-[12px] leading-relaxed text-[#0A2353]/80">
                  {node.script}
                </p>
                {node.rule && <RuleBadge rule={node.rule} onEditRule={onEdit} />}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EndNode({ failScript, hasRecording, onUpload }: { failScript: string; hasRecording: boolean; onUpload?: () => void }) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full rounded-xl border-2 border-red-300/60 bg-red-50/80">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
            <PhoneOff className="h-3 w-3" />
          </div>
          <span className="text-[12px] font-bold text-red-700">
            END
          </span>
          <span className="text-[11px] text-red-500">Fin de l&apos;appel</span>
          <div className="flex-1" />
          <UploadBadge has={hasRecording} onClick={onUpload} />
          <button className="rounded-lg p-1 text-[#7b89a8] hover:bg-white hover:text-[#5B58EB]">
            <Pencil className="h-3 w-3" />
          </button>
        </div>
        <div className="border-t border-red-200/60 px-3 pb-2.5 pt-2">
          <p className="text-[11px] italic leading-relaxed text-red-700/80">
            &ldquo;{failScript}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function VerticalConnector({ label, color = "gray" }: { label?: string; color?: "gray" | "green" | "red" }) {
  const lineColor = color === "green" ? "bg-emerald-400" : color === "red" ? "bg-red-400" : "bg-[#d0d5e4]";
  const arrowColor = color === "green" ? "text-emerald-400" : color === "red" ? "text-red-400" : "text-[#d0d5e4]";

  return (
    <div className="flex flex-col items-center py-0.5">
      <div className={cn("h-5 w-0.5 rounded-full", lineColor)} />
      {label && (
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
            color === "green"
              ? "bg-emerald-100 text-emerald-700"
              : color === "red"
                ? "bg-red-100 text-red-600"
                : "bg-[#e4e7f1] text-[#7b89a8]",
          )}
        >
          {label}
        </span>
      )}
      <ArrowDown className={cn("h-3.5 w-3.5", arrowColor)} />
      <div className={cn("h-3 w-0.5 rounded-full", lineColor)} />
    </div>
  );
}

function BranchRow({
  node,
  onEdit,
  onUpload,
  onDelete,
  isLast,
  onMoveUp,
  onMoveDown,
}: {
  node: FlowNode;
  onEdit: () => void;
  onUpload: () => void;
  onDelete?: () => void;
  isLast: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const hasFail = !!(node.rule && node.failScript);

  return (
    <div className="relative w-full">
      <div className={cn("flex items-start gap-0", hasFail ? "justify-start" : "justify-center")}>
        {/* Main node column */}
        <div className={cn("flex flex-col items-center", hasFail ? "w-[55%] shrink-0" : "w-full max-w-lg")}>
          <NodeCard
            node={node}
            onEdit={onEdit}
            onUpload={onUpload}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
          />
          {!isLast && (
            <VerticalConnector
              label={hasFail ? "PASS" : undefined}
              color={hasFail ? "green" : "gray"}
            />
          )}
        </div>

        {/* Fail branch */}
        {hasFail && (
          <div className="flex items-start pt-6">
            <div className="flex items-center">
              <div className="h-0.5 w-8 bg-red-400" />
              <div className="flex flex-col items-center">
                <span className="mb-1 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600">
                  FAIL
                </span>
                <ArrowRight className="h-3.5 w-3.5 -ml-0.5 text-red-400" />
              </div>
              <div className="h-0.5 w-4 bg-red-400" />
            </div>
            <div className="w-52 shrink-0">
              <EndNode
                failScript={node.failScript!}
                hasRecording={false}
                onUpload={onUpload}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FlowDiagram({
  nodes,
  onEdit,
  onUpload,
  onDelete,
  onAddQuestion,
}: {
  nodes: FlowNode[];
  onEdit?: (nodeId: string) => void;
  onUpload?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onAddQuestion?: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-4">
      {/* Start pill */}
      <div className="flex items-center gap-2 rounded-full bg-[#112C70] px-4 py-1.5 shadow-sm">
        <Phone className="h-3.5 w-3.5 text-[#56E1E9]" />
        <span className="text-[11px] font-semibold text-white">
          Call starts
        </span>
      </div>

      {/* Connector from start to first node */}
      <VerticalConnector />

      {nodes.map((node, i) => (
        <BranchRow
          key={node.id}
          node={node}
          onEdit={() => onEdit?.(node.id)}
          onUpload={() => onUpload?.(node.id)}
          onDelete={node.type === "question" ? () => onDelete?.(node.id) : undefined}
          isLast={i === nodes.length - 1}
          onMoveUp={
            node.type === "question" && i > 1
              ? () => {}
              : undefined
          }
          onMoveDown={
            node.type === "question" && i < nodes.length - 3
              ? () => {}
              : undefined
          }
        />
      ))}

      {/* Add question button */}
      <div className="flex flex-col items-center">
        <VerticalConnector />
        <button
          onClick={onAddQuestion}
          className="flex items-center gap-1.5 rounded-full border-2 border-dashed border-[#8B63FF]/30 bg-[#8B63FF]/5 px-4 py-2 text-[12px] font-medium text-[#8B63FF] transition-all hover:border-[#8B63FF]/50 hover:bg-[#8B63FF]/10"
        >
          <Plus className="h-3.5 w-3.5" />
          Add question
        </button>
      </div>

      {/* End pill */}
      <div className="flex flex-col items-center">
        <VerticalConnector />
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
