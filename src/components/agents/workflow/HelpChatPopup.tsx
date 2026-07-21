"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircleQuestion,
  X,
  Send,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

type HelpMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const INITIAL_MESSAGES: HelpMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hi! I'm your workflow assistant. Ask me anything about building your voice agent — flow structure, edge cases, recordings, or best practices.",
  },
];

const HELP_RESPONSES: Record<string, string> = {
  edge: "Edge cases handle off-script moments — when leads say they're busy, not interested, or ask who's calling. Adding 3-5 edge cases makes your agent sound much more natural and professional.",
  silence:
    "The silence prompt plays when the lead goes quiet for too long. It gently brings them back into the conversation. A good one sounds natural, like 'Hello? Are you still there?'",
  variation:
    "Variations are alternate wordings of the same question. They make the agent sound less robotic by randomly choosing different phrasings each call. Aim for 2-3 per question.",
  recording:
    "Each node needs a voice recording. You can upload your own .wav/.mp3 files, or save the agent as a draft and request professional recordings from our team. We'll record based on your scripts.",
  rule: "Rules define pass/fail conditions on question nodes. If a lead's answer fails the rule, the call takes the FAIL branch and plays an exit script. Common rules: 'Must answer yes', 'Must provide a valid number'.",
  flow: "The conversation flow goes: Opening → Questions (in order) → Eligibility → Success. Each question can have rules with pass/fail branches. The agent follows this exact sequence.",
  finalize:
    "When you finalize, we'll check if you have edge cases, silence prompts, and variations configured. These are optional but strongly recommended — they make your agent handle real-world calls much better.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(HELP_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return "That's a great question! The key to a successful voice agent is a clear conversation flow, well-written scripts, and good edge case handling. Can you tell me more about what you'd like to know?";
}

export function HelpChatPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<HelpMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: HelpMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply: HelpMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: getResponse(trimmed),
      };
      setMessages((prev) => [...prev, reply]);
    }, 600);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#5B58EB] to-[#8B63FF] text-white shadow-lg shadow-[#5B58EB]/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#5B58EB]/30 active:scale-95"
        >
          <MessageCircleQuestion className="h-6 w-6" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#56E1E9] text-[10px] font-bold text-[#0A2353]">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Chat popup */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-[#d0d5e4] bg-white shadow-2xl shadow-black/10">
          {/* Header */}
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#5B58EB] to-[#8B63FF] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[13px] font-semibold text-white">
                Help Assistant
              </h3>
              <p className="text-[10px] text-white/70">
                Ask me anything about your agent
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-1.5 border-b border-[#d0d5e4] px-3 py-2">
            {["Edge cases", "Recordings", "Rules", "Variations"].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(`What are ${q.toLowerCase()}?`);
                  setTimeout(() => {
                    const userMsg: HelpMessage = {
                      id: `u-${Date.now()}`,
                      role: "user",
                      text: `What are ${q.toLowerCase()}?`,
                    };
                    setMessages((prev) => [...prev, userMsg]);
                    setInput("");
                    setTimeout(() => {
                      const reply: HelpMessage = {
                        id: `a-${Date.now()}`,
                        role: "assistant",
                        text: getResponse(q.toLowerCase()),
                      };
                      setMessages((prev) => [...prev, reply]);
                    }, 600);
                  }, 50);
                }}
                className="rounded-full border border-[#5B58EB]/20 bg-[#5B58EB]/5 px-2.5 py-1 text-[10px] font-medium text-[#5B58EB] transition-all hover:bg-[#5B58EB]/10"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    msg.role === "user"
                      ? "bg-[#112C70] text-white"
                      : "bg-[#5B58EB]/10 text-[#5B58EB]",
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="h-3 w-3" />
                  ) : (
                    <Bot className="h-3 w-3" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed",
                    msg.role === "user"
                      ? "rounded-tr-md bg-[#5B58EB] text-white"
                      : "rounded-tl-md border border-[#d0d5e4] bg-[#f0f2f8] text-[#0A2353]",
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#d0d5e4] bg-white px-3 py-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-[#d0d5e4] bg-white px-3 py-1.5 transition-all focus-within:border-[#5B58EB]/40">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about edge cases, recordings..."
                className="flex-1 bg-transparent text-[12px] text-[#0A2353] placeholder:text-[#7b89a8] focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
                  input.trim()
                    ? "bg-[#5B58EB] text-white hover:bg-[#4a47d4]"
                    : "bg-[#f0f2f8] text-[#7b89a8]",
                )}
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
