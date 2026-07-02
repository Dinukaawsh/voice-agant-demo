"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Play,
  Plus,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 mt-3 block text-[12px] font-semibold tracking-wide text-ink-muted uppercase">
      {children}
    </label>
  );
}

function Input({
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
      className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-shadow focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
    />
  );
}

function Select({ children }: { children: React.ReactNode }) {
  return (
    <select className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-shadow focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)]">
      {children}
    </select>
  );
}

function UploadZone({ children }: { children: React.ReactNode }) {
  return (
    <div className="cursor-pointer rounded-lg border-[1.5px] border-dashed border-border-strong bg-surface-subtle px-4 py-4 text-center text-[13px] text-ink-muted transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent">
      <Upload className="mx-auto mb-1.5 h-4 w-4 opacity-60" />
      {children}
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
    <div className="mb-2 flex items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-[13.5px]">
      <Check className="h-4 w-4 shrink-0 text-green" strokeWidth={3} />
      <span className="min-w-0 flex-1 truncate">{name}</span>
      {tag && <Badge variant="default">{tag}</Badge>}
      {play && (
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-[12px] text-ink-hint hover:text-accent"
        >
          <Play className="h-3 w-3 fill-current" />
          play
        </button>
      )}
    </div>
  );
}

function Pill({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors ${
        selected
          ? "border-accent bg-accent-soft font-semibold text-accent"
          : "border-border-strong bg-surface text-ink-muted hover:border-accent/40"
      }`}
    >
      {children}
    </button>
  );
}

function WizardCard({
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
    <div className="mb-3 rounded-xl border border-border bg-surface p-5">
      <div className="mb-1 flex items-center gap-2">
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        {optional && <Badge variant="amber">Optional</Badge>}
      </div>
      {desc && <p className="mb-3 text-[13px] text-ink-muted">{desc}</p>}
      {children}
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

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-border bg-surface-subtle p-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(s.id)}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors ${
              step === s.id
                ? "border border-border bg-surface font-semibold text-ink shadow-sm"
                : "text-ink-muted hover:bg-surface-muted"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                step === s.id
                  ? "border-accent bg-accent text-white"
                  : s.id < step
                    ? "border-green bg-green-soft text-green"
                    : "border-border-strong bg-surface"
              }`}
            >
              {s.id < step ? <Check className="h-3 w-3" strokeWidth={3} /> : s.id}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="max-h-[50vh] overflow-y-auto pr-1">
        {step === 1 && (
          <WizardCard
            title="Agent details"
            desc="Basic information about this calling agent."
          >
            <Label>Agent name</Label>
            <Input defaultValue="Health insurance FR — July" />
            <Label>Language</Label>
            <Select>
              <option>French</option>
              <option>English</option>
              <option>Spanish</option>
            </Select>
            <Label>Description</Label>
            <Input placeholder="Qualifies leads for health insurance offers" />
          </WizardCard>
        )}

        {step === 2 && (
          <WizardCard
            title="Opening recordings"
            desc="These play in order at the start of every call, before the first question."
          >
            <RecordingRow name="opening_1_bonjour.mp3" tag="Opening 1" />
            <RecordingRow name="opening_2_presentation.mp3" tag="Opening 2" />
            <UploadZone>Upload Opening 3 (MP3 or WAV)</UploadZone>
          </WizardCard>
        )}

        {step === 3 && (
          <>
            <WizardCard title="Question 1">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="green">Recording uploaded</Badge>
              </div>
              <RecordingRow name="question_1_type_assurance.mp3" />
              <Label>Answer type</Label>
              <div className="flex flex-wrap gap-2">
                {["Short answer", "Long answer", "Multiple choice"].map((t) => (
                  <Pill
                    key={t}
                    selected={answerType === t}
                    onClick={() => setAnswerType(t)}
                  >
                    {t}
                  </Pill>
                ))}
              </div>
              <Label>Qualification rule (optional)</Label>
              <Input defaultValue="Lead's billing must be more than $100" />
              <Label>If the rule is not met, play this exit and end the call</Label>
              <Select>
                <option>exit_billing_too_low.mp3</option>
                <option>exit_not_eligible.mp3</option>
              </Select>
            </WizardCard>
            <div className="mb-3 rounded-xl border border-border bg-surface px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Question 2 — Date of birth</span>
                <Badge>Short answer</Badge>
                <ChevronDown className="ml-auto h-4 w-4 text-ink-hint" />
              </div>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed border-border-strong bg-surface-subtle py-3.5 text-[13px] text-ink-muted hover:border-accent hover:text-accent"
            >
              <Plus className="h-4 w-4" />
              Add another question
            </button>
          </>
        )}

        {step === 4 && (
          <WizardCard
            title="Eligibility recording"
            desc="Plays once the lead has answered every question and qualifies."
          >
            <UploadZone>Upload eligibility recording</UploadZone>
          </WizardCard>
        )}

        {step === 5 && (
          <WizardCard
            title="Success recording"
            desc="The final message. It plays after eligibility, can't be interrupted, and the call ends when it finishes."
          >
            <RecordingRow name="success_merci.mp3" />
          </WizardCard>
        )}

        {step === 6 && (
          <>
            <WizardCard
              title="Question edge cases"
              desc='Answers for objections tied to one specific question — like "who are you?" during Question 1.'
              optional
            >
              <RecordingRow name="edge_qui_etes_vous.mp3" tag="Question 1" />
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <UploadZone>Upload edge recording</UploadZone>
                </div>
                <Select>
                  <option>Question 1</option>
                  <option>Question 2</option>
                </Select>
              </div>
            </WizardCard>
            <WizardCard
              title="General edge cases"
              desc='Can play at any point in the call — like "how did you get my number?"'
              optional
            >
              <UploadZone>Upload general edge recording</UploadZone>
            </WizardCard>
            <WizardCard
              title="Exit recordings"
              desc="Polite goodbyes when the lead refuses or doesn't qualify."
              optional
            >
              <RecordingRow name="exit_not_eligible.mp3" play={false} />
              <div className="mt-2">
                <UploadZone>Upload exit recording</UploadZone>
              </div>
            </WizardCard>
            <WizardCard
              title="Silence prompt"
              desc='"Are you still there?" — plays when the lead goes quiet.'
              optional
            >
              <UploadZone>Upload silence prompt</UploadZone>
            </WizardCard>
          </>
        )}

        {step === 7 && (
          <WizardCard
            title="Variations"
            desc="Alternative versions of recordings you've already uploaded."
            optional
          >
            <div className="mb-1 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-[13.5px] font-semibold">
              Question 1 — type d&apos;assurance
              <Badge>2 variations</Badge>
            </div>
            <RecordingRow name="question_1_variation_a.mp3" play={false} />
            <RecordingRow name="question_1_variation_b.mp3" play={false} />
            <button
              type="button"
              className="mb-4 ml-6 text-[12.5px] font-medium text-accent hover:underline"
            >
              + Add another variation for Question 1
            </button>
            <Label>Add a variation for another recording</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex-1">
                <UploadZone>Upload variation</UploadZone>
              </div>
              <Select>
                <option>Variation of…</option>
                <option>Opening 1</option>
                <option>Question 1</option>
                <option>Success</option>
              </Select>
            </div>
          </WizardCard>
        )}

        {step === 8 && (
          <>
            <WizardCard
              title="Background sound"
              desc="A soft ambient sound behind the agent's voice."
              optional
            >
              <Label>Ambience</Label>
              <div className="flex flex-wrap gap-2">
                {["None", "Office ambience", "Café ambience", "Call centre"].map(
                  (a) => (
                    <Pill
                      key={a}
                      selected={ambience === a}
                      onClick={() => setAmbience(a)}
                    >
                      {a}
                    </Pill>
                  ),
                )}
              </div>
              <Label>Volume</Label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(+e.target.value)}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-accent"
                />
                <span className="min-w-[34px] text-[13px] text-ink-muted">
                  {volume}%
                </span>
              </div>
            </WizardCard>
            <WizardCard
              title="Agent context"
              desc="Tell the agent about your business and this campaign."
            >
              <textarea
                rows={4}
                defaultValue="We are a French health insurance broker. This campaign targets people aged 55+ who already have a mutuelle and may save money by switching."
                className="w-full resize-y rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
              />
            </WizardCard>
          </>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <Button
          variant="secondary"
          onClick={() => (step === 1 ? onClose?.() : goTo(step - 1))}
          className={step === 1 ? "" : ""}
        >
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        <Button onClick={handleNext}>
          {step === 8 ? "Create agent" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
