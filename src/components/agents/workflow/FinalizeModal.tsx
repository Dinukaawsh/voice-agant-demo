"use client";

import { useState } from "react";
import {
  X,
  Sparkles,
  Check,
  AlertTriangle,
  GitBranch,
  VolumeX,
  Shuffle,
  ChevronRight,
  Save,
  Mic,
  Shield,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { WorkflowState } from "./types";

type FinalizeStep = "review" | "suggestions" | "save";

function ReviewChecklist({ workflow }: { workflow: WorkflowState }) {
  const checks = [
    {
      label: "Conversation flow",
      ok: workflow.nodes.length >= 3,
      detail: `${workflow.nodes.length} nodes configured`,
      required: true,
      advanced: false,
    },
    {
      label: "All scripts written",
      ok: workflow.nodes.every((n) => n.script || (n.substages && n.substages.every((s) => s.script))),
      detail: "Every node has a script",
      required: true,
      advanced: false,
    },
    {
      label: "Edge cases",
      ok: workflow.enableEdgeCases ? workflow.edgeCases.length >= 3 : false,
      detail: !workflow.enableEdgeCases ? "Not enabled" : `${workflow.edgeCases.length} edge cases`,
      required: false,
      advanced: true,
      disabled: !workflow.enableEdgeCases,
    },
    {
      label: "Silence prompt",
      ok: workflow.enableSilence ? !!workflow.silencePrompt.script : false,
      detail: !workflow.enableSilence ? "Not enabled" : workflow.silencePrompt.script ? "Configured" : "Not set",
      required: false,
      advanced: true,
      disabled: !workflow.enableSilence,
    },
    {
      label: "Question variations",
      ok: workflow.enableVariations ? workflow.variations.length >= 2 : false,
      detail: !workflow.enableVariations ? "Not enabled" : `${workflow.variations.length} variations`,
      required: false,
      advanced: true,
      disabled: !workflow.enableVariations,
    },
    {
      label: "Recordings uploaded",
      ok: workflow.nodes.every((n) => n.hasRecording),
      detail: `${workflow.nodes.filter((n) => n.hasRecording).length}/${workflow.nodes.length} nodes`,
      required: false,
      advanced: false,
    },
  ];

  return (
    <div className="space-y-2">
      {checks.map((c) => (
        <div
          key={c.label}
          className={cn(
            "flex items-center gap-3 rounded-lg border p-3 transition-all",
            "disabled" in c && c.disabled
              ? "border-slate-200 bg-slate-50/60"
              : c.ok
                ? "border-emerald-200 bg-emerald-50/60"
                : c.required
                  ? "border-red-200 bg-red-50/60"
                  : "border-amber-200 bg-amber-50/60",
          )}
        >
          <div
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
              "disabled" in c && c.disabled
                ? "bg-slate-100 text-slate-400"
                : c.ok
                  ? "bg-emerald-100 text-emerald-600"
                  : c.required
                    ? "bg-red-100 text-red-500"
                    : "bg-amber-100 text-amber-600",
            )}
          >
            {"disabled" in c && c.disabled ? (
              <X className="h-3.5 w-3.5" />
            ) : c.ok ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="flex-1">
            <span className={cn(
              "text-[13px] font-medium",
              "disabled" in c && c.disabled ? "text-slate-400" : "text-[#0A2353]",
            )}>
              {c.label}
            </span>
            {c.advanced && (
              <span className="ml-2 rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold uppercase text-amber-700">
                Advanced
              </span>
            )}
            {"disabled" in c && c.disabled && (
              <span className="ml-2 text-[10px] font-medium text-slate-400">
                Disabled
              </span>
            )}
            {!("disabled" in c && c.disabled) && !c.required && !c.ok && (
              <span className="ml-2 text-[10px] font-medium text-amber-600">
                Recommended
              </span>
            )}
          </div>
          <span className={cn(
            "text-[11px]",
            "disabled" in c && c.disabled ? "text-slate-400" : "text-[#7b89a8]",
          )}>{c.detail}</span>
        </div>
      ))}
    </div>
  );
}

