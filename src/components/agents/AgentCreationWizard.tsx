"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  FileAudio,
  Play,
  Plus,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { cn } from "@/lib/cn";

const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Opening" },
  { id: 3, label: "Questions" },
  { id: 4, label: "Eligibility" },
  { id: 5, label: "Success" },
  { id: 6, label: "Edge cases" },
  { id: 7, label: "Variations" },
  { id: 8, label: "Settings" },
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
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-[12px] font-semibold tracking-wide text-ink-muted uppercase">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-ink-hint">{hint}</p>}
    </div>
  );
}

function TextInput({
  defaultValue,
  placeholder,
}: {
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-hint focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
    />
  );
}

function UploadZone({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-border-strong bg-surface-subtle px-4 py-5 text-[13px] text-ink-muted transition-all hover:border-accent hover:bg-accent-soft hover:text-accent"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
        <Upload className="h-4 w-4" />
      </div>
      {children}
    </button>
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
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-soft">
        <Check className="h-4 w-4 text-green" strokeWidth={2.5} />
      </div>
      <FileAudio className="h-4 w-4 shrink-0 text-ink-hint" />
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
        {name}
      </span>
      {tag && <Badge variant="blue">{tag}</Badge>}
      {play && (
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[12px] text-ink-hint transition-colors hover:bg-accent-soft hover:text-accent"
        >
          <Play className="h-3 w-3 fill-current" />
          Play
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
            "rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all",
            value === opt
              ? "border-accent bg-accent text-white shadow-sm shadow-accent/20"
              : "border-border-strong bg-surface text-ink-muted hover:border-accent/40 hover:text-accent",
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
  children,
}: {
  title: string;
  desc?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-soft">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
            {optional && <Badge variant="amber">Optional</Badge>}
          </div>
          {desc && (
            <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
              {desc}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function StepIndicator({
  step,
  onStep,
}: {
  step: number;
  onStep: (s: number) => void;
}) {
  return (
    <div className="mb-5 shrink-0">
      <div className="mb-2 flex items-center justify-between text-[12px]">
        <span className="font-medium text-ink-muted">
          Step {step} of {STEPS.length}
        </span>
        <span className="font-semibold text-accent">
          {STEPS[step - 1]?.label}
        </span>
      </div>
      <div className="relative flex items-center justify-between">
        <div className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
        <div
          className="absolute left-4 top-1/2 h-0.5 -translate-y-1/2 bg-accent transition-all duration-300"
          style={{
            width: `calc(${((step - 1) / (STEPS.length - 1)) * 100}% - 2rem)`,
            maxWidth: "calc(100% - 2rem)",
          }}
        />
        {STEPS.map((s) => {
          const done = s.id < step;
          const active = s.id === step;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onStep(s.id)}
              title={s.label}
              className="relative z-10 flex flex-col items-center gap-1"
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-[11px] font-semibold transition-all",
                  active
                    ? "border-accent bg-accent text-white shadow-md shadow-accent/30"
                    : done
                      ? "border-green bg-green-soft text-green"
                      : "border-border-strong bg-surface text-ink-hint hover:border-accent/50",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.id}
              </span>
              <span
                className={cn(
                  "hidden text-[10px] font-medium sm:block",
                  active ? "text-accent" : "text-ink-hint",
                )}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AgentCreationWizard({
  onClose,
  onComplete,
}: {
  onClose?: () => void;
  onComplete?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState("fr");
  const [exitRecording, setExitRecording] = useState("exit_billing");
  const [edgeQuestion, setEdgeQuestion] = useState("q1");
  const [variationOf, setVariationOf] = useState("");
  const [answerType, setAnswerType] = useState("Short answer");
  const [ambience, setAmbience] = useState("Office ambience");
  const [volume, setVolume] = useState(10);

  function goTo(s: number) {
    setStep(Math.min(8, Math.max(1, s)));
  }

  function handleNext() {
    if (step < 8) goTo(step + 1);
    else {
      onComplete?.();
      onClose?.();
    }
  }

  const footer = (
    <div className="flex items-center justify-between gap-3">
      <Button
        variant="secondary"
        onClick={() => (step === 1 ? onClose?.() : goTo(step - 1))}
      >
        {step === 1 ? "Cancel" : "Back"}
      </Button>
      <div className="flex items-center gap-2">
        <span className="hidden text-[12px] text-ink-hint sm:inline">
          {step < 8 ? `${8 - step} steps remaining` : "Ready to create"}
        </span>
        <Button onClick={handleNext}>
          {step === 8 ? "Create agent" : "Continue"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <StepIndicator step={step} onStep={goTo} />

      <ScrollArea className="min-h-0 flex-1 pr-1" style={{ maxHeight: "52vh" }}>
        <div className="space-y-4 pb-1">
          {step === 1 && (
            <SectionCard
              title="Agent details"
              desc="Basic information about this calling agent."
            >
              <FormField label="Agent name">
                <TextInput defaultValue="Health insurance FR - July" />
              </FormField>
              <FormField label="Language">
                <CustomSelect
                  value={language}
                  onChange={setLanguage}
                  options={LANGUAGE_OPTIONS}
                />
              </FormField>
              <FormField
                label="Description"
                hint="Short summary of what this agent does"
              >
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
              <UploadZone>Upload Opening 3 (MP3 or WAV)</UploadZone>
            </SectionCard>
          )}

          {step === 3 && (
            <>
              <SectionCard title="Question 1">
                <Badge variant="green">Recording uploaded</Badge>
                <RecordingRow name="question_1_type_assurance.mp3" />
                <FormField label="Answer type">
                  <PillGroup
                    options={["Short answer", "Long answer", "Multiple choice"]}
                    value={answerType}
                    onChange={setAnswerType}
                  />
                </FormField>
                <FormField label="Qualification rule (optional)">
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

              <div className="rounded-xl border border-border bg-surface-subtle px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">
                    Question 2 - Date of birth
                  </span>
                  <Badge>Short answer</Badge>
                  <ChevronDown className="ml-auto h-4 w-4 text-ink-hint" />
                </div>
              </div>

              <UploadZone>Add another question</UploadZone>
            </>
          )}

          {step === 4 && (
            <SectionCard
              title="Eligibility recording"
              desc="Plays once the lead has answered every question and qualifies."
            >
              <UploadZone>Upload eligibility recording</UploadZone>
            </SectionCard>
          )}

          {step === 5 && (
            <SectionCard
              title="Success recording"
              desc="Final message after eligibility. Cannot be interrupted - call ends when it finishes."
            >
              <RecordingRow name="success_merci.mp3" />
            </SectionCard>
          )}

          {step === 6 && (
            <>
              <SectionCard
                title="Question edge cases"
                desc='Objection answers tied to a specific question - e.g. "who are you?"'
                optional
              >
                <RecordingRow name="edge_qui_etes_vous.mp3" tag="Question 1" />
                <div className="grid gap-3 sm:grid-cols-[1fr_160px] sm:items-end">
                  <UploadZone>Upload edge recording</UploadZone>
                  <FormField label="For question">
                    <CustomSelect
                      value={edgeQuestion}
                      onChange={setEdgeQuestion}
                      options={QUESTION_OPTIONS}
                    />
                  </FormField>
                </div>
              </SectionCard>
              <SectionCard
                title="General edge cases"
                desc='Can play at any point - e.g. "how did you get my number?"'
                optional
              >
                <UploadZone>Upload general edge recording</UploadZone>
              </SectionCard>
              <SectionCard
                title="Exit recordings"
                desc="Polite goodbyes when the lead refuses or doesn't qualify."
                optional
              >
                <RecordingRow name="exit_not_eligible.mp3" play={false} />
                <UploadZone>Upload exit recording</UploadZone>
              </SectionCard>
              <SectionCard
                title="Silence prompt"
                desc='"Are you still there?" - plays when the lead goes quiet.'
                optional
              >
                <UploadZone>Upload silence prompt</UploadZone>
              </SectionCard>
            </>
          )}

          {step === 7 && (
            <SectionCard
              title="Variations"
              desc="Alternative versions so the agent never sounds repetitive."
              optional
            >
              <div className="rounded-xl border border-border bg-surface-subtle p-3">
                <p className="mb-2 text-[13px] font-semibold text-ink">
                  Question 1 - type d&apos;assurance
                  <Badge>2 variations</Badge>
                </p>
                <div className="space-y-2">
                  <RecordingRow name="question_1_variation_a.mp3" play={false} />
                  <RecordingRow name="question_1_variation_b.mp3" play={false} />
                </div>
                <button
                  type="button"
                  className="mt-2 text-[12.5px] font-medium text-accent hover:underline"
                >
                  + Add variation for Question 1
                </button>
              </div>
              <FormField label="Add variation for another recording">
                <div className="grid gap-3 sm:grid-cols-[1fr_200px] sm:items-start">
                  <UploadZone>Upload variation</UploadZone>
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
              <SectionCard
                title="Background sound"
                desc="Soft ambient audio behind the agent's voice."
                optional
              >
                <FormField label="Ambience">
                  <PillGroup
                    options={[
                      "None",
                      "Office ambience",
                      "Café ambience",
                      "Call centre",
                    ]}
                    value={ambience}
                    onChange={setAmbience}
                  />
                </FormField>
                <FormField label="Volume">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => setVolume(+e.target.value)}
                      className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-accent"
                    />
                    <span className="min-w-[40px] rounded-lg bg-surface-muted px-2 py-1 text-center text-[13px] font-medium text-ink">
                      {volume}%
                    </span>
                  </div>
                </FormField>
                <UploadZone>Or upload your own background sound</UploadZone>
              </SectionCard>
              <SectionCard
                title="Agent context"
                desc="Business and campaign context for natural objection handling."
              >
                <textarea
                  rows={5}
                  defaultValue="We are a French health insurance broker. This campaign targets people aged 55+ who already have a mutuelle and may save money by switching. Leads came from an online comparison form."
                  className="w-full resize-y rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
                />
              </SectionCard>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 shrink-0 border-t border-border pt-4">{footer}</div>
    </div>
  );
}
