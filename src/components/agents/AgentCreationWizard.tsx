"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  FileAudio,
  GitBranch,
  ListOrdered,
  Mic2,
  Play,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Volume2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { cn } from "@/lib/cn";

const STEPS = [
  { id: 1, label: "Details", desc: "Name & language", icon: Bot },
  { id: 2, label: "Opening", desc: "Call intro", icon: Mic2 },
  { id: 3, label: "Questions", desc: "Qualification flow", icon: ListOrdered },
  { id: 4, label: "Eligibility", desc: "Qualified message", icon: ShieldCheck },
  { id: 5, label: "Success", desc: "Closing recording", icon: Sparkles },
  { id: 6, label: "Edge cases", desc: "Objections & exits", icon: GitBranch },
  { id: 7, label: "Variations", desc: "Natural variety", icon: Shuffle },
  { id: 8, label: "Settings", desc: "Ambience & context", icon: SlidersHorizontal },
] as const;

const LANGUAGE_OPTIONS = [
  { value: "fr", label: "French" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
];

const EXIT_OPTIONS = [
  { value: "exit_billing", label: "exit_billing_too_low.mp3" },
  { value: "exit_not_eligible", label: "exit_not_eligible.mp3" },
];

const QUESTION_OPTIONS = [
  { value: "q1", label: "Question 1" },
  { value: "q2", label: "Question 2" },
];

const VARIATION_OPTIONS = [
  { value: "", label: "Variation of…" },
  { value: "opening_1", label: "Opening 1" },
  { value: "opening_2", label: "Opening 2" },
  { value: "question_1", label: "Question 1" },
  { value: "question_2", label: "Question 2" },
  { value: "eligibility", label: "Eligibility" },
  { value: "success", label: "Success" },
];

const inputClass =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink-hint focus:border-accent focus:ring-4 focus:ring-accent/10";

function FormField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-[13px] font-semibold text-ink">{label}</label>
      {children}
      {hint && <p className="text-[12px] leading-relaxed text-ink-hint">{hint}</p>}
    </div>
  );
}

function TextInput({
  defaultValue,
  placeholder,
  value,
  onChange,
}: {
  defaultValue?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <input
      type="text"
      defaultValue={onChange ? undefined : defaultValue}
      value={onChange ? value : undefined}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      className={inputClass}
    />
  );
}

function UploadZone({ label, hint }: { label: string; hint?: string }) {
  return (
    <button
      type="button"
      className="wizard-upload-zone group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-gradient-to-b from-surface-subtle to-white px-5 py-7 text-center transition-all hover:border-accent/50 hover:from-accent-soft/40 hover:shadow-soft"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-accent shadow-md ring-1 ring-border transition-transform group-hover:scale-105">
        <Upload className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-ink">{label}</p>
        {hint && <p className="mt-1 text-[12px] text-ink-muted">{hint}</p>}
      </div>
      <span className="rounded-full bg-accent-soft px-3 py-1 text-[11px] font-medium text-accent">
        MP3 or WAV · drag & drop
      </span>
    </button>
  );
}

