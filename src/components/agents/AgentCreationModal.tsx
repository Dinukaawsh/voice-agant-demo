"use client";

import { AgentCreationWizard } from "@/components/agents/AgentCreationWizard";
import { Modal } from "@/components/ui/Modal";

export function AgentCreationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
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
      <AgentCreationWizard onClose={onClose} onComplete={onClose} />
    </Modal>
  );
}
