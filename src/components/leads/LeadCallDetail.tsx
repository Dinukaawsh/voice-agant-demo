"use client";

import { FileAudio, Play, Sparkles } from "lucide-react";
import { LeadStatusIndicator, type LeadStatusKey } from "@/components/leads/LeadStatusIndicator";
import { cn } from "@/lib/cn";

export type TranscriptTurn = { speaker: "agent" | "lead"; text: string; t: string };
export type ExtractionField = { label: string; value: string };

export type LeadCall = {
  name: string;
  phone: string;
  status: LeadStatusKey | string;
  agent: string;
  campaign: string;
  duration: string;
  outcome: string;
  attempts: number;
  date: string;
  recording: string;
  summary: string;
  transcript: TranscriptTurn[];
  extraction: ExtractionField[];
};

const DEFAULT_TRANSCRIPT: TranscriptTurn[] = [
  { speaker: "agent", text: "Bonjour, je vous appelle au sujet de votre mutuelle santé. Vous avez deux minutes ?", t: "0:02" },
  { speaker: "lead", text: "Oui, allez-y.", t: "0:08" },
  { speaker: "agent", text: "Parfait. Vous avez actuellement une complémentaire santé, c'est bien ça ?", t: "0:12" },
  { speaker: "lead", text: "Oui, je paie environ 142 euros par mois.", t: "0:19" },
  { speaker: "agent", text: "Et quelle est votre date de naissance, s'il vous plaît ?", t: "0:41" },
  { speaker: "lead", text: "Le 14 mars 1968.", t: "0:47" },
  { speaker: "agent", text: "Merci. Je vous envoie une comparaison gratuite par email, sans engagement.", t: "3:58" },
  { speaker: "lead", text: "Très bien, c'est noté.", t: "4:20" },
];

const DEFAULT_EXTRACTION: ExtractionField[] = [
  { label: "Full name", value: "Marie Dupont" },
  { label: "Date of birth", value: "14 Mar 1968" },
  { label: "Current monthly premium", value: "€142" },
  { label: "Has existing coverage", value: "Yes" },
  { label: "Interested", value: "Yes" },
  { label: "Preferred contact", value: "Email" },
];

/** Build a full call-detail object from a partial lead, filling demo defaults. */
export function buildLeadCall(input: Partial<LeadCall> & { name: string; phone: string }): LeadCall {
  return {
    status: "Qualified",
    agent: "Health insurance FR - July",
    campaign: "Health FR - July outbound",
    duration: "4:32",
    outcome: "Qualified",
    attempts: 1,
    date: "Today, 14:32",
    recording: `call_${input.name.toLowerCase().replace(/\s+/g, "_")}.mp3`,
    summary:
      "Lead confirmed they are the account holder with existing coverage at €142/mo and agreed to receive a free comparison by email. No objections raised during qualification.",
    transcript: DEFAULT_TRANSCRIPT,
    extraction: DEFAULT_EXTRACTION,
    ...input,
  };
}

function CallStat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-subtle px-3.5 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-hint">{label}</p>
      <p className={cn("mt-0.5 text-[14px] font-semibold text-ink", valueClass)}>{value}</p>
    </div>
  );
}

function RecordingPlayer({ name, duration }: { name: string; duration: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-md shadow-accent/25"
      >
        <Play className="h-4 w-4 fill-current" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex h-8 items-center gap-0.5">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-accent/40"
              style={{ height: `${18 + Math.sin(i * 0.5) * 10 + (i % 5) * 2}px` }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-ink-hint">
          <span>0:00</span>
          <span className="flex items-center gap-1">
            <FileAudio className="h-3 w-3" />
            {name}
          </span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}

export function LeadCallDetail({ call }: { call: LeadCall }) {
  return (
    <div className="space-y-5">
      {/* Call details */}
      <section>
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
          Call details
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <CallStat label="Duration" value={call.duration} />
          <CallStat
            label="Outcome"
            value={call.outcome}
            valueClass={call.outcome === "Qualified" ? "text-emerald-600" : undefined}
          />
          <CallStat label="Attempts" value={String(call.attempts)} />
          <CallStat label="When" value={call.date} />
        </div>
      </section>

      {/* Recording */}
      <section>
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
          Call recording
        </p>
        <RecordingPlayer name={call.recording} duration={call.duration} />
      </section>

      {/* Extraction summary */}
      <section>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
            Extraction summary
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {call.extraction.map((f) => (
            <div key={f.label} className="flex items-center justify-between gap-3 bg-white px-3.5 py-2.5">
              <span className="text-[12.5px] text-ink-muted">{f.label}</span>
              <span className="truncate text-[13px] font-semibold text-ink">{f.value}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-xl border border-border bg-surface-subtle p-3.5 text-[13px] leading-relaxed text-ink">
          {call.summary}
        </p>
      </section>

      {/* Transcription */}
      <section>
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
          Transcription
        </p>
        <div className="space-y-2.5 rounded-xl border border-border bg-white p-4">
          {call.transcript.map((turn, i) => (
            <div
              key={i}
              className={cn("flex gap-3", turn.speaker === "lead" && "flex-row-reverse")}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
                  turn.speaker === "agent"
                    ? "bg-gradient-to-br from-violet-500 to-purple-600"
                    : "bg-gradient-to-br from-blue-500 to-indigo-600",
                )}
              >
                {turn.speaker === "agent" ? "AI" : "L"}
              </div>
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-3.5 py-2",
                  turn.speaker === "agent"
                    ? "rounded-tl-sm bg-violet-50 text-ink"
                    : "rounded-tr-sm bg-blue-50 text-ink",
                )}
              >
                <p className="text-[13px] leading-relaxed">{turn.text}</p>
                <p className="mt-0.5 text-[10px] text-ink-hint">{turn.t}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Status footer */}
      <div className="flex items-center gap-2 text-[12px] text-ink-muted">
        <span>Current status:</span>
        <LeadStatusIndicator status={call.status} />
      </div>
    </div>
  );
}