function MiniWave() {
  return (
    <div className="flex h-5 items-end gap-[2px]" aria-hidden>
      {[0.4, 0.8, 0.55, 1, 0.65, 0.9].map((h, i) => (
        <div
          key={i}
          className="agent-wave-bar w-[2px] rounded-full bg-gradient-to-t from-blue-500 to-violet-400"
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.06}s` }}
        />
      ))}
    </div>
  );
}

function RecordingRow({
  name,
  tag,
  play = true,
}: {
  name: string;
  tag?: string;
  play?: boolean;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3 shadow-sm transition-all hover:border-accent/25 hover:shadow-soft">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-200">
        <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
      </div>
      <FileAudio className="h-4 w-4 shrink-0 text-violet-500" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-ink">{name}</p>
        <MiniWave />
      </div>
      {tag && <Badge variant="blue">{tag}</Badge>}
      {play && (
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-sm shadow-accent/25 transition-transform hover:scale-110"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
        </button>
      )}
    </div>
  );
}

function PillGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-xl border px-3.5 py-2 text-[12.5px] font-medium transition-all",
            value === opt
              ? "border-accent bg-accent text-white shadow-md shadow-accent/20"
              : "border-border bg-white text-ink-muted hover:border-accent/40 hover:bg-accent-soft/50 hover:text-accent",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function SectionCard({
  title,
  desc,
  optional,
  accent = "blue",
  children,
}: {
  title: string;
  desc?: string;
  optional?: boolean;
  accent?: "blue" | "violet" | "emerald";
  children: React.ReactNode;
}) {
  const accentBar = {
    blue: "from-blue-500 to-indigo-500",
    violet: "from-violet-500 to-purple-500",
    emerald: "from-emerald-500 to-teal-500",
  }[accent];

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
      <div className={cn("h-1 bg-gradient-to-r", accentBar)} />
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
              {optional && <Badge variant="amber">Optional</Badge>}
            </div>
            {desc && (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{desc}</p>
            )}
          </div>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}

function StepNav({
  step,
  onStep,
}: {
  step: number;
  onStep: (s: number) => void;
}) {
  return (
    <nav className="flex w-44 shrink-0 flex-col border-r border-border pr-3 sm:w-48 sm:pr-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-hint">
        Setup progress
      </p>
      <ul className="space-y-1">
        {STEPS.map((s) => {
          const done = s.id < step;
          const active = s.id === step;
          const Icon = s.icon;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onStep(s.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-all",
                  active
                    ? "bg-accent-soft ring-1 ring-accent/20"
                    : done
                      ? "hover:bg-surface-subtle"
                      : "opacity-60 hover:bg-surface-subtle hover:opacity-100",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 transition-all",
                    active
                      ? "border-accent bg-accent text-white shadow-sm"
                      : done
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : "border-border bg-white text-ink-hint",
                  )}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-[12px] font-semibold",
                      active ? "text-accent" : "text-ink",
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="block truncate text-[10px] text-ink-hint">{s.desc}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export type NewAgent = { name: string; language: string };

const LANGUAGE_LABELS: Record<string, string> = {
  fr: "French",
  en: "English",
  es: "Spanish",
};

export function AgentCreationWizard({
  onClose,
  onComplete,
}: {
  onClose?: () => void;
  onComplete?: (agent: NewAgent) => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Health insurance FR - July");
  const [language, setLanguage] = useState("fr");
  const [exitRecording, setExitRecording] = useState("exit_billing");
  const [edgeQuestion, setEdgeQuestion] = useState("q1");
  const [variationOf, setVariationOf] = useState("");
  const [answerType, setAnswerType] = useState("Short answer");
  const [ambience, setAmbience] = useState("Office ambience");
  const [volume, setVolume] = useState(10);
  const [q2Open, setQ2Open] = useState(false);

  function goTo(s: number) {
    setStep(Math.min(8, Math.max(1, s)));
  }

  function handleNext() {
    if (step < 8) goTo(step + 1);
    else {
      onComplete?.({
        name: name.trim() || "Untitled agent",
        language: LANGUAGE_LABELS[language] ?? "French",
      });
      onClose?.();
    }
  }

  const stepContent = (
    <div key={step} className="wizard-step-enter space-y-4">
      {step === 1 && (
        <SectionCard
          title="Agent details"
          desc="Basic information about this calling agent."
          accent="violet"
        >
          <FormField label="Agent name" hint="Shown in your agent list and campaign reports">
            <TextInput value={name} onChange={setName} />
          </FormField>
          <FormField label="Language">
            <CustomSelect value={language} onChange={setLanguage} options={LANGUAGE_OPTIONS} />
          </FormField>
          <FormField label="Description" hint="Short summary of what this agent does">
            <TextInput placeholder="Qualifies leads for health insurance offers" />
          </FormField>
        </SectionCard>
      )}

      {step === 2 && (
        <SectionCard
          title="Opening recordings"
          desc="These play in order at the start of every call, before the first question."
        >
          <div className="space-y-2">
            <RecordingRow name="opening_1_bonjour.mp3" tag="Opening 1" />
            <RecordingRow name="opening_2_presentation.mp3" tag="Opening 2" />
          </div>
          <UploadZone label="Add opening recording" hint="Plays after the previous opening" />
        </SectionCard>
      )}

      {step === 3 && (
        <>
          <SectionCard title="Question 1" desc="First qualification question in the call flow." accent="violet">
            <Badge variant="green">Recording uploaded</Badge>
            <RecordingRow name="question_1_type_assurance.mp3" />
            <FormField label="Answer type">
              <PillGroup
                options={["Short answer", "Long answer", "Multiple choice"]}
                value={answerType}
                onChange={setAnswerType}
              />
            </FormField>
            <FormField label="Qualification rule" hint="Optional — agent ends call if rule fails">
              <TextInput defaultValue="Lead's billing must be more than $100" />
            </FormField>
            <FormField label="If rule not met, play exit and end call">
              <CustomSelect
                value={exitRecording}
                onChange={setExitRecording}
                options={EXIT_OPTIONS}
              />
            </FormField>
          </SectionCard>

          <button
            type="button"
            onClick={() => setQ2Open((v) => !v)}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-subtle px-4 py-3.5 text-left transition-colors hover:border-accent/30 hover:bg-accent-soft/30"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-ink-muted shadow-sm">
              <ListOrdered className="h-4 w-4" />
            </span>
            <span className="flex-1 text-sm font-semibold text-ink">Question 2 — Date of birth</span>
            <Badge>Short answer</Badge>
            <ChevronDown
              className={cn("h-4 w-4 text-ink-hint transition-transform", q2Open && "rotate-180")}
            />
          </button>

          <UploadZone label="Add another question" hint="Questions play in order during the call" />
        </>
      )}

      {step === 4 && (
        <SectionCard
          title="Eligibility recording"
          desc="Plays once the lead has answered every question and qualifies."
          accent="emerald"
        >
          <UploadZone label="Upload eligibility recording" hint="e.g. confirmation they qualify for an offer" />
        </SectionCard>
      )}

      {step === 5 && (
        <SectionCard
          title="Success recording"
          desc="Final message after eligibility. Cannot be interrupted — call ends when it finishes."
          accent="emerald"
        >
          <RecordingRow name="success_merci.mp3" />
        </SectionCard>
      )}

      {step === 6 && (
        <>
          <SectionCard
            title="Question edge cases"
            desc='Objection answers tied to a specific question — e.g. "who are you?"'
            optional
          >
            <RecordingRow name="edge_qui_etes_vous.mp3" tag="Question 1" />
            <div className="grid gap-3 sm:grid-cols-[1fr_160px] sm:items-end">
              <UploadZone label="Upload edge recording" />
              <FormField label="For question">
                <CustomSelect
                  value={edgeQuestion}
                  onChange={setEdgeQuestion}
                  options={QUESTION_OPTIONS}
                />
              </FormField>
            </div>
          </SectionCard>
          <SectionCard title="General edge cases" desc="Can play at any point in the call." optional>
            <UploadZone label="Upload general edge recording" />
          </SectionCard>
          <SectionCard title="Exit recordings" desc="Polite goodbyes when the lead refuses." optional>
            <RecordingRow name="exit_not_eligible.mp3" play={false} />
            <UploadZone label="Upload exit recording" />
          </SectionCard>
          <SectionCard title="Silence prompt" desc="Plays when the lead goes quiet." optional>
            <UploadZone label="Upload silence prompt" hint='e.g. "Are you still there?"' />
          </SectionCard>
        </>
      )}

      {step === 7 && (
        <SectionCard
          title="Variations"
          desc="Alternative versions so the agent never sounds repetitive."
          optional
          accent="violet"
        >
          <div className="rounded-xl border border-border bg-surface-subtle/80 p-4">
            <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-ink">
              Question 1 — type d&apos;assurance
              <Badge>2 variations</Badge>
            </p>
            <div className="space-y-2">
              <RecordingRow name="question_1_variation_a.mp3" play={false} />
              <RecordingRow name="question_1_variation_b.mp3" play={false} />
            </div>
            <button
              type="button"
              className="mt-3 text-[12.5px] font-semibold text-accent hover:underline"
            >
              + Add variation for Question 1
            </button>
          </div>
          <FormField label="Add variation for another recording">
            <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
              <UploadZone label="Upload variation" />
              <CustomSelect
                value={variationOf}
                onChange={setVariationOf}
                options={VARIATION_OPTIONS}
              />
            </div>
          </FormField>
        </SectionCard>
      )}

      {step === 8 && (
        <>
          <SectionCard title="Background sound" desc="Soft ambient audio behind the agent's voice." optional>
            <FormField label="Ambience">
              <PillGroup
                options={["None", "Office ambience", "Café ambience", "Call centre"]}
                value={ambience}
                onChange={setAmbience}
              />
            </FormField>
            <FormField label="Volume">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-subtle px-4 py-3">
                <Volume2 className="h-4 w-4 shrink-0 text-ink-hint" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(+e.target.value)}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-accent"
                />
                <span className="min-w-[44px] rounded-lg bg-white px-2 py-1 text-center text-[13px] font-bold text-ink shadow-sm">
                  {volume}%
                </span>
              </div>
            </FormField>
            <UploadZone label="Or upload custom background" hint="Loops softly under the agent voice" />
          </SectionCard>

          <SectionCard
            title="Agent context"
            desc="Business and campaign context for natural objection handling."
            accent="violet"
          >
            <textarea
              rows={5}
              defaultValue="We are a French health insurance broker. This campaign targets people aged 55+ who already have a mutuelle and may save money by switching. Leads came from an online comparison form."
              className={cn(inputClass, "resize-y leading-relaxed")}
            />
          </SectionCard>

          <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent-soft to-violet-50 p-4">
            <p className="text-[13px] font-semibold text-ink">Ready to create</p>
            <p className="mt-1 text-[12px] text-ink-muted">
              <span className="font-medium text-ink">{name || "Untitled agent"}</span> ·{" "}
              {LANGUAGE_LABELS[language]} · 8 steps complete
            </p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 gap-4 overflow-hidden px-4 py-4 sm:px-5 sm:py-5">
        <StepNav step={step} onStep={goTo} />

        <div className="custom-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto pr-1">
          {stepContent}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-surface-subtle p-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full" onClick={() => onClose?.()}>
            Cancel
          </Button>
          <Button color="violet" className="w-full gap-2" onClick={handleNext}>
            {step === 8 ? "Create agent" : "Next"}
            {step < 8 && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
