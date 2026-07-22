"use client";

import { useState, useRef } from "react";
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
  GripVertical,
  Play,
  Pause,
  X,
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

function RecordingBadge({
  has,
  onUpload,
  onDelete,
  onPreview,
}: {
  has: boolean;
  onUpload?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  if (!has) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpload?.();
        }}
        className="flex items-center gap-1 rounded-full border border-dashed border-[#5B58EB]/30 bg-white px-2 py-0.5 text-[10px] font-semibold text-[#5B58EB] transition-all hover:bg-[#5B58EB]/5"
      >
        <Upload className="h-3 w-3" />
        Upload
      </button>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setPlaying(!playing);
          onPreview?.();
          if (!playing) setTimeout(() => setPlaying(false), 3000);
        }}
        className="flex items-center gap-1 rounded-l-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 transition-all hover:bg-emerald-200"
      >
        {playing ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
        {playing ? "Playing" : "Preview"}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpload?.();
        }}
        className="bg-emerald-100 px-1.5 py-0.5 text-emerald-700 transition-all hover:bg-emerald-200"
        title="Re-upload"
      >
        <Upload className="h-2.5 w-2.5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="rounded-r-full bg-emerald-100 px-1.5 py-0.5 text-emerald-700 transition-all hover:bg-red-100 hover:text-red-600"
        title="Delete recording"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </div>
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
  onEdit,
  onDelete,
  onUpload,
  onDeleteRecording,
  isDragging,
  dragHandleProps,
}: {
  node: FlowNode;
  onEdit: () => void;
  onDelete?: () => void;
  onUpload?: () => void;
  onDeleteRecording?: () => void;
  isDragging?: boolean;
  dragHandleProps?: {
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    draggable: boolean;
  };
}) {
  const style = NODE_STYLES[node.type];
  const Icon = TYPE_ICONS[node.type];
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={cn("group/node relative w-full transition-all", isDragging && "opacity-50 scale-95")}>
      <div
        className={cn(
          "rounded-xl border-2 transition-all hover:shadow-md",
          style.border,
          style.bg,
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          {node.type === "question" && dragHandleProps && (
            <div
              {...dragHandleProps}
              className="cursor-grab rounded p-0.5 text-[#7b89a8] opacity-0 transition-opacity hover:bg-white hover:text-[#0A2353] group-hover/node:opacity-100 active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
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
            <RecordingBadge
              has={node.type === "opening" ? false : node.hasRecording}
              onUpload={onUpload}
              onDelete={onDeleteRecording}
            />
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
                    <RecordingBadge has={sub.hasRecording} onUpload={onUpload} />
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
          <div className="flex-1" />
          <RecordingBadge has={hasRecording} onUpload={onUpload} />
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
    <div className="flex flex-col items-center">
      <div className={cn("h-4 w-0.5", lineColor)} />
      {label && (
        <span
          className={cn(
            "my-0.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
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
      <div className={cn("h-3 w-0.5", lineColor)} />
      <ArrowDown className={cn("h-3 w-3 -mt-[1px]", arrowColor)} />
    </div>
  );
}

function BranchRow({
  node,
  onEdit,
  onUpload,
  onDelete,
  onDeleteRecording,
  isLast,
  dragHandleProps,
  isDragging,
  onDragOver,
  onDrop,
}: {
  node: FlowNode;
  onEdit: () => void;
  onUpload: () => void;
  onDelete?: () => void;
  onDeleteRecording?: () => void;
  isLast: boolean;
  dragHandleProps?: {
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    draggable: boolean;
  };
  isDragging?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}) {
  const hasFail = !!(node.rule && node.failScript);

  return (
    <div
      className="relative w-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {hasFail ? (
        <div className="flex w-full items-start justify-center">
          <div className="flex max-w-lg flex-1 flex-col items-center">
            <NodeCard
              node={node}
              onEdit={onEdit}
              onUpload={onUpload}
              onDelete={onDelete}
              onDeleteRecording={onDeleteRecording}
              isDragging={isDragging}
              dragHandleProps={dragHandleProps}
            />
            {!isLast && (
              <VerticalConnector label="PASS" color="green" />
            )}
          </div>
          <div className="flex items-start pt-6">
            <div className="flex items-center">
              <div className="h-0.5 w-8 bg-red-400" />
              <div className="flex flex-col items-center">
                <span className="mb-1 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600">
                  FAIL
                </span>
                <ArrowRight className="-ml-0.5 h-3.5 w-3.5 text-red-400" />
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
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-lg flex-col items-center">
            <NodeCard
              node={node}
              onEdit={onEdit}
              onUpload={onUpload}
              onDelete={onDelete}
              onDeleteRecording={onDeleteRecording}
              isDragging={isDragging}
              dragHandleProps={dragHandleProps}
            />
            {!isLast && (
              <VerticalConnector />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function FlowDiagram({
  nodes,
  onEdit,
  onUpload,
  onDelete,
  onDeleteRecording,
  onAddQuestion,
  onReorder,
}: {
  nodes: FlowNode[];
  onEdit?: (nodeId: string) => void;
  onUpload?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  onDeleteRecording?: (nodeId: string) => void;
  onAddQuestion?: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  function handleDragStart(index: number) {
    return (e: React.DragEvent) => {
      setDragIndex(index);
      e.dataTransfer.effectAllowed = "move";
    };
  }

  function handleDragEnd() {
    return (_e: React.DragEvent) => {
      setDragIndex(null);
      setDropTarget(null);
    };
  }

  function handleDragOver(index: number) {
    return (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragIndex !== null && index !== dragIndex) {
        setDropTarget(index);
      }
    };
  }

  function handleDrop(index: number) {
    return (e: React.DragEvent) => {
      e.preventDefault();
      if (dragIndex !== null && dragIndex !== index) {
        onReorder?.(dragIndex, index);
      }
      setDragIndex(null);
      setDropTarget(null);
    };
  }

  return (
    <div className="flex flex-col items-center px-6 py-4">
      {/* Start pill */}
      <div className="flex items-center gap-2 rounded-full bg-[#112C70] px-4 py-1.5 shadow-sm">
        <Phone className="h-3.5 w-3.5 text-[#56E1E9]" />
        <span className="text-[11px] font-semibold text-white">
          Call starts
        </span>
      </div>

      <VerticalConnector />

      {nodes.map((node, i) => {
        const isQuestion = node.type === "question";
        return (
          <BranchRow
            key={node.id}
            node={node}
            onEdit={() => onEdit?.(node.id)}
            onUpload={() => onUpload?.(node.id)}
            onDelete={isQuestion ? () => onDelete?.(node.id) : undefined}
            onDeleteRecording={() => onDeleteRecording?.(node.id)}
            isLast={i === nodes.length - 1}
            isDragging={dragIndex === i}
            dragHandleProps={
              isQuestion
                ? {
                    onDragStart: handleDragStart(i),
                    onDragEnd: handleDragEnd(),
                    draggable: true,
                  }
                : undefined
            }
            onDragOver={isQuestion ? handleDragOver(i) : undefined}
            onDrop={isQuestion ? handleDrop(i) : undefined}
          />
        );
      })}

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
