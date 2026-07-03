"use client";

import { useState } from "react";
import { Check, Headset, Megaphone, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const LEAD_LISTS = [
  { name: "Health FR - July list", count: 4200 },
  { name: "Solar EN - Q3 prospects", count: 2800 },
  { name: "Insurance ES pilot batch", count: 950 },
  { name: "Mutuelle FR - August list", count: 10000 },
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

export type NewCampaign = {
  name: string;
  agent: string;
  status: string;
  leads: number;
  dialed: number;
  answered: number;
  qualified: number;
  schedule: string;
  employees: number;
};

export function CampaignCreationWizard({
  onClose,
  onComplete,
}: {
  onClose?: () => void;
  onComplete?: (campaign: NewCampaign) => void;
}) {
  const [name, setName] = useState("");
  const [selectedList, setSelectedList] = useState(LEAD_LISTS[0].name);

  const leadCount =
    LEAD_LISTS.find((l) => l.name === selectedList)?.count ?? 0;
  const employeesNeeded = Math.max(1, Math.ceil(leadCount / 500));

  function handleCreate() {
    onComplete?.({
      name: name.trim() || "Untitled campaign",
      agent: "-",
      status: "Draft",
      leads: leadCount,
      dialed: 0,
      answered: 0,
      qualified: 0,
      schedule: "Add employees to start",
      employees: 0,
    });
    onClose?.();
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-rose-500" />
          <div className="space-y-4 p-5">
            <FormField label="Campaign name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Health FR - August outbound"
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Leads to call"
              hint="Pick the list of leads this campaign will dial."
            >
              <div className="space-y-2">
                {LEAD_LISTS.map((list) => {
                  const selected = selectedList === list.name;
                  return (
                    <button
                      key={list.name}
                      type="button"
                      onClick={() => setSelectedList(list.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all",
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
            </FormField>
          </div>
        </section>

        {/* Capacity helper */}
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
          <div className="grid grid-cols-2 gap-3 p-5">
            <div className="rounded-xl border border-border bg-surface-subtle px-4 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-hint">
                <Users className="h-3.5 w-3.5" /> Total leads
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-ink">
                {leadCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-pink-200/70 bg-pink-50/60 px-4 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-pink-700">
                <Headset className="h-3.5 w-3.5" /> To finish in 1 day
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-ink">
                {employeesNeeded} {employeesNeeded === 1 ? "employee" : "employees"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50 to-rose-50 p-4">
          <Badge variant="amber">Next step</Badge>
          <p className="text-[13px] leading-relaxed text-ink-muted">
            The campaign is created empty. Assign{" "}
            <span className="font-semibold text-ink">employees</span> to it. Each one
            brings their own agent and dials up to 500 leads a day, and calling
            starts automatically during their shift.
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-surface-subtle p-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full" onClick={() => onClose?.()}>
            Cancel
          </Button>
          <Button color="brand" className="w-full gap-2" onClick={handleCreate}>
            <Megaphone className="h-4 w-4" />
            Create campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
