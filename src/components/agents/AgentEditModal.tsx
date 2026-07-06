"use client";

import {
  AgentCreationWizard,
  type NewAgent,
} from "@/components/agents/AgentCreationWizard";
import { SlidePanel } from "@/components/ui/SlidePanel";
import { Pencil } from "lucide-react";

const LANGUAGE_CODES: Record<string, string> = {
  French: "fr",
  English: "en",
  Spanish: "es",
};

export type EditableAgent = {
  name: string;
  language: string;
};

export function AgentEditModal({
  agent,
  onClose,
  onSave,
}: {
  agent: EditableAgent | null;
  onClose: () => void;
  onSave?: (agent: NewAgent) => void;
}) {
  return (
    <SlidePanel
      open={agent !== null}
      onClose={onClose}
      title={agent ? `Edit ${agent.name}` : "Edit agent"}
      subtitle="Update recordings, flow, extraction fields, and settings."
      size="wide"
      headerExtra={
        <div className="border-t border-violet-100/80 bg-gradient-to-r from-violet-50 via-indigo-50/80 to-blue-50 px-5 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 text-[12px] font-medium text-violet-800">
            <Pencil className="h-3.5 w-3.5 text-violet-600" />
            Jump to any step to edit recordings & flow
          </div>
        </div>
      }
    >
      {agent && (
        <AgentCreationWizard
          mode="edit"
          initialName={agent.name}
          initialLanguage={LANGUAGE_CODES[agent.language] ?? "fr"}
          onClose={onClose}
          onComplete={onSave}
        />
      )}
    </SlidePanel>
  );
}
