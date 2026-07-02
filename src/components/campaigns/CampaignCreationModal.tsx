"use client";

import { useState } from "react";
import { Check, Calendar, Megaphone, Users } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const STEPS = [
  { id: 1, label: "Details", icon: Megaphone },
  { id: 2, label: "Leads", icon: Users },
  { id: 3, label: "Schedule", icon: Calendar },
  { id: 4, label: "Review", icon: Check },
] as const;

const AGENTS = [
  "Health insurance FR - July",
  "Solar leads EN - Q3",
  "Insurance ES - Pilot",
];

const LEAD_LISTS = [
  { name: "Health FR - July list", count: 4200 },
  { name: "Solar EN - Q3 prospects", count: 2800 },
  { name: "Insurance ES pilot batch", count: 950 },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 mt-4 block text-[12px] font-semibold tracking-wide text-ink-muted uppercase first:mt-0">
      {children}
    </label>
  );
}

export type NewCampaign = {
  name: string;
  agent: string;
  status: string;
  leads: number;
  called: number;
  qualified: number;
  schedule: string;
};

export function CampaignCreationModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate?: (campaign: NewCampaign) => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Health FR - August outbound");
  const [agent, setAgent] = useState(AGENTS[0]);
  const [selectedLists, setSelectedLists] = useState<string[]>([
    LEAD_LISTS[0].name,
  ]);
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  function toggleList(name: string) {
    setSelectedLists((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
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

  function handleNext() {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    onCreate?.({
      name: name.trim() || "Untitled campaign",
      agent,
      status: "Running",
      leads: selectedLeadCount,
      called: 0,
      qualified: 0,
      schedule: `${days.join(", ")} · 9:00-18:00 CET`,
    });
    setStep(1);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New campaign"
      subtitle="Set up an outbound dialing campaign in a few steps."
      size="lg"
    >
      <div className="mb-5 flex gap-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const done = s.id < step;
          const active = s.id === step;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-all ${
                active
                  ? "border-accent bg-accent-soft shadow-sm"
                  : done
                    ? "border-green/30 bg-green-soft"
                    : "border-border bg-surface-subtle"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  active
                    ? "bg-accent text-white"
                    : done
                      ? "bg-green text-white"
                      : "bg-surface-muted text-ink-hint"
                }`}
              >
                {done ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  active ? "text-accent" : done ? "text-green" : "text-ink-hint"
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {step === 1 && (
        <div className="rounded-xl border border-border bg-surface-subtle p-5">
          <Label>Campaign name</Label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
          />
          <Label>Voice agent</Label>
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
          >
            {AGENTS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <Label>Description (optional)</Label>
          <input
            type="text"
            placeholder="Outbound calls for July health insurance leads"
            className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-2">
          <p className="mb-3 text-[13px] text-ink-muted">
            Choose one or more lead lists to dial. You can import a new list
            anytime.
          </p>
          {LEAD_LISTS.map((list) => {
            const selected = selectedLists.includes(list.name);
            return (
              <button
                key={list.name}
                type="button"
                onClick={() => toggleList(list.name)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all ${
                  selected
                    ? "border-accent bg-accent-soft shadow-sm"
                    : "border-border bg-surface hover:border-accent/30"
                }`}
              >
                <div>
                  <p className="text-[14px] font-medium text-ink">{list.name}</p>
                  <p className="text-[12px] text-ink-muted">
                    {list.count.toLocaleString()} leads
                  </p>
                </div>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all ${
                    selected
                      ? "border-accent bg-accent text-white"
                      : "border-border-strong bg-surface"
                  }`}
                >
                  {selected && (
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  )}
                </div>
              </button>
            );
          })}
          <button
            type="button"
            className="w-full rounded-xl border border-dashed border-border-strong py-3 text-[13px] font-medium text-accent hover:border-accent hover:bg-accent-soft"
          >
            + Import new lead list
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-xl border border-border bg-surface-subtle p-5">
          <Label>Active days</Label>
          <div className="flex flex-wrap gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  days.includes(day)
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border-strong bg-surface text-ink-muted"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Start time</Label>
              <input
                type="time"
                defaultValue="09:00"
                className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <Label>End time</Label>
              <input
                type="time"
                defaultValue="18:00"
                className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm"
              />
            </div>
          </div>
          <Label>Timezone</Label>
          <select className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm">
            <option>Europe/Paris (CET)</option>
            <option>Europe/London (GMT)</option>
            <option>America/New_York (EST)</option>
          </select>
          <Label>Max calls per hour</Label>
          <input
            type="number"
            defaultValue={120}
            className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm"
          />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-surface-subtle p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-hint">
              Summary
            </p>
            <div className="mt-3 space-y-2.5 text-[13.5px]">
              {[
                ["Campaign", name],
                ["Agent", agent],
                [
                  selectedLists.length > 1 ? "Lead lists" : "Lead list",
                  selectedLists.join(", ") || "None selected",
                ],
                ["Schedule", `${days.join(", ")} · 9:00–18:00 CET`],
                ["Leads", selectedLeadCount.toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-ink-muted">{k}</span>
                  <span className="text-right font-medium text-ink">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent-soft p-4">
            <Badge variant="blue">Ready</Badge>
            <p className="text-[13px] text-ink-muted">
              Campaign will start dialing immediately after creation. You can
              pause it anytime from the campaigns list.
            </p>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <Button
          variant="secondary"
          onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
        >
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        <Button onClick={handleNext}>
          {step === 4 ? "Launch campaign" : "Continue"}
        </Button>
      </div>
    </Modal>
  );
}
