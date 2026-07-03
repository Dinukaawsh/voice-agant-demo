"use client";

import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  ClipboardList,
  Megaphone,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { cn } from "@/lib/cn";

const STEPS = [
  { id: 1, label: "Details", desc: "Name & agent", icon: Megaphone },
  { id: 2, label: "Leads", desc: "Lead lists", icon: Users },
  { id: 3, label: "Schedule", desc: "Days & hours", icon: Calendar },
  { id: 4, label: "Review", desc: "Launch check", icon: ClipboardList },
] as const;

const STEP_ICON_STYLES = [
  {
    idle: "border-orange-500 text-orange-600",
    active: "border-orange-500 bg-orange-500 text-white",
    hover: "group-hover/step:border-orange-500 group-hover/step:bg-orange-500 group-hover/step:text-white",
    label: "text-orange-600",
  },
  {
    idle: "border-cyan-500 text-cyan-600",
    active: "border-cyan-500 bg-cyan-500 text-white",
    hover: "group-hover/step:border-cyan-500 group-hover/step:bg-cyan-500 group-hover/step:text-white",
    label: "text-cyan-600",
  },
  {
    idle: "border-blue-500 text-blue-600",
    active: "border-blue-500 bg-blue-500 text-white",
    hover: "group-hover/step:border-blue-500 group-hover/step:bg-blue-500 group-hover/step:text-white",
    label: "text-blue-600",
  },
  {
    idle: "border-emerald-500 text-emerald-600",
    active: "border-emerald-500 bg-emerald-500 text-white",
    hover: "group-hover/step:border-emerald-500 group-hover/step:bg-emerald-500 group-hover/step:text-white",
    label: "text-emerald-600",
  },
] as const;

const AGENTS = [
  "Health insurance FR - July",
  "Solar leads EN - Q3",
  "Insurance ES - Pilot",
];

const AGENT_OPTIONS = AGENTS.map((a) => ({ value: a, label: a }));

const TIMEZONE_OPTIONS = [
  { value: "Europe/Paris", label: "Europe/Paris (CET)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "America/New_York", label: "America/New_York (EST)" },
];

const LEAD_LISTS = [
  { name: "Health FR - July list", count: 4200 },
  { name: "Solar EN - Q3 prospects", count: 2800 },
  { name: "Insurance ES pilot batch", count: 950 },
];

const inputClass =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink-hint focus:border-[#3c0382] focus:ring-4 focus:ring-[#3c0382]/10";

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[13px] font-semibold text-ink">{label}</label>
      {children}
      {hint && <p className="text-[12px] text-ink-hint">{hint}</p>}
    </div>
  );
}

