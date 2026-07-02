"use client";

import {
  AgentCreationWizard,
  type NewAgent,
} from "@/components/agents/AgentCreationWizard";
import { Modal } from "@/components/ui/Modal";

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
    <Modal
      open={open}
      onClose={onClose}
      title="Create a new agent"
      subtitle="Upload recordings in the order the call happens - no technical choices needed."
      size="2xl"
      scrollable={false}
      bodyClassName="!py-4"
    >
      <AgentCreationWizard onClose={onClose} onComplete={onCreate} />
    </Modal>
  );
}
