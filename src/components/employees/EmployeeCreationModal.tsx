"use client";

import { useState } from "react";
import { Bot, Gauge, Headset, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { SlidePanel } from "@/components/ui/SlidePanel";

export type NewEmployee = {
  name: string;
  agent: string;
  campaign: string;
  workWindow: string;
  timezone: string;
  dailyCap: number;
  callsToday: number;
  answered: number;
  eligible: number;
  status: string;
};

/** Fixed per-employee daily calling limit. */
const DAILY_CAP = 500;

const AGENT_OPTIONS = [
  { value: "Health insurance FR - July", label: "Health insurance FR - July" },
  { value: "Solar leads EN - Q3", label: "Solar leads EN - Q3" },
  { value: "Insurance ES - Pilot", label: "Insurance ES - Pilot" },
  { value: "Mutuelle comparison FR", label: "Mutuelle comparison FR" },
];

const CAMPAIGN_OPTIONS = [
  { value: "Health FR - July outbound", label: "Health FR - July outbound" },
  { value: "Solar EN - Q3 push", label: "Solar EN - Q3 push" },
  { value: "Insurance ES pilot", label: "Insurance ES pilot" },
  { value: "Mutuelle FR - August", label: "Mutuelle FR - August" },
];

const TIMEZONE_OPTIONS = [
  { value: "Europe/Paris", label: "Europe/Paris (CET)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "America/New_York", label: "America/New_York (EST)" },
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

export function EmployeeCreationModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate?: (employee: NewEmployee) => void;
}) {
  const [name, setName] = useState("");
  const [agent, setAgent] = useState(AGENT_OPTIONS[0].value);
  const [campaign, setCampaign] = useState(CAMPAIGN_OPTIONS[0].value);
  const [timezone, setTimezone] = useState(TIMEZONE_OPTIONS[0].value);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("13:00");

  function handleCreate() {
    const tzLabel =
      TIMEZONE_OPTIONS.find((t) => t.value === timezone)?.label ?? timezone;
    onCreate?.({
      name: name.trim() || "New employee",
      agent,
      campaign,
      workWindow: `${start}-${end} ${tzLabel.replace(/.*\(([^)]+)\).*/, "$1")}`,
      timezone,
      dailyCap: DAILY_CAP,
      callsToday: 0,
      answered: 0,
      eligible: 0,
      status: "Idle",
    });
    setName("");
    onClose();
  }

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title="New employee"
      subtitle="A calling worker with one assigned agent and campaign."
      headerExtra={
        <div className="border-t border-pink-100/80 bg-gradient-to-r from-pink-50 via-rose-50/80 to-orange-50 px-5 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 text-[12px] font-medium text-pink-800">
            <Headset className="h-3.5 w-3.5 text-pink-600" />
            Each employee dials up to {DAILY_CAP} leads/day during their shift
          </div>
        </div>
      }
    >
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
            <div className="space-y-4 p-5">
              <FormField label="Employee name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Employee 1"
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Assigned agent"
                hint="The voice the employee uses on every call."
              >
                <CustomSelect
                  value={agent}
                  onChange={setAgent}
                  options={AGENT_OPTIONS}
                />
              </FormField>

              <FormField
                label="Assigned campaign"
                hint="The lead pool this employee dials from."
              >
                <CustomSelect
                  value={campaign}
                  onChange={setCampaign}
                  options={CAMPAIGN_OPTIONS}
                />
              </FormField>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Shift start">
                  <input
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Shift end">
                  <input
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className={inputClass}
                  />
                </FormField>
              </div>
              <FormField
                label="Timezone"
                hint="The employee only dials inside this daily window."
              >
                <CustomSelect
                  value={timezone}
                  onChange={setTimezone}
                  options={TIMEZONE_OPTIONS}
                />
              </FormField>

              <div className="flex items-center justify-between rounded-xl border border-border bg-surface-subtle px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Gauge className="h-4 w-4 text-pink-600" />
                  <span className="text-[13px] font-medium text-ink">
                    Daily call limit
                  </span>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[13px] font-bold tabular-nums text-ink shadow-sm">
                  {DAILY_CAP} calls
                </span>
              </div>
            </div>
          </section>

          <div className="flex items-start gap-3 rounded-2xl border border-pink-200/70 bg-gradient-to-br from-pink-50 to-rose-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-pink-600 shadow-sm">
              <Megaphone className="h-4 w-4" />
            </div>
            <p className="text-[12.5px] leading-relaxed text-ink-muted">
              To finish a campaign faster, add more employees to it. A{" "}
              <span className="font-semibold text-ink">10,000-lead</span> campaign
              needs <span className="font-semibold text-ink">20 employees</span> to
              clear in a single day ({DAILY_CAP} calls each).
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-surface-subtle p-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="w-full" onClick={onClose}>
              Cancel
            </Button>
            <Button color="brand" className="w-full gap-2" onClick={handleCreate}>
              <Bot className="h-4 w-4" />
              Create employee
            </Button>
          </div>
        </div>
      </div>
    </SlidePanel>
  );
}
