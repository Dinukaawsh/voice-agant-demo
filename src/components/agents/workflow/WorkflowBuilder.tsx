"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  Save,
  Settings,
  Sparkles,
  Check,
  Mic,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { FlowDiagram } from "./FlowDiagram";
import { WorkflowChat } from "./WorkflowChat";
import { EdgeCasePanel, SilencePanel, VariationsPanel } from "./CompanionPanels";
import { HelpChatPopup } from "./HelpChatPopup";
import { EditNodeModal } from "./EditNodeModal";
import { UploadRecordingModal } from "./UploadRecordingModal";
import { FinalizeModal } from "./FinalizeModal";
import { RequestRecordingsModal } from "./RequestRecordingsModal";
import { MOCK_WORKFLOW, MOCK_CHAT_HISTORY } from "./mock-data";
import type { ChatMessage, FlowNode } from "./types";

export function WorkflowBuilder() {
  const [workflow, setWorkflow] = useState(MOCK_WORKFLOW);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
  const [activeTab, setActiveTab] = useState<"flow" | "edge" | "silence" | "variations">("flow");

  // Modal states
  const [editingNode, setEditingNode] = useState<FlowNode | null>(null);
  const [uploadingNodeLabel, setUploadingNodeLabel] = useState<string | null>(null);
  const [uploadingNodeId, setUploadingNodeId] = useState<string | null>(null);
  const [showFinalize, setShowFinalize] = useState(false);
  const [showRequestRecordings, setShowRequestRecordings] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Save state
  const [savedDraft, setSavedDraft] = useState(false);
  const [finalized, setFinalized] = useState(false);

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

  function handleEditNode(nodeId: string) {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (node) setEditingNode(node);
  }

  function handleSaveNode(updated: FlowNode) {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === updated.id ? updated : n)),
    }));
  }

  function handleUploadNode(nodeId: string) {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (node) {
      setUploadingNodeLabel(node.label);
      setUploadingNodeId(nodeId);
    }
  }

  function handleUploadComplete() {
    if (uploadingNodeId) {
      setWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.id === uploadingNodeId ? { ...n, hasRecording: true } : n,
        ),
      }));
    }
  }

  function handleDeleteNode(nodeId: string) {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== nodeId),
    }));
  }

  function handleAddQuestion() {
    const questionCount = workflow.nodes.filter((n) => n.type === "question").length;
    const newNode: FlowNode = {
      id: `q${questionCount + 1}-${Date.now()}`,
      type: "question",
      label: `Question ${questionCount + 1}`,
      script: "",
      answerType: "open",
      hasRecording: false,
    };
    const eligibilityIndex = workflow.nodes.findIndex((n) => n.type === "eligibility");
    const insertAt = eligibilityIndex >= 0 ? eligibilityIndex : workflow.nodes.length;
    const updated = [...workflow.nodes];
    updated.splice(insertAt, 0, newNode);
    setWorkflow((prev) => ({ ...prev, nodes: updated }));
    setEditingNode(newNode);
  }

  function handleSaveDraft() {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
  }

  function handleFinalize() {
    setFinalized(true);
    setTimeout(() => setFinalized(false), 3000);
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
                <span className={cn(
                  "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                  finalized
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-[#5B58EB]/10 text-[#5B58EB]",
                )}>
                  {finalized ? "Finalized" : "Draft"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Saved toast */}
          {savedDraft && (
            <div
              className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-semibold text-emerald-700"
              style={{ animation: "fadeIn 0.3s ease-out" }}
            >
              <Check className="h-3.5 w-3.5" />
              Saved as draft
            </div>
          )}
          <Button
            variant="ghost"
            color="neutral"
            className="text-[12px]"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            Settings
          </Button>
          <Button
            variant="secondary"
            color="brand"
            className="text-[12px]"
            onClick={handleSaveDraft}
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save draft
          </Button>
          <button
            onClick={() => setShowRequestRecordings(true)}
            className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-[12px] font-semibold text-emerald-700 transition-all hover:bg-emerald-100"
          >
            <Mic className="h-3.5 w-3.5" />
            Request recordings
          </button>
          <Button
            variant="primary"
            color="brand"
            className="text-[12px]"
            onClick={() => setShowFinalize(true)}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Finalize agent
          </Button>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left — Chat (flow agent only, no help tab) */}
        <div className="flex w-[380px] shrink-0 flex-col overflow-hidden border-r border-[#d0d5e4] bg-[#f0f2f8]">
          <div className="flex items-center gap-2 border-b border-[#d0d5e4] bg-white px-4 py-2.5">
            <Sparkles className="h-4 w-4 text-[#5B58EB]" />
            <span className="text-[13px] font-semibold text-[#0A2353]">
              AI Flow Agent
            </span>
            <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
              Online
            </span>
          </div>
          <WorkflowChat messages={messages} onSend={handleSend} />
        </div>

        {/* Right — Diagram + Advanced panels */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#f0f2f8]/60">
          {/* Tab bar */}
          <div className="flex items-center gap-1 border-b border-[#d0d5e4] bg-white px-4 py-1.5">
            {(
              [
                { key: "flow", label: "Conversation flow", count: workflow.nodes.length },
                { key: "edge", label: "Edge cases", count: workflow.edgeCases.length, advanced: true },
                { key: "silence", label: "Silence", count: undefined, advanced: true },
                { key: "variations", label: "Variations", count: workflow.variations.length, advanced: true },
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
                {"advanced" in tab && tab.advanced && activeTab !== tab.key && (
                  <span className="rounded bg-amber-100 px-1 py-0.5 text-[8px] font-bold uppercase text-amber-700">
                    Advanced
                  </span>
                )}
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
                onEdit={handleEditNode}
                onUpload={handleUploadNode}
                onDelete={handleDeleteNode}
                onAddQuestion={handleAddQuestion}
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

      {/* Help chat popup — bottom right corner */}
      <HelpChatPopup />

      {/* Edit node modal */}
      {editingNode && (
        <EditNodeModal
          node={editingNode}
          onClose={() => setEditingNode(null)}
          onSave={handleSaveNode}
        />
      )}

      {/* Upload recording modal */}
      {uploadingNodeLabel && (
        <UploadRecordingModal
          nodeLabel={uploadingNodeLabel}
          onClose={() => {
            setUploadingNodeLabel(null);
            setUploadingNodeId(null);
          }}
          onUpload={() => {
            handleUploadComplete();
          }}
        />
      )}

      {/* Finalize modal */}
      {showFinalize && (
        <FinalizeModal
          workflow={workflow}
          onClose={() => setShowFinalize(false)}
          onSaveDraft={() => {
            handleSaveDraft();
            setShowFinalize(false);
          }}
          onRequestRecordings={() => {
            setShowFinalize(false);
            setShowRequestRecordings(true);
          }}
          onFinalize={handleFinalize}
        />
      )}

      {/* Request recordings modal */}
      {showRequestRecordings && (
        <RequestRecordingsModal
          nodes={workflow.nodes}
          agentName={workflow.agentName}
          onClose={() => setShowRequestRecordings(false)}
          onSubmit={() => {
            handleSaveDraft();
          }}
        />
      )}
    </div>
  );
}
