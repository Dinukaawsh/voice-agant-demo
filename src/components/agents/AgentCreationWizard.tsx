"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ClipboardList,
  FileAudio,
  GitBranch,
  Lightbulb,
  ListOrdered,
  Mic2,
  Play,
  Plus,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Building2,
  Coffee,
  Headphones,
  VolumeX,
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
  { id: 8, label: "Extraction", desc: "Fields captured", icon: ClipboardList },
  { id: 9, label: "Settings", desc: "Ambience & context", icon: SlidersHorizontal },
] as const;

/** Per-step icon colours — idle: white bg + coloured border/icon; active: filled + white icon */
const STEP_ICON_STYLES = [
  {
    idle: "border-violet-500 text-violet-600",
    active: "border-violet-500 bg-violet-500 text-white",
    hover: "group-hover/step:border-violet-500 group-hover/step:bg-violet-500 group-hover/step:text-white",
    label: "text-violet-600",
  },
  {
    idle: "border-blue-500 text-blue-600",
    active: "border-blue-500 bg-blue-500 text-white",
    hover: "group-hover/step:border-blue-500 group-hover/step:bg-blue-500 group-hover/step:text-white",
    label: "text-blue-600",
  },
  {
    idle: "border-cyan-500 text-cyan-600",
    active: "border-cyan-500 bg-cyan-500 text-white",
    hover: "group-hover/step:border-cyan-500 group-hover/step:bg-cyan-500 group-hover/step:text-white",
    label: "text-cyan-600",
  },
  {
    idle: "border-emerald-500 text-emerald-600",
    active: "border-emerald-500 bg-emerald-500 text-white",
    hover: "group-hover/step:border-emerald-500 group-hover/step:bg-emerald-500 group-hover/step:text-white",
    label: "text-emerald-600",
  },
  {
    idle: "border-amber-500 text-amber-600",
    active: "border-amber-500 bg-amber-500 text-white",
    hover: "group-hover/step:border-amber-500 group-hover/step:bg-amber-500 group-hover/step:text-white",
    label: "text-amber-600",
  },
  {
    idle: "border-orange-500 text-orange-600",
    active: "border-orange-500 bg-orange-500 text-white",
    hover: "group-hover/step:border-orange-500 group-hover/step:bg-orange-500 group-hover/step:text-white",
    label: "text-orange-600",
  },
  {
    idle: "border-fuchsia-500 text-fuchsia-600",
    active: "border-fuchsia-500 bg-fuchsia-500 text-white",
    hover: "group-hover/step:border-fuchsia-500 group-hover/step:bg-fuchsia-500 group-hover/step:text-white",
    label: "text-fuchsia-600",
  },
  {
    idle: "border-rose-500 text-rose-600",
    active: "border-rose-500 bg-rose-500 text-white",
    hover: "group-hover/step:border-rose-500 group-hover/step:bg-rose-500 group-hover/step:text-white",
    label: "text-rose-600",
  },
  {
    idle: "border-indigo-500 text-indigo-600",
    active: "border-indigo-500 bg-indigo-500 text-white",
    hover: "group-hover/step:border-indigo-500 group-hover/step:bg-indigo-500 group-hover/step:text-white",
    label: "text-indigo-600",
  },
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

const EXTRACTION_TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Yes / No" },
  { value: "longtext", label: "Long text" },
];

type ExtractionFieldDraft = {
  id: string;
  label: string;
  type: string;
  description: string;
};

