"use client";

import { useState } from "react";
import {
  X,
  Mic,
  Check,
  Clock,
  Send,
  FileAudio,
  Phone,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  PhoneOff,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { FlowNode } from "./types";

const TYPE_ICONS: Record<FlowNode["type"], typeof Phone> = {
  opening: Phone,
  question: MessageSquare,
  eligibility: ShieldCheck,
  success: Sparkles,
  exit: PhoneOff,
};

export function RequestRecordingsModal({
  nodes,
  agentName,
  onClose,
  onSubmit,
}: {
  nodes: FlowNode[];
  agentName: string;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [voicePreference, setVoicePreference] = useState("female-french");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalNodes = nodes.length;
  const withRecording = nodes.filter((n) => n.hasRecording).length;
  const needsRecording = totalNodes - withRecording;

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => {
      onSubmit();
      onClose();
    }, 2000);
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" />
        <div className="relative flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-[#d0d5e4] bg-white p-8 shadow-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-[17px] font-semibold text-[#0A2353]">
            Recording request submitted!
          </h2>
          <p className="text-center text-[13px] leading-relaxed text-[#7b89a8]">
            We've received your request for all {totalNodes} node recordings.
            Our team will prepare professional voice clips based on your scripts.
            You'll receive a notification when they're ready.
          </p>
          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-[11px] font-medium text-amber-700">
              Estimated delivery: 24-48 hours
            </span>
          </div>
        </div>
      </div>
    );
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Mic className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-semibold text-[#0A2353]">
              Request professional recordings
            </h2>
            <p className="text-[11px] text-[#7b89a8]">
              {agentName}
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
          {/* All nodes summary */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileAudio className="h-4 w-4 text-emerald-600" />
              <span className="text-[13px] font-semibold text-[#0A2353]">
                All {totalNodes} nodes will be recorded
              </span>
            </div>
            <div className="space-y-1.5">
              {nodes.map((node) => {
                const Icon = TYPE_ICONS[node.type];
                return (
                  <div
                    key={node.id}
                    className="flex items-center gap-2.5 rounded-lg bg-white/80 px-3 py-1.5"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-emerald-500 bg-emerald-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <Icon className="h-3 w-3 shrink-0 text-[#7b89a8]" />
                    <span className="flex-1 text-[11px] font-medium text-[#0A2353]">
                      {node.label}
                    </span>
                    {node.hasRecording ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                        Re-record
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                        New
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center gap-4 text-[10px] text-[#7b89a8]">
              <span>{needsRecording} new recording(s)</span>
              {withRecording > 0 && (
                <span>{withRecording} will be re-recorded</span>
              )}
            </div>
          </div>

          {/* Voice preference */}
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#0A2353]">
              Voice preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "female-french", label: "Female — French", icon: "\u{1F1EB}\u{1F1F7}" },
                { value: "male-french", label: "Male — French", icon: "\u{1F1EB}\u{1F1F7}" },
                { value: "female-english", label: "Female — English", icon: "\u{1F1EC}\u{1F1E7}" },
                { value: "male-english", label: "Male — English", icon: "\u{1F1EC}\u{1F1E7}" },
              ].map((v) => (
                <button
                  key={v.value}
                  onClick={() => setVoicePreference(v.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all",
                    voicePreference === v.value
                      ? "border-[#5B58EB] bg-[#5B58EB]/5"
                      : "border-[#d0d5e4] hover:border-[#5B58EB]/30",
                  )}
                >
                  <span className="text-[14px]">{v.icon}</span>
                  <span className="text-[12px] font-medium text-[#0A2353]">
                    {v.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#0A2353]">
              Additional notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any special instructions for the voice artist — tone, pacing, emphasis..."
              className="w-full rounded-lg border border-[#d0d5e4] px-3 py-2 text-[12px] text-[#0A2353] placeholder:text-[#7b89a8] transition-all focus:border-[#5B58EB]/40 focus:outline-none focus:ring-2 focus:ring-[#5B58EB]/10"
            />
          </div>
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
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
          >
            <Send className="h-3.5 w-3.5" />
            Submit request for all {totalNodes} nodes
          </button>
        </div>
      </div>
    </div>
  );
}
