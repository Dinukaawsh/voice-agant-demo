"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Bot,
  User,
  Pause,
  Play,
  Check,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { FlowNode } from "./types";

type CallState = "idle" | "ringing" | "connected" | "ended";

interface TranscriptLine {
  id: string;
  role: "agent" | "user";
  text: string;
  nodeLabel?: string;
}

const MOCK_CALL_SCRIPT: { delay: number; role: "agent" | "user"; text: string; nodeLabel?: string }[] = [
  { delay: 2000, role: "agent", text: "Bonjour, je suis Lior de la mutuelle SantePlus. Je vous appelle suite a votre demande de devis.", nodeLabel: "Opening 1" },
  { delay: 4000, role: "agent", text: "Vous avez quelques minutes pour que je vous pose des questions rapides ?", nodeLabel: "Opening 2" },
  { delay: 2500, role: "user", text: "Oui, allez-y." },
  { delay: 3000, role: "agent", text: "Quel est votre code postal, s'il vous plait ?", nodeLabel: "Question 1" },
  { delay: 2000, role: "user", text: "75008" },
  { delay: 2500, role: "agent", text: "Quelle est votre date de naissance ?", nodeLabel: "Question 2" },
  { delay: 2000, role: "user", text: "15 mars 1985" },
  { delay: 3000, role: "agent", text: "Avez-vous actuellement une mutuelle sante en cours ?", nodeLabel: "Question 3" },
  { delay: 1500, role: "user", text: "Oui, j'en ai une." },
  { delay: 3000, role: "agent", text: "Combien payez-vous par mois pour votre mutuelle actuelle ?", nodeLabel: "Question 4" },
  { delay: 2000, role: "user", text: "Environ 45 euros par mois." },
  { delay: 3500, role: "agent", text: "Parfait, vous etes eligible a nos offres. Laissez-moi vous transferer a un conseiller qui pourra vous proposer un devis personnalise.", nodeLabel: "Eligibility" },
  { delay: 3000, role: "agent", text: "Merci beaucoup pour votre temps. Un conseiller va vous recontacter tres prochainement. Bonne journee !", nodeLabel: "Success" },
];