const DEFAULT_EXTRACTION_FIELDS: ExtractionFieldDraft[] = [
  { id: "f1", label: "Full name", type: "text", description: "The lead's full name as confirmed on the call." },
  { id: "f2", label: "Date of birth", type: "date", description: "Used to check age eligibility." },
  { id: "f3", label: "Current monthly premium", type: "number", description: "What the lead currently pays per month." },
  { id: "f4", label: "Interested", type: "boolean", description: "Whether the lead agreed to a comparison." },
  { id: "f5", label: "Call summary", type: "longtext", description: "One-paragraph summary of the whole call." },
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

function StepGuide({ text, example }: { text: string; example?: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-blue-200/70 bg-blue-50/50 p-3.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
        <Lightbulb className="h-3.5 w-3.5" />
      </span>
      <div className="space-y-0.5">
        <p className="text-[12.5px] leading-relaxed text-ink-muted">{text}</p>
        {example && (
          <p className="text-[12px] leading-relaxed text-ink-hint">
            <span className="font-semibold text-ink">Example:</span> {example}
          </p>
        )}
      </div>
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

const AMBIENCE_OPTIONS = [
  {
    value: "None",
    label: "None",
    desc: "Agent voice only",
    icon: VolumeX,
    card: "from-slate-50 to-white",
    iconIdle: "border-slate-300 text-slate-500",
    iconActive: "border-[#3c0382] bg-[#3c0382] text-white",
  },
  {
    value: "Office ambience",
    label: "Office",
    desc: "Soft workplace hum",
    icon: Building2,
    card: "from-blue-50/80 to-white",
    iconIdle: "border-blue-400 text-blue-600",
    iconActive: "border-[#3c0382] bg-[#3c0382] text-white",
  },
  {
    value: "Café ambience",
    label: "Café",
    desc: "Warm background chatter",
    icon: Coffee,
    card: "from-amber-50/80 to-white",
    iconIdle: "border-amber-400 text-amber-600",
    iconActive: "border-[#3c0382] bg-[#3c0382] text-white",
  },
  {
    value: "Call centre",
    label: "Call centre",
    desc: "Professional floor tone",
    icon: Headphones,
    card: "from-indigo-50/80 to-white",
    iconIdle: "border-indigo-400 text-indigo-600",
    iconActive: "border-[#3c0382] bg-[#3c0382] text-white",
  },
] as const;

function AmbiencePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {AMBIENCE_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "group relative flex flex-col items-start gap-3 rounded-2xl border-2 bg-gradient-to-br p-3.5 text-left transition-all",
              opt.card,
              selected
                ? "border-[#3c0382] shadow-md shadow-[#3c0382]/15 ring-2 ring-[#3c0382]/10"
                : "border-border hover:border-[#3c0382]/40 hover:shadow-soft",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-colors duration-200 [&_svg]:shrink-0",
                selected ? opt.iconActive : cn("bg-white", opt.iconIdle),
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </span>
            <span>
              <span className="block text-[13px] font-semibold text-ink">{opt.label}</span>
              <span className="mt-0.5 block text-[11px] text-ink-muted">{opt.desc}</span>
            </span>
            {selected && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#3c0382] text-white">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function VolumeControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const level =
    value === 0 ? "Muted" : value < 35 ? "Low" : value < 70 ? "Medium" : "High";

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/40 p-4">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">
            Output level
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-[#3c0382]">{value}%</p>
          <p className="text-[12px] font-medium text-ink-muted">{level}</p>
        </div>
        <div className="flex h-12 items-end gap-1" aria-hidden>
          {[0.25, 0.45, 0.7, 1, 0.55, 0.85, 0.4].map((h, i) => {
            const threshold = ((i + 1) / 7) * 100;
            const active = value >= threshold;
            return (
              <div
                key={i}
                className={cn(
                  "w-1.5 rounded-full transition-all duration-300",
                  active
                    ? "bg-gradient-to-t from-[#3c0382] to-violet-500"
                    : "bg-border",
                )}
                style={{ height: `${h * 40}px` }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(0)}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            value === 0
              ? "border-[#3c0382] bg-[#3c0382] text-white"
              : "border-border bg-white text-ink-muted hover:border-[#3c0382]/40",
          )}
          aria-label="Mute"
        >
          <VolumeX className="h-4 w-4" />
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(+e.target.value)}
          className="volume-range h-2 flex-1 cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, #3c0382 0%, #7c3aed ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`,
          }}
        />

        <button
          type="button"
          onClick={() => onChange(100)}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            value === 100
              ? "border-[#3c0382] bg-[#3c0382] text-white"
              : "border-border bg-white text-ink-muted hover:border-[#3c0382]/40",
          )}
          aria-label="Max volume"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>
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
        {STEPS.map((s, index) => {
          const done = s.id < step;
          const active = s.id === step;
          const Icon = s.icon;
          const styles = STEP_ICON_STYLES[index];

          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onStep(s.id)}
                className={cn(
                  "group/step flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-all hover:bg-surface-subtle",
                  active && "bg-surface-subtle",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 transition-colors duration-200 [&_svg]:shrink-0",
                    done
                      ? "border-emerald-500 bg-white text-emerald-600 group-hover/step:border-emerald-500 group-hover/step:bg-emerald-500 group-hover/step:text-white"
                      : active
                        ? cn(styles.active, "shadow-sm")
                        : cn("bg-white", styles.idle, styles.hover),
                  )}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
                  ) : (
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block truncate text-[12px] font-semibold",
                      done && "text-emerald-700",
                      active && !done && styles.label,
                      !done && !active && "text-ink",
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
  mode = "create",
  initialName,
  initialLanguage,
}: {
  onClose?: () => void;
  onComplete?: (agent: NewAgent) => void;
  mode?: "create" | "edit";
  initialName?: string;
  initialLanguage?: string;
}) {
  const isEdit = mode === "edit";
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialName ?? "Health insurance FR - July");
  const [language, setLanguage] = useState(initialLanguage ?? "fr");
  const [exitRecording, setExitRecording] = useState("exit_billing");
  const [edgeQuestion, setEdgeQuestion] = useState("q1");
  const [variationOf, setVariationOf] = useState("");
  const [answerType, setAnswerType] = useState("Short answer");
  const [ambience, setAmbience] = useState("Office ambience");
  const [volume, setVolume] = useState(10);
  const [q2Open, setQ2Open] = useState(false);
  const [extractionFields, setExtractionFields] = useState<ExtractionFieldDraft[]>(
    DEFAULT_EXTRACTION_FIELDS,
  );

  function updateField(id: string, patch: Partial<ExtractionFieldDraft>) {
    setExtractionFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );
  }

  function addField() {
    setExtractionFields((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: "", type: "text", description: "" },
    ]);
  }

  function removeField(id: string) {
    setExtractionFields((prev) => prev.filter((f) => f.id !== id));
  }

  function goTo(s: number) {
    setStep(Math.min(9, Math.max(1, s)));
  }

  function handleNext() {
    if (step < 9) goTo(step + 1);
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
        <>
        <StepGuide
          text="Name this agent and choose the language it speaks. This is just for your team — leads never see it."
          example="&ldquo;Health insurance FR - July&rdquo;, language French"
        />
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
        </>
      )}

      {step === 2 && (
        <>
        <StepGuide
          text="Upload the greeting clips that play at the very start of the call, in order, before any question. Keep them short and warm."
          example="&ldquo;Bonjour, je suis Julie de MutuelleCompare, vous avez deux minutes ?&rdquo;"
        />
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
        </>
      )}

      {step === 3 && (
        <>
          <StepGuide
            text="Record one clip for each question you use to qualify the lead. Add them in the order they should be asked, and set how the answer is captured."
            example="&ldquo;Quel type d&rsquo;assurance recherchez-vous ?&rdquo;"
          />
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
        <>
        <StepGuide
          text="Upload the message that plays the moment a lead answers everything and qualifies. It should confirm the good news."
          example="&ldquo;Bonne nouvelle, vous êtes éligible à notre comparatif gratuit&hellip;&rdquo;"
        />
        <SectionCard
          title="Eligibility recording"
          desc="Plays once the lead has answered every question and qualifies."
          accent="emerald"
        >
          <UploadZone label="Upload eligibility recording" hint="e.g. confirmation they qualify for an offer" />
        </SectionCard>
        </>
      )}

      {step === 5 && (
        <>
        <StepGuide
          text="Upload the closing line that plays last. It cannot be interrupted, and the call ends when it finishes."
          example="&ldquo;Merci, un conseiller vous recontactera très bientôt. Bonne journée !&rdquo;"
        />
        <SectionCard
          title="Success recording"
          desc="Final message after eligibility. Cannot be interrupted — call ends when it finishes."
          accent="emerald"
        >
          <RecordingRow name="success_merci.mp3" />
        </SectionCard>
        </>
      )}

      {step === 6 && (
        <>
          <StepGuide
            text="Upload short replies for common objections, polite goodbyes when a lead declines, and a nudge for when they go quiet. All optional, but they make calls feel human."
            example="Objection &ldquo;Qui êtes-vous ?&rdquo; &rarr; &ldquo;Je vous appelle de la part de&hellip;&rdquo;"
          />
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
        <div className="space-y-4">
          <StepGuide
            text="Upload alternate takes of clips you already added, so the agent never sounds repetitive when it has to say the same thing twice."
            example="Two different recordings of Question 1, phrased slightly differently."
          />
          <div className="relative overflow-hidden rounded-2xl border border-fuchsia-200/80 bg-gradient-to-br from-fuchsia-50 via-violet-50 to-indigo-50 p-5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-fuchsia-300/20 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-fuchsia-500 bg-white text-fuchsia-600 shadow-sm">
                <Shuffle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-ink">Voice variations</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                  Upload alternate recordings so your agent sounds natural and never repetitive.
                </p>
              </div>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-fuchsia-200/60 bg-white shadow-soft">
            <div className="h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500" />
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[14px] font-semibold text-ink">Question 1 — type d&apos;assurance</p>
                  <p className="text-[12px] text-ink-muted">2 variations uploaded</p>
                </div>
                <span className="rounded-full bg-fuchsia-100 px-2.5 py-1 text-[11px] font-bold text-fuchsia-700 ring-1 ring-fuchsia-200">
                  A / B
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {["question_1_variation_a.mp3", "question_1_variation_b.mp3"].map((file, i) => (
                  <div
                    key={file}
                    className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-b from-white to-fuchsia-50/40 p-3 transition-all hover:border-fuchsia-300 hover:shadow-soft"
                  >
                    <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-fuchsia-500 text-[11px] font-bold text-white">
                      {i === 0 ? "A" : "B"}
                    </span>
                    <div className="flex items-center gap-2">
                      <FileAudio className="h-4 w-4 shrink-0 text-fuchsia-500" />
                      <p className="min-w-0 truncate text-[12px] font-medium text-ink">{file}</p>
                    </div>
                    <MiniWave />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-fuchsia-300/80 bg-fuchsia-50/50 py-2.5 text-[12.5px] font-semibold text-fuchsia-700 transition-colors hover:border-fuchsia-500 hover:bg-fuchsia-50"
              >
                <Plus className="h-4 w-4" />
                Add variation for Question 1
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <FormField label="Add variation for another recording" hint="Pick a parent recording, then upload an alternate take">
              <div className="grid gap-3">
                <CustomSelect
                  value={variationOf}
                  onChange={setVariationOf}
                  options={VARIATION_OPTIONS}
                />
                <UploadZone label="Upload variation" hint="MP3 or WAV — same script, different delivery" />
              </div>
            </FormField>
          </section>
        </div>
      )}

      {step === 8 && (
        <>
          <StepGuide
            text="No recordings here — just list the details you want back from every call. Give each one a clear name and a short description so the agent knows what to capture."
            example="Full name, date of birth, current monthly premium, interested (yes/no)."
          />
          <div className="relative overflow-hidden rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-300/20 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-rose-500 bg-white text-rose-600 shadow-sm">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-ink">Extraction fields</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                  The data the agent captures at the end of every call. These fields
                  form the call summary and are what gets exported to your CRM.
                </p>
              </div>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
            <div className="space-y-3 p-5">
              {extractionFields.map((field, i) => (
                <div
                  key={field.id}
                  className="rounded-2xl border border-border bg-surface-subtle/60 p-3.5"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100 text-[11px] font-bold text-rose-700">
                      {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-hint transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove field"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-[1fr_150px]">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Field name (e.g. Date of birth)"
                      className={inputClass}
                    />
                    <CustomSelect
                      value={field.type}
                      onChange={(v) => updateField(field.id, { type: v })}
                      options={EXTRACTION_TYPE_OPTIONS}
                    />
                  </div>
                  <input
                    type="text"
                    value={field.description}
                    onChange={(e) => updateField(field.id, { description: e.target.value })}
                    placeholder="Description — tells the agent what to capture (required)"
                    className={cn(inputClass, "mt-2.5")}
                  />
                  {!field.description.trim() && (
                    <p className="mt-1.5 text-[11.5px] font-medium text-amber-600">
                      A description is required before you can save this field.
                    </p>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addField}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-rose-300/80 bg-rose-50/50 py-2.5 text-[12.5px] font-semibold text-rose-700 transition-colors hover:border-rose-500 hover:bg-rose-50"
              >
                <Plus className="h-4 w-4" />
                Add extraction field
              </button>
            </div>
          </section>
        </>
      )}

      {step === 9 && (
        <>
          <StepGuide
            text="Add a soft background sound so calls feel like a real office, and give the agent some context about your business to handle objections naturally."
            example="Office ambience + &ldquo;We are a French health insurance broker&hellip;&rdquo;"
          />
          <div className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5">
            <div className="pointer-events-none absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-indigo-300/20 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-indigo-500 bg-white text-indigo-600 shadow-sm">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-ink">Agent settings</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                  Fine-tune background ambience and how your agent sounds on calls.
                </p>
              </div>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-[#3c0382]" />
            <div className="space-y-5 p-5">
              <FormField label="Background ambience" hint="Plays softly under the agent's voice during calls">
                <AmbiencePicker value={ambience} onChange={setAmbience} />
              </FormField>

              <FormField label="Ambience volume">
                <VolumeControl value={volume} onChange={setVolume} />
              </FormField>

              <UploadZone label="Or upload custom background" hint="Your own loop — MP3 or WAV" />
            </div>
          </section>

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
            <p className="text-[13px] font-semibold text-ink">
              {isEdit ? "Ready to save changes" : "Ready to create"}
            </p>
            <p className="mt-1 text-[12px] text-ink-muted">
              <span className="font-medium text-ink">{name || "Untitled agent"}</span> ·{" "}
              {LANGUAGE_LABELS[language]} · {extractionFields.length} extraction fields
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
          <Button color="brand" className="w-full gap-2" onClick={handleNext}>
            {step === 9 ? (isEdit ? "Save changes" : "Create agent") : "Next"}
            {step < 9 && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
