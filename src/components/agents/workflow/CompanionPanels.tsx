"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  VolumeX,
  Shuffle,
  GitBranch,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { EdgeCase, Variation } from "./types";

function UploadDot({ has }: { has: boolean }) {
  return (
    <button
      className={cn(
        "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all",
        has
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "border border-dashed border-[#5B58EB]/30 bg-white text-[#5B58EB] hover:bg-[#5B58EB]/5",
      )}
    >
      {has ? <Check className="h-3 w-3" /> : <Upload className="h-3 w-3" />}
      {has ? "Uploaded" : "Upload"}
    </button>
  );
}

function CollapsibleSection({
  title,
  icon: Icon,
  iconColor,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: typeof GitBranch;
  iconColor: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-[#d0d5e4] bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-[#f0f2f8]"
      >
        <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", iconColor)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="flex-1 text-[13px] font-semibold text-[#0A2353]">
          {title}
        </span>
        {count !== undefined && (
          <span className="rounded-full bg-[#5B58EB]/10 px-2 py-0.5 text-[10px] font-semibold text-[#5B58EB]">
            {count}
          </span>
        )}
        {open ? (
          <ChevronDown className="h-4 w-4 text-[#7b89a8]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-[#7b89a8]" />
        )}
      </button>
      {open && <div className="border-t border-[#d0d5e4]/60 px-4 pb-3 pt-2">{children}</div>}
    </div>
  );
}

export function EdgeCasePanel({ edgeCases }: { edgeCases: EdgeCase[] }) {
  return (
    <CollapsibleSection
      title="Edge cases"
      icon={GitBranch}
      iconColor="bg-orange-100 text-orange-600"
      count={edgeCases.length}
    >
      <div className="space-y-2">
        {edgeCases.map((ec) => (
          <div
            key={ec.id}
            className="group/ec flex items-start gap-2.5 rounded-lg border border-[#d0d5e4]/60 bg-[#f0f2f8]/60 p-2.5 transition-all hover:border-orange-200 hover:bg-orange-50/40"
          >
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#0A2353]">
                  {ec.name}
                </span>
                <UploadDot has={ec.hasRecording} />
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#3d4f78]">
                {ec.script}
              </p>
            </div>
            <div className="flex gap-0.5 opacity-0 transition-opacity group-hover/ec:opacity-100">
              <button className="rounded p-1 text-[#7b89a8] hover:bg-white hover:text-[#5B58EB]">
                <Pencil className="h-3 w-3" />
              </button>
              <button className="rounded p-1 text-[#7b89a8] hover:bg-white hover:text-red-500">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
        <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-orange-600 transition-colors hover:bg-orange-50">
          <Plus className="h-3 w-3" />
          Add edge case
        </button>
      </div>
    </CollapsibleSection>
  );
}

export function SilencePanel({
  silence,
}: {
  silence: { script: string; hasRecording: boolean };
}) {
  return (
    <CollapsibleSection
      title="Silence prompt"
      icon={VolumeX}
      iconColor="bg-pink-100 text-pink-600"
    >
      <div className="flex items-start gap-2.5 rounded-lg border border-pink-200/60 bg-pink-50/40 p-2.5">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pink-500" />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] leading-relaxed text-[#0A2353]/80">
            {silence.script}
          </p>
        </div>
        <UploadDot has={silence.hasRecording} />
        <button className="rounded p-1 text-[#7b89a8] hover:bg-white hover:text-[#5B58EB]">
          <Pencil className="h-3 w-3" />
        </button>
      </div>
      <p className="mt-2 text-[10px] text-[#7b89a8]">
        Played when the lead goes silent for too long. Brings them back into the conversation.
      </p>
    </CollapsibleSection>
  );
}

export function VariationsPanel({
  variations,
}: {
  variations: Variation[];
}) {
  const grouped = variations.reduce(
    (acc, v) => {
      if (!acc[v.questionId]) acc[v.questionId] = [];
      acc[v.questionId].push(v);
      return acc;
    },
    {} as Record<string, Variation[]>,
  );

  return (
    <CollapsibleSection
      title="Question variations"
      icon={Shuffle}
      iconColor="bg-[#8B63FF]/15 text-[#8B63FF]"
      count={variations.length}
    >
      <div className="space-y-3">
        {Object.entries(grouped).map(([qId, vars]) => (
          <div key={qId}>
            <div className="mb-1.5 text-[11px] font-semibold text-[#8B63FF]">
              {vars[0].questionLabel}
            </div>
            <div className="space-y-1.5">
              {vars.map((v) => (
                <div
                  key={v.id}
                  className="group/var flex items-start gap-2 rounded-lg border border-[#d0d5e4]/60 bg-[#f0f2f8]/60 p-2 transition-all hover:border-[#8B63FF]/30 hover:bg-[#8B63FF]/5"
                >
                  <Shuffle className="mt-0.5 h-3 w-3 shrink-0 text-[#8B63FF]/50" />
                  <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-[#3d4f78]">
                    {v.script}
                  </p>
                  <UploadDot has={v.hasRecording} />
                  <div className="flex gap-0.5 opacity-0 transition-opacity group-hover/var:opacity-100">
                    <button className="rounded p-1 text-[#7b89a8] hover:bg-white hover:text-[#5B58EB]">
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button className="rounded p-1 text-[#7b89a8] hover:bg-white hover:text-red-500">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-[#8B63FF] transition-colors hover:bg-[#8B63FF]/5">
          <Plus className="h-3 w-3" />
          Add variation
        </button>
      </div>
    </CollapsibleSection>
  );
}
