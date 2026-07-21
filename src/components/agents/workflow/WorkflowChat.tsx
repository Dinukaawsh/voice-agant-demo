"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "./types";

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  const isHelp = msg.role === "help";

  return (
    <div
      className={cn(
        "flex gap-2.5",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-[#112C70] text-white"
            : isHelp
              ? "bg-[#56E1E9]/20 text-[#0A2353]"
              : "bg-[#5B58EB]/10 text-[#5B58EB]",
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : isHelp ? (
          <HelpCircle className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
          isUser
            ? "rounded-tr-md bg-[#5B58EB] text-white"
            : isHelp
              ? "rounded-tl-md border border-[#56E1E9]/30 bg-[#56E1E9]/5 text-[#0A2353]"
              : "rounded-tl-md border border-[#d0d5e4] bg-white text-[#0A2353]",
        )}
      >
        {!isUser && (
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#7b89a8]">
            {isHelp ? "Help assistant" : "Flow agent"}
          </span>
        )}
        {msg.text}
      </div>
    </div>
  );
}

export function WorkflowChat({
  messages,
  onSend,
}: {
  messages: ChatMessage[];
  onSend?: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"flow" | "help">("flow");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 border-b border-[#d0d5e4] px-3 py-2">
        <button
          onClick={() => setMode("flow")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all",
            mode === "flow"
              ? "bg-[#5B58EB]/10 text-[#5B58EB] shadow-sm"
              : "text-[#7b89a8] hover:bg-[#f0f2f8]",
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Flow agent
        </button>
        <button
          onClick={() => setMode("help")}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all",
            mode === "help"
              ? "bg-[#56E1E9]/15 text-[#0A2353] shadow-sm"
              : "text-[#7b89a8] hover:bg-[#f0f2f8]",
          )}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Help
        </button>
      </div>

      {/* Messages */}
      <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {mode === "help" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#56E1E9]/30 bg-[#56E1E9]/5 p-4">
              <h3 className="flex items-center gap-2 text-[13px] font-semibold text-[#0A2353]">
                <HelpCircle className="h-4 w-4 text-[#56E1E9]" />
                How the agent flow works
              </h3>
              <div className="mt-3 space-y-3 text-[12px] leading-relaxed text-[#0A2353]/80">
                <div>
                  <span className="font-semibold text-[#5B58EB]">Opening</span>{" "}
                  — The first thing the agent says. Split into parts for natural pacing (greeting, then ask permission).
                </div>
                <div>
                  <span className="font-semibold text-[#8B63FF]">Questions</span>{" "}
                  — Qualification questions asked in order. Each can have an answer type and an optional rule. If a rule fails, the call ends with an exit script.
                </div>
                <div>
                  <span className="font-semibold text-[#56E1E9]">Eligibility</span>{" "}
                  — Played when the lead passes all questions. Confirms they qualify.
                </div>
                <div>
                  <span className="font-semibold text-[#112C70]">Success</span>{" "}
                  — Final closing. Uninterruptible. Tells the lead what happens next.
                </div>
                <div>
                  <span className="font-semibold text-orange-600">Edge cases</span>{" "}
                  — Objections or off-script moments. The agent detects these and plays the appropriate response.
                </div>
                <div>
                  <span className="font-semibold text-pink-600">Silence prompt</span>{" "}
                  — Played when the lead goes quiet. Brings them back into the conversation.
                </div>
                <div>
                  <span className="font-semibold text-fuchsia-600">Variations</span>{" "}
                  — Alternate wordings of the same question. Makes the agent sound more natural.
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[#d0d5e4] bg-[#f0f2f8] p-4">
              <h3 className="text-[13px] font-semibold text-[#0A2353]">Quick tips</h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#3d4f78]">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#5B58EB]" />
                  Type in the Flow agent chat to add or change anything
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#5B58EB]" />
                  Click the pencil icon on any node to edit it directly
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#5B58EB]" />
                  Upload recordings by clicking the upload badge on each card
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#5B58EB]" />
                  Drag questions up/down to reorder the qualification flow
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#d0d5e4] bg-white p-3">
        <div className="flex items-end gap-2 rounded-xl border border-[#d0d5e4] bg-white px-3 py-2 shadow-sm transition-all focus-within:border-[#5B58EB]/40 focus-within:shadow-[0_0_0_3px_rgba(91,88,235,0.1)]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "flow"
                ? "Describe what you want to change..."
                : "Ask a question about agent concepts..."
            }
            rows={1}
            className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-[#0A2353] placeholder:text-[#7b89a8] focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
              input.trim()
                ? "bg-[#5B58EB] text-white shadow-sm hover:bg-[#4a47d4]"
                : "bg-[#f0f2f8] text-[#7b89a8]",
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-[#7b89a8]">
          {mode === "flow"
            ? "The flow agent updates the diagram based on your instructions"
            : "The help assistant explains concepts — it doesn't change the flow"}
        </p>
      </div>
    </div>
  );
}
