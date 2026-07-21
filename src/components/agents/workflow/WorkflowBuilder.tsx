"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  Save,
  Settings,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { FlowDiagram } from "./FlowDiagram";
import { WorkflowChat } from "./WorkflowChat";
import { EdgeCasePanel, SilencePanel, VariationsPanel } from "./CompanionPanels";
import { MOCK_WORKFLOW, MOCK_CHAT_HISTORY } from "./mock-data";
import type { ChatMessage } from "./types";

export function WorkflowBuilder() {
  const [workflow] = useState(MOCK_WORKFLOW);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
  const [activeTab, setActiveTab] = useState<"flow" | "edge" | "silence" | "variations">("flow");

  function handleSend(text: string) {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: "I've updated the flow based on your request. Check the diagram on the right to see the changes.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#d0d5e4] bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link
            href="/agents"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-[#7b89a8] transition-colors hover:bg-[#f0f2f8] hover:text-[#0A2353]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Agents
          </Link>
          <div className="h-5 w-px bg-[#d0d5e4]" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5B58EB] to-[#8B63FF] text-white shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-[14px] font-semibold text-[#0A2353]">
                {workflow.agentName}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#7b89a8]">
                  Workflow mode
                </span>
                <span className="rounded bg-[#5B58EB]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#5B58EB]">
                  Draft
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" color="neutral" className="text-[12px]">
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            Settings
          </Button>
          <Button variant="secondary" color="brand" className="text-[12px]">
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save draft
          </Button>
          <Button variant="primary" color="brand" className="text-[12px]">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Finalize agent
          </Button>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left — Chat */}
        <div className="flex w-[380px] shrink-0 flex-col overflow-hidden border-r border-[#d0d5e4] bg-[#f0f2f8]">
          <div className="flex items-center gap-2 border-b border-[#d0d5e4] bg-white px-4 py-2.5">
            <Sparkles className="h-4 w-4 text-[#5B58EB]" />
            <span className="text-[13px] font-semibold text-[#0A2353]">
              AI Assistant
            </span>
          </div>
          <WorkflowChat messages={messages} onSend={handleSend} />
        </div>

        {/* Right — Diagram + Panels */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#f0f2f8]/60">
          {/* Tab bar */}
          <div className="flex items-center gap-1 border-b border-[#d0d5e4] bg-white px-4 py-1.5">
            {(
              [
                { key: "flow", label: "Conversation flow", count: workflow.nodes.length },
                { key: "edge", label: "Edge cases", count: workflow.edgeCases.length },
                { key: "silence", label: "Silence", count: undefined },
                { key: "variations", label: "Variations", count: workflow.variations.length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all",
                  activeTab === tab.key
                    ? "bg-[#5B58EB]/10 text-[#5B58EB] shadow-sm"
                    : "text-[#7b89a8] hover:bg-[#f0f2f8] hover:text-[#0A2353]",
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                      activeTab === tab.key
                        ? "bg-[#5B58EB]/20 text-[#5B58EB]"
                        : "bg-[#e4e7f1] text-[#7b89a8]",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {activeTab === "flow" && (
              <FlowDiagram
                nodes={workflow.nodes}
                onEdit={(id) => {}}
              />
            )}
            {activeTab === "edge" && (
              <div className="p-4">
                <EdgeCasePanel edgeCases={workflow.edgeCases} />
              </div>
            )}
            {activeTab === "silence" && (
              <div className="p-4">
                <SilencePanel silence={workflow.silencePrompt} />
              </div>
            )}
            {activeTab === "variations" && (
              <div className="p-4">
                <VariationsPanel variations={workflow.variations} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
