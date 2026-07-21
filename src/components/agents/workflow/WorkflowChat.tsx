"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "./types";

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

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
            : "bg-[#5B58EB]/10 text-[#5B58EB]",
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
          isUser
            ? "rounded-tr-md bg-[#5B58EB] text-white"
            : "rounded-tl-md border border-[#d0d5e4] bg-white text-[#0A2353]",
        )}
      >
        {!isUser && (
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#7b89a8]">
            Flow agent
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
      {/* Messages */}
      <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
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
            placeholder="Describe what you want to change..."
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
          The flow agent updates the diagram based on your instructions
        </p>
      </div>
    </div>
  );
}