function StepNav({ step, onStep }: { step: number; onStep: (s: number) => void }) {
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

export type NewCampaign = {
  name: string;
  agent: string;
  status: string;
  leads: number;
  dialed: number;
  answered: number;
  qualified: number;
  schedule: string;
};

export function CampaignCreationWizard({
  onClose,
  onComplete,
}: {
  onClose?: () => void;
  onComplete?: (campaign: NewCampaign) => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Health FR - August outbound");
  const [agent, setAgent] = useState(AGENTS[0]);
  const [timezone, setTimezone] = useState(TIMEZONE_OPTIONS[0].value);
  const [selectedLists, setSelectedLists] = useState<string[]>([LEAD_LISTS[0].name]);
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  function goTo(s: number) {
    setStep(Math.min(4, Math.max(1, s)));
  }

  function toggleList(listName: string) {
    setSelectedLists((prev) =>
      prev.includes(listName) ? prev.filter((n) => n !== listName) : [...prev, listName],
    );
  }

  function toggleDay(day: string) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  const selectedLeadCount = LEAD_LISTS.filter((l) =>
    selectedLists.includes(l.name),
  ).reduce((sum, l) => sum + l.count, 0);

  const timezoneLabel =
    TIMEZONE_OPTIONS.find((t) => t.value === timezone)?.label ?? timezone;

  function handleNext() {
    if (step < 4) {
      goTo(step + 1);
      return;
    }
    onComplete?.({
      name: name.trim() || "Untitled campaign",
      agent,
      status: "Running",
      leads: selectedLeadCount,
      dialed: 0,
      answered: 0,
      qualified: 0,
      schedule: `${days.join(", ")} · 9:00-18:00 ${timezoneLabel}`,
    });
    onClose?.();
  }

  const stepContent = (
    <div key={step} className="wizard-step-enter space-y-4">
      {step === 1 && (
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-rose-500" />
          <div className="space-y-4 p-5">
            <FormField label="Campaign name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Voice agent">
              <CustomSelect
                value={agent}
                onChange={setAgent}
                options={AGENT_OPTIONS}
                placeholder="Select an agent"
              />
            </FormField>
            <FormField label="Description" hint="Optional — shown in your campaigns list">
              <input
                type="text"
                placeholder="Outbound calls for July health insurance leads"
                className={inputClass}
              />
            </FormField>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
          <div className="p-5">
            <p className="mb-4 text-[13px] text-ink-muted">
              Choose one or more lead lists to dial. You can import a new list anytime.
            </p>
            <div className="space-y-2">
              {LEAD_LISTS.map((list) => {
                const selected = selectedLists.includes(list.name);
                return (
                  <button
                    key={list.name}
                    type="button"
                    onClick={() => toggleList(list.name)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all",
                      selected
                        ? "border-[#3c0382] bg-[#3c0382]/5 ring-1 ring-[#3c0382]/15"
                        : "border-border bg-white hover:border-[#3c0382]/30 hover:shadow-soft",
                    )}
                  >
                    <div>
                      <p className="text-[14px] font-medium text-ink">{list.name}</p>
                      <p className="text-[12px] text-ink-muted">
                        {list.count.toLocaleString()} leads
                      </p>
                    </div>
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-colors",
                        selected
                          ? "border-[#3c0382] bg-[#3c0382] text-white"
                          : "border-border bg-white text-transparent",
                      )}
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="mt-3 w-full rounded-xl border-2 border-dashed border-cyan-300/80 py-3 text-[13px] font-semibold text-cyan-700 transition-colors hover:border-cyan-500 hover:bg-cyan-50"
            >
              + Import new lead list
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div className="space-y-4 p-5">
            <FormField label="Active days">
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "rounded-full border-2 px-3.5 py-1.5 text-[12.5px] font-semibold transition-all",
                      days.includes(day)
                        ? "border-[#3c0382] bg-[#3c0382] text-white shadow-sm"
                        : "border-border bg-white text-ink-muted hover:border-[#3c0382]/40",
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Start time">
                <input type="time" defaultValue="09:00" className={inputClass} />
              </FormField>
              <FormField label="End time">
                <input type="time" defaultValue="18:00" className={inputClass} />
              </FormField>
            </div>
            <FormField label="Timezone">
              <CustomSelect
                value={timezone}
                onChange={setTimezone}
                options={TIMEZONE_OPTIONS}
                placeholder="Select timezone"
              />
            </FormField>
            <FormField label="Max calls per hour">
              <input type="number" defaultValue={120} className={inputClass} />
            </FormField>
          </div>
        </section>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="p-5">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-hint">
                Summary
              </p>
              <div className="mt-4 space-y-3">
                {[
                  ["Campaign", name],
                  ["Agent", agent],
                  [
                    selectedLists.length > 1 ? "Lead lists" : "Lead list",
                    selectedLists.join(", ") || "None selected",
                  ],
                  ["Schedule", `${days.join(", ")} · 9:00–18:00 ${timezoneLabel}`],
                  ["Total leads", selectedLeadCount.toLocaleString()],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-[13px] text-ink-muted">{k}</span>
                    <span className="max-w-[58%] text-right text-[13px] font-semibold text-ink">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="flex items-start gap-3 rounded-2xl border border-[#3c0382]/20 bg-gradient-to-br from-[#3c0382]/5 to-violet-50 p-4">
            <Badge variant="blue">Ready to launch</Badge>
            <p className="text-[13px] leading-relaxed text-ink-muted">
              Campaign will start dialing immediately after creation. You can pause it
              anytime from the campaigns list.
            </p>
          </div>
        </div>
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
            {step === 4 ? "Launch campaign" : "Next"}
            {step < 4 && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
