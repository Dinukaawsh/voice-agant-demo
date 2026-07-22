"use client";

import { useState } from "react";
import {
  X,
  Bot,
  Phone,
  PhoneOff,
  Pencil,
  Play,
  TestTube,
  Zap,
  Check,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Clock,
  Hash,
  Globe,
  GitBranch,
  AlertTriangle,
  VolumeX,
  Shuffle,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { FlowNode, WorkflowState } from "./types";

type OverviewTab = "flow" | "test" | "generate";

function FlowPreview({ workflow }: { workflow: WorkflowState }) {
  const { nodes, edgeCases, silencePrompt, variations } = workflow;
  const typeIcons: Record<string, typeof Phone> = {
    opening: Phone,
    question: MessageSquare,
    eligibility: ShieldCheck,
    success: Sparkles,
    exit: PhoneOff,
  };

  return (
    <div className="space-y-6">
      {/* Flow diagram */}
      <div className="flex flex-col items-center gap-0">
        <div className="flex items-center gap-2 rounded-full bg-[#112C70] px-3 py-1 shadow-sm">
          <Phone className="h-3 w-3 text-[#56E1E9]" />
          <span className="text-[10px] font-semibold text-white">Call starts</span>
        </div>
        {nodes.map((node) => {
          const Icon = typeIcons[node.type] || MessageSquare;
          const hasFail = !!(node.rule && node.failScript);
          return (
            <div key={node.id} className="flex flex-col items-center">
              <div className="h-3 w-0.5 bg-[#d0d5e4]" />
              <ArrowDown className="-mt-[1px] h-2.5 w-2.5 text-[#d0d5e4]" />
              <div className="relative flex items-start gap-0">
                <div className="flex flex-col items-center">
                  <div className="rounded-lg border border-[#d0d5e4] bg-white px-3 py-1.5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3 w-3 text-[#5B58EB]" />
                      <span className="text-[11px] font-medium text-[#0A2353]">{node.label}</span>
                      {node.answerType && (
                        <span className="rounded-full bg-[#8B63FF]/10 px-1.5 py-0.5 text-[8px] font-semibold text-[#8B63FF]">
                          {node.answerType === "yesno" ? "Y/N" : node.answerType === "choice" ? "Choice" : "Open"}
                        </span>
                      )}
                      {node.hasRecording && (
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    {node.script && (
                      <p className="mt-1 max-w-xs text-[10px] leading-relaxed text-[#7b89a8]">
                        {node.script}
                      </p>
                    )}
                    {node.substages && node.substages.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {node.substages.map((sub) => (
                          <p key={sub.id} className="max-w-xs text-[10px] leading-relaxed text-[#7b89a8]">
                            <span className="font-medium text-[#5B58EB]/60">{sub.label}:</span> {sub.script}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  {node.rule && (
                    <div className="mt-1 flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5">
                      <Settings2 className="h-2.5 w-2.5 text-amber-600" />
                      <span className="text-[8px] font-medium text-amber-700">Rule: {node.rule}</span>
                    </div>
                  )}
                </div>
                {hasFail && (
                  <div className="ml-2 flex items-start pt-1">
                    <div className="mt-2 h-0.5 w-4 bg-red-300" />
                    <span className="mt-1 rounded bg-red-100 px-1.5 py-0.5 text-[7px] font-bold text-red-600">FAIL</span>
                    <ArrowRight className="mt-1.5 h-2.5 w-2.5 text-red-300" />
                    <div className="rounded-md border border-red-200 bg-red-50 px-2 py-1">
                      <div className="flex items-center gap-1">
                        <PhoneOff className="h-2.5 w-2.5 text-red-500" />
                        <span className="text-[9px] font-bold text-red-600">END</span>
                      </div>
                      {node.failScript && (
                        <p className="mt-0.5 max-w-[150px] text-[9px] leading-relaxed text-red-500">
                          {node.failScript}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="h-3 w-0.5 bg-[#d0d5e4]" />
        <ArrowDown className="-mt-[1px] h-2.5 w-2.5 text-[#d0d5e4]" />
        <div className="flex items-center gap-2 rounded-full bg-[#112C70] px-3 py-1 shadow-sm">
          <PhoneOff className="h-3 w-3 text-[#56E1E9]" />
          <span className="text-[10px] font-semibold text-white">Call ends</span>
        </div>
      </div>

      {/* Edge cases section */}
      {workflow.enableEdgeCases && edgeCases.length > 0 && (
        <div className="rounded-xl border border-orange-200/60 bg-orange-50/40 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <GitBranch className="h-3 w-3" />
            </div>
            <span className="text-[12px] font-semibold text-[#0A2353]">Edge cases</span>
            <span className="rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold uppercase text-amber-700">Advanced</span>
            <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-600">
              {edgeCases.length}
            </span>
          </div>
          <div className="space-y-1">
            {edgeCases.map((ec) => (
              <div key={ec.id} className="flex items-center gap-2 rounded-lg bg-white/80 px-2.5 py-1.5">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                <span className="text-[11px] font-medium text-[#0A2353]">{ec.name}</span>
                {ec.hasRecording && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Silence section */}
      {workflow.enableSilence && (
        <div className="rounded-xl border border-pink-200/60 bg-pink-50/40 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
              <VolumeX className="h-3 w-3" />
            </div>
            <span className="text-[12px] font-semibold text-[#0A2353]">Silence prompt</span>
            <span className="rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold uppercase text-amber-700">Advanced</span>
            {silencePrompt.hasRecording && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/80 px-2.5 py-1.5">
            <AlertTriangle className="h-3 w-3 shrink-0 text-pink-500" />
            <span className="text-[11px] text-[#3d4f78]">{silencePrompt.script}</span>
          </div>
        </div>
      )}

      {/* Variations section */}
      {workflow.enableVariations && variations.length > 0 && (
        <div className="rounded-xl border border-[#8B63FF]/20 bg-[#8B63FF]/5 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#8B63FF]/15 text-[#8B63FF]">
              <Shuffle className="h-3 w-3" />
            </div>
            <span className="text-[12px] font-semibold text-[#0A2353]">Question variations</span>
            <span className="rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold uppercase text-amber-700">Advanced</span>
            <span className="rounded-full bg-[#8B63FF]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#8B63FF]">
              {variations.length}
            </span>
          </div>
          <div className="space-y-1">
            {variations.map((v) => (
              <div key={v.id} className="flex items-center gap-2 rounded-lg bg-white/80 px-2.5 py-1.5">
                <Shuffle className="h-2.5 w-2.5 shrink-0 text-[#8B63FF]/50" />
                <span className="text-[10px] font-medium text-[#8B63FF]">{v.questionLabel}:</span>
                <span className="min-w-0 flex-1 truncate text-[11px] text-[#3d4f78]">{v.script}</span>
                {v.hasRecording && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TestOptions({ onTestCall }: { onTestCall: () => void }) {
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoResults, setAutoResults] = useState<{ name: string; passed: boolean }[] | null>(null);

  function runAutoTests() {
    setAutoRunning(true);
    setAutoResults(null);
    setTimeout(() => {
      setAutoRunning(false);
      setAutoResults([
        { name: "Opening flow completes", passed: true },
        { name: "All questions asked in order", passed: true },
        { name: "Yes/No rule enforced on Q3", passed: true },
        { name: "Eligibility check triggers", passed: true },
        { name: "Success message plays", passed: true },
        { name: "Edge case: Not interested", passed: true },
        { name: "Edge case: Busy/callback", passed: true },
        { name: "Silence prompt triggers after 5s", passed: true },
        { name: "Fail branch ends call gracefully", passed: true },
        { name: "All recordings present", passed: false },
      ]);
    }, 3000);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#d0d5e4] bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5B58EB]/10">
            <Phone className="h-5 w-5 text-[#5B58EB]" />
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-semibold text-[#0A2353]">Web-based test call</h4>
            <p className="mt-0.5 text-[11px] text-[#7b89a8]">
              Simulate a full conversation in your browser. Hear how the agent sounds, verify the flow, and check transitions.
            </p>
            <button
              onClick={onTestCall}
              className="mt-3 flex items-center gap-2 rounded-full bg-[#5B58EB] px-5 py-2 text-[12px] font-semibold text-white transition-all hover:bg-[#4a47d4]"
            >
              <Play className="h-3.5 w-3.5" />
              Start test call
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#d0d5e4] bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <TestTube className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-semibold text-[#0A2353]">Automation tests</h4>
            <p className="mt-0.5 text-[11px] text-[#7b89a8]">
              Run automated checks on your agent flow — validates rules, edge cases, recordings, and conversation paths.
            </p>
            <button
              onClick={runAutoTests}
              disabled={autoRunning}
              className={cn(
                "mt-3 flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-semibold transition-all",
                autoRunning
                  ? "bg-amber-100 text-amber-700"
                  : "bg-amber-500 text-white hover:bg-amber-600",
              )}
            >
              {autoRunning ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-300 border-t-amber-700" />
                  Running tests...
                </>
              ) : (
                <>
                  <TestTube className="h-3.5 w-3.5" />
                  Run all tests
                </>
              )}
            </button>
            {autoResults && (
              <div className="mt-3 space-y-1.5 rounded-lg border border-[#d0d5e4] bg-[#f0f2f8]/60 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#0A2353]">
                    {autoResults.filter((r) => r.passed).length}/{autoResults.length} passed
                  </span>
                  <div className="h-1.5 flex-1 rounded-full bg-[#d0d5e4]">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${(autoResults.filter((r) => r.passed).length / autoResults.length) * 100}%` }}
                    />
                  </div>
                </div>
                {autoResults.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                      r.passed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600",
                    )}>
                      {r.passed ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                    </div>
                    <span className={cn(
                      "text-[11px]",
                      r.passed ? "text-[#3d4f78]" : "font-medium text-red-700",
                    )}>
                      {r.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GenerateCallPanel({ agentName }: { agentName: string }) {
  const [step, setStep] = useState<"request" | "pending" | "ready" | "generate">("request");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [targetNumber, setTargetNumber] = useState("");
  const [generating, setGenerating] = useState(false);
  const [callGenerated, setCallGenerated] = useState(false);

  function handleRequestNumber() {
    setStep("pending");
    setTimeout(() => {
      setStep("ready");
      setPhoneNumber("+33 1 86 76 40 12");
    }, 2500);
  }

  function handleGenerateCall() {
    if (!targetNumber.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setCallGenerated(true);
    }, 2000);
  }

  return (
    <div className="space-y-4">
      <div className={cn(
        "rounded-xl border bg-white p-4 transition-all",
        step === "request" ? "border-[#5B58EB]/30" : "border-[#d0d5e4]",
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            step === "ready" ? "bg-emerald-100" : "bg-[#5B58EB]/10",
          )}>
            {step === "ready" ? (
              <Check className="h-5 w-5 text-emerald-600" />
            ) : (
              <Hash className="h-5 w-5 text-[#5B58EB]" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-[13px] font-semibold text-[#0A2353]">
                1. Request a phone number
              </h4>
              {step === "ready" && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  Assigned
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-[#7b89a8]">
              {step === "request" && "Request a dedicated phone number for your agent. Our team will assign one within minutes."}
              {step === "pending" && "Processing your request..."}
              {step === "ready" && "Your agent has been assigned a dedicated number."}
              {step === "generate" && "Your agent has been assigned a dedicated number."}
            </p>
            {step === "request" && (
              <button
                onClick={handleRequestNumber}
                className="mt-3 flex items-center gap-2 rounded-full bg-[#5B58EB] px-5 py-2 text-[12px] font-semibold text-white transition-all hover:bg-[#4a47d4]"
              >
                <Phone className="h-3.5 w-3.5" />
                Request number
              </button>
            )}
            {step === "pending" && (
              <div className="mt-3 flex items-center gap-2 text-[12px] text-[#5B58EB]">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#5B58EB]/20 border-t-[#5B58EB]" />
                Assigning number...
              </div>
            )}
            {(step === "ready" || step === "generate") && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-2.5">
                <Phone className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600">Assigned number</p>
                  <p className="text-[15px] font-bold tracking-wide text-[#0A2353]">{phoneNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={cn(
        "rounded-xl border bg-white p-4 transition-all",
        (step === "ready" || step === "generate") ? "border-[#5B58EB]/30 opacity-100" : "border-[#d0d5e4] opacity-40",
      )}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <Zap className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-semibold text-[#0A2353]">
              2. Generate a real call
            </h4>
            <p className="mt-0.5 text-[11px] text-[#7b89a8]">
              Enter a phone number to make a real call with your agent. The agent will call the number and follow the conversation flow.
            </p>
            {(step === "ready" || step === "generate") && !callGenerated && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#0A2353]">
                    Target phone number
                  </label>
                  <input
                    type="tel"
                    value={targetNumber}
                    onChange={(e) => setTargetNumber(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full rounded-lg border border-[#d0d5e4] px-3 py-2 text-[13px] text-[#0A2353] placeholder:text-[#7b89a8] focus:border-[#5B58EB]/40 focus:outline-none focus:ring-2 focus:ring-[#5B58EB]/10"
                  />
                </div>
                <button
                  onClick={handleGenerateCall}
                  disabled={!targetNumber.trim() || generating}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-semibold transition-all",
                    generating
                      ? "bg-emerald-100 text-emerald-700"
                      : targetNumber.trim()
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-[#d0d5e4] text-[#7b89a8]",
                  )}
                >
                  {generating ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-700" />
                      Initiating call...
                    </>
                  ) : (
                    <>
                      <Phone className="h-3.5 w-3.5" />
                      Generate call
                    </>
                  )}
                </button>
              </div>
            )}
            {callGenerated && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3" style={{ animation: "fadeIn 0.3s ease-out" }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-emerald-800">Call initiated!</p>
                    <p className="text-[10px] text-emerald-600">
                      Calling {targetNumber} from {phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-[10px] text-[#7b89a8]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Started just now
                  </span>
                  <span>Call ID: #TC-2847</span>
                </div>
                <button
                  onClick={() => {
                    setCallGenerated(false);
                    setTargetNumber("");
                  }}
                  className="mt-2 text-[11px] font-medium text-[#5B58EB] hover:underline"
                >
                  Generate another call
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentOverviewModal({
  workflow,
  onClose,
  onEdit,
  onTestCall,
}: {
  workflow: WorkflowState;
  onClose: () => void;
  onEdit: () => void;
  onTestCall: () => void;
}) {
  const [activeTab, setActiveTab] = useState<OverviewTab>("flow");

  const tabs: { key: OverviewTab; label: string; icon: typeof Bot }[] = [
    { key: "flow", label: "Agent flow", icon: Bot },
    { key: "test", label: "Test & validate", icon: TestTube },
    { key: "generate", label: "Generate calls", icon: Zap },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#d0d5e4] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#d0d5e4] px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B58EB] to-[#8B63FF] shadow-sm">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-[#0A2353]">
                {workflow.agentName}
              </h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                Finalized
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#7b89a8]">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {workflow.language}
              </span>
              <span>{workflow.nodes.length} nodes</span>
              {workflow.enableEdgeCases && <span>{workflow.edgeCases.length} edge cases</span>}
              {workflow.enableVariations && <span>{workflow.variations.length} variations</span>}
            </div>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-full border border-[#d0d5e4] px-4 py-2 text-[12px] font-medium text-[#0A2353] transition-all hover:border-[#5B58EB]/30 hover:bg-[#5B58EB]/5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit agent
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#7b89a8] hover:bg-[#f0f2f8] hover:text-[#0A2353]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[#d0d5e4] px-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-[12px] font-medium transition-all",
                activeTab === tab.key
                  ? "border-[#5B58EB] text-[#5B58EB]"
                  : "border-transparent text-[#7b89a8] hover:text-[#0A2353]",
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-5">
          {activeTab === "flow" && (
            <div className="flex flex-col items-center">
              <FlowPreview workflow={workflow} />
              <div className="mt-6 w-full rounded-xl border border-[#d0d5e4] bg-[#f0f2f8]/60 p-4">
                <h4 className="text-[12px] font-semibold text-[#0A2353]">Agent summary</h4>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-[#d0d5e4] bg-white p-3 text-center">
                    <p className="text-[18px] font-bold text-[#5B58EB]">{workflow.nodes.length}</p>
                    <p className="text-[10px] text-[#7b89a8]">Flow nodes</p>
                  </div>
                  <div className="rounded-lg border border-[#d0d5e4] bg-white p-3 text-center">
                    <p className="text-[18px] font-bold text-orange-500">
                      {workflow.enableEdgeCases ? workflow.edgeCases.length : 0}
                    </p>
                    <p className="text-[10px] text-[#7b89a8]">Edge cases</p>
                  </div>
                  <div className="rounded-lg border border-[#d0d5e4] bg-white p-3 text-center">
                    <p className="text-[18px] font-bold text-[#8B63FF]">
                      {workflow.enableVariations ? workflow.variations.length : 0}
                    </p>
                    <p className="text-[10px] text-[#7b89a8]">Variations</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#7b89a8]">Recordings:</span>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      {workflow.nodes.filter((n) => n.hasRecording).length}/{workflow.nodes.length} uploaded
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {workflow.enableEdgeCases ? (
                      <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-semibold text-orange-600">
                        <Check className="h-2.5 w-2.5" /> Edge cases
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-400">
                        <X className="h-2.5 w-2.5" /> Edge cases
                      </span>
                    )}
                    {workflow.enableSilence ? (
                      <span className="flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-[9px] font-semibold text-pink-600">
                        <Check className="h-2.5 w-2.5" /> Silence
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-400">
                        <X className="h-2.5 w-2.5" /> Silence
                      </span>
                    )}
                    {workflow.enableVariations ? (
                      <span className="flex items-center gap-1 rounded-full bg-[#8B63FF]/10 px-2 py-0.5 text-[9px] font-semibold text-[#8B63FF]">
                        <Check className="h-2.5 w-2.5" /> Variations
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-400">
                        <X className="h-2.5 w-2.5" /> Variations
                      </span>
                    )}
                  </div>
                </div>
                {(!workflow.enableEdgeCases || !workflow.enableSilence || !workflow.enableVariations) && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-[11px] font-semibold text-amber-700">Suggestions</span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {!workflow.enableEdgeCases && (
                        <p className="text-[10px] leading-relaxed text-amber-700">
                          <span className="font-semibold">Enable edge cases</span> — handle objections like &quot;not interested&quot; or &quot;call back later&quot; to reduce hang-ups and improve conversion.
                        </p>
                      )}
                      {!workflow.enableSilence && (
                        <p className="text-[10px] leading-relaxed text-amber-700">
                          <span className="font-semibold">Enable silence prompt</span> — recover stalled conversations when the lead goes quiet instead of dead air.
                        </p>
                      )}
                      {!workflow.enableVariations && (
                        <p className="text-[10px] leading-relaxed text-amber-700">
                          <span className="font-semibold">Enable variations</span> — use different phrasings for each question to sound more natural across repeated calls.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "test" && (
            <TestOptions onTestCall={onTestCall} />
          )}
          {activeTab === "generate" && (
            <GenerateCallPanel agentName={workflow.agentName} />
          )}
        </div>
      </div>
    </div>
  );
}