export function TestCallModal({
  agentName,
  nodes,
  onClose,
}: {
  agentName: string;
  nodes: FlowNode[];
  onClose: () => void;
}) {
  const [callState, setCallState] = useState<CallState>("idle");
  const [muted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const scriptRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript.length]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      scriptRef.current.forEach(clearTimeout);
    };
  }, []);

  function startCall() {
    setCallState("ringing");
    setTranscript([]);
    setElapsed(0);

    setTimeout(() => {
      setCallState("connected");
      timerRef.current = setInterval(() => {
        if (!paused) setElapsed((e) => e + 1);
      }, 1000);

      let cumDelay = 0;
      MOCK_CALL_SCRIPT.forEach((line, i) => {
        cumDelay += line.delay;
        const t = setTimeout(() => {
          setTranscript((prev) => [
            ...prev,
            { id: `t-${i}`, role: line.role, text: line.text, nodeLabel: line.nodeLabel },
          ]);
          if (line.nodeLabel) setCurrentNode(line.nodeLabel);
        }, cumDelay);
        scriptRef.current.push(t);
      });

      const endT = setTimeout(() => {
        setCallState("ended");
        if (timerRef.current) clearInterval(timerRef.current);
      }, cumDelay + 2000);
      scriptRef.current.push(endT);
    }, 2000);
  }

  function endCall() {
    setCallState("ended");
    if (timerRef.current) clearInterval(timerRef.current);
    scriptRef.current.forEach(clearTimeout);
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#d0d5e4] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#d0d5e4] bg-gradient-to-r from-[#0A2353] to-[#112C70] px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Phone className="h-5 w-5 text-[#56E1E9]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-semibold text-white">
              Test call — {agentName}
            </h2>
            <p className="text-[11px] text-white/60">
              {callState === "idle" && "Start a simulated web call to test your agent flow"}
              {callState === "ringing" && "Connecting..."}
              {callState === "connected" && `In call · ${formatTime(elapsed)}`}
              {callState === "ended" && `Call ended · ${formatTime(elapsed)}`}
            </p>
          </div>
          {currentNode && callState === "connected" && (
            <div className="rounded-full bg-[#5B58EB]/30 px-3 py-1">
              <span className="text-[10px] font-semibold text-[#56E1E9]">
                {currentNode}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Call area */}
        <div className="flex min-h-0 flex-1 flex-col">
          {callState === "idle" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#5B58EB] to-[#8B63FF] shadow-lg">
                <Bot className="h-12 w-12 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-[16px] font-semibold text-[#0A2353]">
                  Ready to test your agent
                </h3>
                <p className="mt-1 max-w-sm text-[13px] text-[#7b89a8]">
                  Start a simulated call to hear how your agent sounds and verify the conversation flow works correctly.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={startCall}
                  className="flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-[14px] font-semibold text-white shadow-lg transition-all hover:bg-emerald-600 hover:shadow-xl"
                >
                  <Phone className="h-5 w-5" />
                  Start test call
                </button>
                <p className="text-[11px] text-[#7b89a8]">
                  Uses text-to-speech · No real call is made
                </p>
              </div>
              <div className="mt-2 w-full max-w-sm rounded-lg border border-[#d0d5e4] bg-[#f0f2f8]/60 p-3">
                <p className="text-[11px] font-semibold text-[#0A2353]">What happens in a test call:</p>
                <ul className="mt-1.5 space-y-1 text-[10px] text-[#7b89a8]">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B58EB]" />
                    The agent follows your conversation flow step by step
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B58EB]" />
                    Simulated lead responses test each question
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B58EB]" />
                    Edge cases and rules are validated
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B58EB]" />
                    Full transcript generated for review
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {/* Transcript */}
              <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-5">
                {callState === "ringing" && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <Phone className="h-8 w-8 text-emerald-600" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
                    </div>
                    <p className="text-[13px] font-medium text-[#7b89a8]">Ringing...</p>
                  </div>
                )}
                {transcript.map((line) => (
                  <div
                    key={line.id}
                    className={cn(
                      "flex gap-2.5",
                      line.role === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                    style={{ animation: "fadeIn 0.3s ease-out" }}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        line.role === "user"
                          ? "bg-[#112C70] text-white"
                          : "bg-[#5B58EB]/10 text-[#5B58EB]",
                      )}
                    >
                      {line.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className="max-w-[75%]">
                      {line.nodeLabel && (
                        <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-[#5B58EB]">
                          {line.nodeLabel}
                        </span>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                          line.role === "user"
                            ? "rounded-tr-md bg-[#112C70] text-white"
                            : "rounded-tl-md border border-[#d0d5e4] bg-white text-[#0A2353]",
                        )}
                      >
                        {line.text}
                      </div>
                    </div>
                  </div>
                ))}
                {callState === "ended" && (
                  <div
                    className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-[#d0d5e4] bg-[#f0f2f8]/60 p-4"
                    style={{ animation: "fadeIn 0.3s ease-out" }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-[13px] font-semibold text-[#0A2353]">Test call completed</p>
                    <p className="text-[11px] text-[#7b89a8]">
                      Duration: {formatTime(elapsed)} · {transcript.length} messages · All nodes reached
                    </p>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Call controls */}
              <div className="flex items-center justify-center gap-4 border-t border-[#d0d5e4] bg-[#f0f2f8] px-5 py-4">
                {callState === "connected" && (
                  <>
                    <button
                      onClick={() => setMuted(!muted)}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full transition-all",
                        muted
                          ? "bg-red-100 text-red-600"
                          : "bg-white text-[#0A2353] shadow-sm hover:bg-[#5B58EB]/5",
                      )}
                    >
                      {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={endCall}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:bg-red-600"
                    >
                      <PhoneOff className="h-6 w-6" />
                    </button>
                    <button
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0A2353] shadow-sm transition-all hover:bg-[#5B58EB]/5"
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>
                  </>
                )}
                {callState === "ended" && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setCallState("idle");
                        setTranscript([]);
                        setCurrentNode(null);
                        setElapsed(0);
                      }}
                      className="flex items-center gap-2 rounded-full bg-[#5B58EB] px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#4a47d4]"
                    >
                      <Phone className="h-4 w-4" />
                      Test again
                    </button>
                    <button
                      onClick={onClose}
                      className="rounded-full px-6 py-2.5 text-[13px] font-medium text-[#7b89a8] transition-colors hover:bg-white hover:text-[#0A2353]"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
