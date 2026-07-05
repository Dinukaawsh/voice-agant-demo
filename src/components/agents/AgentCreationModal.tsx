"use client";

import {
  AgentCreationWizard,
  type NewAgent,
} from "@/components/agents/AgentCreationWizard";
import { SlidePanel } from "@/components/ui/SlidePanel";
import { Sparkles } from "lucide-react";

export function AgentCreationModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate?: (agent: NewAgent) => void;
}) {
  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title="Create voice agent"
      subtitle="Build your agent step by step. Upload recordings in call order."
      size="wide"
      headerExtra={
        <div className="border-t border-blue-100/80 bg-gradient-to-r from-blue-50 via-indigo-50/80 to-violet-50 px-5 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 text-[12px] font-medium text-blue-800">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            Guided setup · 9 steps · ~5 min
          </div>
        </div>
      }
    >
      <AgentCreationWizard onClose={onClose} onComplete={onCreate} />
    </SlidePanel>
  );
}