function SuggestionsPanel({
  workflow,
  onAccept,
}: {
  workflow: WorkflowState;
  onAccept: (type: string) => void;
}) {
  const suggestions = [];

  if (!workflow.enableEdgeCases) {
    suggestions.push({
      type: "enable-edge",
      icon: GitBranch,
      iconBg: "bg-orange-100 text-orange-600",
      title: "Enable edge cases",
      description:
        "Edge cases are currently disabled. Enabling them helps your agent handle objections like 'not interested', 'call back later', or 'how did you get my number?' — making calls more robust and reducing hang-ups.",
      action: "Enable edge cases",
    });
  } else if (workflow.edgeCases.length < 3) {
    suggestions.push({
      type: "edge",
      icon: GitBranch,
      iconBg: "bg-orange-100 text-orange-600",
      title: "Add more edge cases",
      description:
        "Your agent only handles " +
        workflow.edgeCases.length +
        " edge cases. We recommend at least 5 to cover common objections like 'not interested', 'call back later', 'how did you get my number?', 'I need to think about it', and 'send me an email'.",
      action: "Add suggested edge cases",
    });
  }

  if (!workflow.enableSilence) {
    suggestions.push({
      type: "enable-silence",
      icon: VolumeX,
      iconBg: "bg-pink-100 text-pink-600",
      title: "Enable silence prompt",
      description:
        "Silence prompt is currently disabled. Without it, your agent won't know what to do when the lead goes quiet. Enabling this helps recover stalled conversations and reduces dead air.",
      action: "Enable silence prompt",
    });
  } else if (!workflow.silencePrompt.script) {
    suggestions.push({
      type: "silence",
      icon: VolumeX,
      iconBg: "bg-pink-100 text-pink-600",
      title: "Add a silence prompt",
      description:
        "Without a silence prompt, your agent won't know what to do when the lead goes quiet. We suggest: 'Hello? Are you still there?' or something natural in your agent's language.",
      action: "Add silence prompt",
    });
  }

  if (!workflow.enableVariations) {
    suggestions.push({
      type: "enable-variations",
      icon: Shuffle,
      iconBg: "bg-[#8B63FF]/15 text-[#8B63FF]",
      title: "Enable question variations",
      description:
        "Question variations are currently disabled. Enabling them makes your agent sound more natural by using different phrasings for each question, reducing the robotic feel of repeated calls.",
      action: "Enable variations",
    });
  } else if (workflow.variations.length < workflow.nodes.filter((n) => n.type === "question").length) {
    suggestions.push({
      type: "variations",
      icon: Shuffle,
      iconBg: "bg-[#8B63FF]/15 text-[#8B63FF]",
      title: "Add question variations",
      description:
        "Variations make your agent sound more natural. Each question should have 2-3 alternate phrasings. You currently have " +
        workflow.variations.length +
        " variation(s) but " +
        workflow.nodes.filter((n) => n.type === "question").length +
        " questions.",
      action: "Generate variations",
    });
  }

  const missingRecordings = workflow.nodes.filter((n) => !n.hasRecording).length;
  if (missingRecordings > 0) {
    suggestions.push({
      type: "recordings",
      icon: Mic,
      iconBg: "bg-emerald-100 text-emerald-600",
      title: `${missingRecordings} recording(s) missing`,
      description:
        "Some nodes don't have voice recordings yet. You can upload your own or save as draft and request professional recordings from our team.",
      action: "Request recordings",
    });
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <Shield className="h-7 w-7 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-[#0A2353]">
            Your agent looks great!
          </h3>
          <p className="mt-1 text-[12px] text-[#7b89a8]">
            All recommended features are configured. Ready to finalize.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg bg-[#5B58EB]/5 px-3 py-2">
        <Sparkles className="h-4 w-4 text-[#5B58EB]" />
        <p className="text-[12px] font-medium text-[#5B58EB]">
          We found {suggestions.length} suggestion(s) to make your agent better
        </p>
      </div>
      {suggestions.map((s) => {
        const SIcon = s.icon;
        return (
          <div
            key={s.type}
            className="rounded-xl border border-[#d0d5e4] bg-white p-4 transition-all hover:border-[#5B58EB]/30 hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                <SIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[13px] font-semibold text-[#0A2353]">
                  {s.title}
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#7b89a8]">
                  {s.description}
                </p>
                <button
                  onClick={() => onAccept(s.type)}
                  className="mt-2.5 flex items-center gap-1.5 rounded-full bg-[#5B58EB]/10 px-3 py-1.5 text-[11px] font-semibold text-[#5B58EB] transition-all hover:bg-[#5B58EB]/20"
                >
                  {s.action}
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FinalizeModal({
  workflow,
  onClose,
  onSaveDraft,
  onRequestRecordings,
  onFinalize,
}: {
  workflow: WorkflowState;
  onClose: () => void;
  onSaveDraft: () => void;
  onRequestRecordings: () => void;
  onFinalize: () => void;
}) {
  const [step, setStep] = useState<FinalizeStep>("review");
  const [accepted, setAccepted] = useState<string[]>([]);

  function handleAcceptSuggestion(type: string) {
    setAccepted((prev) => [...prev, type]);
    if (type === "recordings") {
      onRequestRecordings();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#d0d5e4] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#d0d5e4] px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B58EB] to-[#8B63FF] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-semibold text-[#0A2353]">
              Finalize agent
            </h2>
            <p className="text-[11px] text-[#7b89a8]">
              {workflow.agentName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#7b89a8] hover:bg-[#f0f2f8] hover:text-[#0A2353]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 border-b border-[#d0d5e4] px-5 py-2.5">
          {(["review", "suggestions", "save"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all",
                  step === s
                    ? "bg-[#5B58EB]/10 text-[#5B58EB]"
                    : "text-[#7b89a8] hover:text-[#0A2353]",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    step === s
                      ? "bg-[#5B58EB] text-white"
                      : "bg-[#e4e7f1] text-[#7b89a8]",
                  )}
                >
                  {i + 1}
                </span>
                {s === "review" ? "Review" : s === "suggestions" ? "Suggestions" : "Save"}
              </button>
              {i < 2 && <ChevronRight className="h-3 w-3 text-[#d0d5e4]" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
          {step === "review" && <ReviewChecklist workflow={workflow} />}
          {step === "suggestions" && (
            <SuggestionsPanel
              workflow={workflow}
              onAccept={handleAcceptSuggestion}
            />
          )}
          {step === "save" && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-[15px] font-semibold text-[#0A2353]">
                  How would you like to save?
                </h3>
                <p className="mt-1 text-[12px] text-[#7b89a8]">
                  Choose an option below
                </p>
              </div>

              {/* Save as draft */}
              <button
                onClick={() => {
                  onSaveDraft();
                  onClose();
                }}
                className="group flex w-full items-start gap-4 rounded-xl border-2 border-[#d0d5e4] bg-white p-4 text-left transition-all hover:border-[#5B58EB]/40 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Save className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#0A2353] group-hover:text-[#5B58EB]">
                    Save as draft
                  </h4>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[#7b89a8]">
                    Save your work and come back later. You can still edit scripts,
                    upload recordings, and make changes.
                  </p>
                </div>
              </button>

              {/* Save & request recordings */}
              <button
                onClick={() => {
                  onRequestRecordings();
                }}
                className="group flex w-full items-start gap-4 rounded-xl border-2 border-[#d0d5e4] bg-white p-4 text-left transition-all hover:border-emerald-400 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#0A2353] group-hover:text-emerald-600">
                    Save draft & request recordings
                  </h4>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[#7b89a8]">
                    Save as draft and submit a recording request. Our team will record
                    professional voice clips based on your scripts. You'll be notified when
                    they're ready.
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <Mic className="h-2.5 w-2.5" />
                    {workflow.nodes.filter((n) => !n.hasRecording).length} nodes need recordings
                  </span>
                </div>
              </button>

              {/* Finalize now */}
              <button
                onClick={() => {
                  onFinalize();
                  onClose();
                }}
                className="group flex w-full items-start gap-4 rounded-xl border-2 border-[#5B58EB]/30 bg-[#5B58EB]/5 p-4 text-left transition-all hover:border-[#5B58EB] hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B58EB] to-[#8B63FF] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-semibold text-[#0A2353] group-hover:text-[#5B58EB]">
                    Finalize agent now
                  </h4>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[#7b89a8]">
                    Mark the agent as ready. All recordings must be uploaded.
                    The agent will be available for campaigns.
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#d0d5e4] px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-[12px] font-medium text-[#7b89a8] hover:bg-[#f0f2f8] hover:text-[#0A2353]"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {step === "review" && (
              <button
                onClick={() => setStep("suggestions")}
                className="flex items-center gap-1.5 rounded-full bg-[#5B58EB] px-5 py-2 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#4a47d4]"
              >
                Next: Suggestions
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
            {step === "suggestions" && (
              <button
                onClick={() => setStep("save")}
                className="flex items-center gap-1.5 rounded-full bg-[#5B58EB] px-5 py-2 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-[#4a47d4]"
              >
                Next: Save options
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
