"use client";

import {
  CampaignCreationWizard,
  type NewCampaign,
} from "./CampaignCreationWizard";
import { SlidePanel } from "@/components/ui/SlidePanel";
import { Megaphone } from "lucide-react";

export type { NewCampaign };

export function CampaignCreationModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate?: (campaign: NewCampaign) => void;
}) {
  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title="New campaign"
      subtitle="Set up an outbound dialing campaign in a few steps."
      headerExtra={
        <div className="border-t border-orange-100/80 bg-gradient-to-r from-orange-50 via-amber-50/80 to-rose-50 px-5 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 text-[12px] font-medium text-orange-800">
            <Megaphone className="h-3.5 w-3.5 text-orange-600" />
            Campaign setup · 4 steps · ~2 min
          </div>
        </div>
      }
    >
      <CampaignCreationWizard onClose={onClose} onComplete={onCreate} />
    </SlidePanel>
  );
}
