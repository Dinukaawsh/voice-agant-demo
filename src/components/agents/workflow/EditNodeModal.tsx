"use client";

import { useState } from "react";
import {
  X,
  Save,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  PhoneOff,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { FlowNode, AnswerType } from "./types";

const TYPE_ICONS: Record<FlowNode["type"], typeof Phone> = {
  opening: Phone,
  question: MessageSquare,
  eligibility: ShieldCheck,
  success: Sparkles,
  exit: PhoneOff,
};

const ANSWER_TYPES: { value: AnswerType; label: string }[] = [
  { value: "yesno", label: "Yes / No" },
  { value: "open", label: "Open answer" },
  { value: "choice", label: "Multiple choice" },
];

export function EditNodeModal({
  node,
  onClose,
  onSave,
}: {
  node: FlowNode;
  onClose: () => void;
  onSave: (updated: FlowNode) => void;
}) {
  const [script, setScript] = useState(node.script);
  const [label, setLabel] = useState(node.label);
  const [answerType, setAnswerType] = useState<AnswerType | undefined>(node.answerType);
  const [rule, setRule] = useState(node.rule || "");
  const [failScript, setFailScript] = useState(node.failScript || "");
  const [substages, setSubstages] = useState(node.substages || []);
  const Icon = TYPE_ICONS[node.type];

  function handleSave() {
    onSave({
      ...node,
      label,
      script,
      answerType,
      rule: rule || undefined,
      failScript: failScript || undefined,
      substages: substages.length > 0 ? substages : undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#d0d5e4] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#d0d5e4] px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5B58EB]/10 text-[#5B58EB]">
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-semibold text-[#0A2353]">
              Edit {node.type === "opening" ? "Opening" : node.label}
            </h2>
            <p className="text-[11px] text-[#7b89a8]">
              Modify the script and settings for this node
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#7b89a8] hover:bg-[#f0f2f8] hover:text-[#0A2353]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {/* Label */}
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#0A2353]">
              Label
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-lg border border-[#d0d5e4] px-3 py-2 text-[13px] text-[#0A2353] transition-all focus:border-[#5B58EB]/40 focus:outline-none focus:ring-2 focus:ring-[#5B58EB]/10"
            />
          </div>

          {/* Script — for opening nodes, show substages */}
          {node.type === "opening" && substages.length > 0 ? (
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#0A2353]">
                Opening parts
              </label>
              <div className="space-y-2">
                {substages.map((sub, i) => (
                  <div key={sub.id} className="rounded-lg border border-[#d0d5e4] bg-[#f0f2f8]/50 p-3">
                    <div className="mb-1.5 text-[11px] font-semibold text-[#5B58EB]">
                      Part {i + 1}
                    </div>
                    <textarea
                      value={sub.script}
                      onChange={(e) => {
                        const updated = [...substages];
                        updated[i] = { ...sub, script: e.target.value };
                        setSubstages(updated);
                      }}
                      rows={2}
                      className="w-full rounded-lg border border-[#d0d5e4] bg-white px-3 py-2 text-[12px] text-[#0A2353] transition-all focus:border-[#5B58EB]/40 focus:outline-none focus:ring-2 focus:ring-[#5B58EB]/10"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#0A2353]">
                Script
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#d0d5e4] px-3 py-2 text-[13px] leading-relaxed text-[#0A2353] transition-all focus:border-[#5B58EB]/40 focus:outline-none focus:ring-2 focus:ring-[#5B58EB]/10"
              />
            </div>
          )}

          {/* Answer type — only for question nodes */}
          {node.type === "question" && (
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#0A2353]">
                Answer type
              </label>
              <div className="flex gap-2">
                {ANSWER_TYPES.map((at) => (
                  <button
                    key={at.value}
                    onClick={() => setAnswerType(at.value)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all",
                      answerType === at.value
                        ? "border-[#5B58EB] bg-[#5B58EB]/10 text-[#5B58EB]"
                        : "border-[#d0d5e4] text-[#7b89a8] hover:border-[#5B58EB]/30 hover:text-[#0A2353]",
                    )}
                  >
                    {at.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rule — only for question nodes */}
          {node.type === "question" && (
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#0A2353]">
                Rule (optional)
              </label>
              <input
                value={rule}
                onChange={(e) => setRule(e.target.value)}
                placeholder="e.g. Must answer yes or no clearly"
                className="w-full rounded-lg border border-[#d0d5e4] px-3 py-2 text-[13px] text-[#0A2353] placeholder:text-[#7b89a8] transition-all focus:border-[#5B58EB]/40 focus:outline-none focus:ring-2 focus:ring-[#5B58EB]/10"
              />
              {rule && (
                <div className="mt-2">
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#0A2353]">
                    Fail script (exit message when rule fails)
                  </label>
                  <textarea
                    value={failScript}
                    onChange={(e) => setFailScript(e.target.value)}
                    rows={2}
                    placeholder="What to say when this rule fails..."
                    className="w-full rounded-lg border border-[#d0d5e4] px-3 py-2 text-[12px] text-[#0A2353] placeholder:text-[#7b89a8] transition-all focus:border-[#5B58EB]/40 focus:outline-none focus:ring-2 focus:ring-[#5B58EB]/10"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#d0d5e4] px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-[12px] font-medium text-[#7b89a8] hover:bg-[#f0f2f8] hover:text-[#0A2353]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-full bg-[#5B58EB] px-5 py-2 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#4a47d4]"
          >
            <Save className="h-3.5 w-3.5" />
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
