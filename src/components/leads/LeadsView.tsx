"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Upload,
  Filter,
  Search,
  MoreHorizontal,
  Megaphone,
  Download,
  CircleDot,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CustomDropdown, DropdownItem } from "@/components/ui/CustomDropdown";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { BulkSelectionActionBar } from "@/components/ui/BulkSelectionActionBar";

const TOTAL_LEADS = 6950;

const LEAD_METRICS = [
  { key: "total", label: "Total", value: 6950, color: "text-ink", bg: "bg-surface" },
  { key: "pending", label: "Pending", value: 2104, color: "text-slate-600", bg: "bg-slate-50" },
  { key: "eligible", label: "Eligible", value: 892, color: "text-emerald-700", bg: "bg-emerald-50" },
  { key: "in_progress", label: "In progress", value: 156, color: "text-blue-700", bg: "bg-blue-50" },
  { key: "calling", label: "Calling", value: 24, color: "text-indigo-700", bg: "bg-indigo-50" },
  { key: "no_answer", label: "No answer", value: 1842, color: "text-amber-700", bg: "bg-amber-50" },
  { key: "qualified", label: "Qualified", value: 412, color: "text-green", bg: "bg-green-soft" },
  { key: "callback", label: "Callback", value: 89, color: "text-violet-700", bg: "bg-violet-50" },
  { key: "failed", label: "Failed", value: 31, color: "text-red-700", bg: "bg-red-50" },
];

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  list: string;
  status: string;
  lastCall: string;
  attempts: number;
};

const LEADS: LeadRow[] = [
  {
    id: "1",
    name: "Marie Dupont",
    phone: "+33 612 345 678",
    list: "Health FR - July",
    status: "Qualified",
    lastCall: "Today, 14:32",
    attempts: 1,
  },
  {
    id: "2",
    name: "Jean Martin",
    phone: "+33 698 765 432",
    list: "Health FR - July",
    status: "No answer",
    lastCall: "Today, 13:58",
    attempts: 3,
  },
  {
    id: "3",
    name: "Sophie Bernard",
    phone: "+33 711 223 344",
    list: "Solar EN - Q3",
    status: "Callback",
    lastCall: "Today, 12:15",
    attempts: 2,
  },
  {
    id: "4",
    name: "Pierre Leroy",
    phone: "+33 655 443 322",
    list: "Health FR - July",
    status: "Qualified",
    lastCall: "Yesterday",
    attempts: 1,
  },
  {
    id: "5",
    name: "Claire Moreau",
    phone: "+33 677 889 900",
    list: "Health FR - July",
    status: "Not called",
    lastCall: "-",
    attempts: 0,
  },
  {
    id: "6",
    name: "Antoine Petit",
    phone: "+34 612 345 678",
    list: "Insurance ES",
    status: "In progress",
    lastCall: "Today, 11:40",
    attempts: 1,
  },
];

const STATUS_TABS = ["All", "Qualified", "Callback", "No answer", "Not called"];

function statusVariant(status: string) {
  if (status === "Qualified") return "green" as const;
  if (status === "Callback" || status === "In progress") return "blue" as const;
  if (status === "No answer") return "amber" as const;
  return "default" as const;
}

export function LeadsView() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAllFiltered, setSelectAllFiltered] = useState(false);

  const pageIds = useMemo(() => LEADS.map((l) => l.id), []);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected =
    pageIds.some((id) => selectedIds.has(id)) && !allPageSelected;
  const hasSelection = selectAllFiltered || selectedIds.size > 0;
  const effectiveCount = selectAllFiltered ? TOTAL_LEADS : selectedIds.size;

  function toggleLead(id: string) {
    if (selectAllFiltered) {
      setSelectAllFiltered(false);
      setSelectedIds(new Set(pageIds.filter((pid) => pid !== id)));
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllPage() {
    if (selectAllFiltered || allPageSelected) {
      clearSelection();
      return;
    }
    setSelectedIds(new Set(pageIds));
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setSelectAllFiltered(false);
  }

  function selectAllMatching() {
    setSelectAllFiltered(true);
    setSelectedIds(new Set(pageIds));
  }

  return (
    <>
      <div className="animate-fade-up p-5 pb-24 lg:p-8 lg:pb-28">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-ink-muted">Organization totals</p>
        </div>
        <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
          {LEAD_METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`rounded-xl border border-border px-2 py-3 text-center transition-all hover:border-accent/30 hover:shadow-soft ${m.bg}`}
            >
              <p className={`text-lg font-bold leading-none ${m.color}`}>
                {m.value.toLocaleString()}
              </p>
              <p className="mt-1.5 truncate text-[10px] font-medium text-ink-muted">
                {m.label}
              </p>
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab, i) => (
              <button
                key={tab}
                type="button"
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  i === 0
                    ? "bg-accent text-white shadow-sm shadow-accent/20"
                    : "border border-border bg-surface text-ink-muted hover:border-accent/40 hover:text-accent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button>
              <Plus className="h-4 w-4" />
              Add lead
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-ink-muted">
              <span className="font-semibold text-ink">
                {TOTAL_LEADS.toLocaleString()}
              </span>{" "}
              leads total
            </p>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-surface-subtle px-3 py-2 text-ink-hint sm:flex-none">
                <Search className="h-3.5 w-3.5" />
                <span className="text-[13px]">Search leads…</span>
              </div>
              <button
                type="button"
                className="rounded-lg border border-border p-2 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-[12px] font-semibold uppercase tracking-wide text-ink-hint">
                  <th
                    className="w-12 px-5 py-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CustomCheckbox
                      checked={allPageSelected || selectAllFiltered}
                      indeterminate={somePageSelected && !selectAllFiltered}
                      onCheckedChange={toggleSelectAllPage}
                      aria-label="Select all on this page"
                    />
                  </th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">List</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Last call</th>
                  <th className="px-3 py-3">Attempts</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {LEADS.map((lead) => {
                  const isSelected =
                    selectAllFiltered || selectedIds.has(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      className={`border-b border-border/60 transition-colors last:border-0 hover:bg-accent-soft/30 ${
                        isSelected ? "bg-accent-soft/50" : ""
                      }`}
                    >
                      <td
                        className="w-12 px-5 py-3.5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CustomCheckbox
                          checked={isSelected}
                          onCheckedChange={() => toggleLead(lead.id)}
                          aria-label={`Select ${lead.name}`}
                        />
                      </td>
                      <td className="px-3 py-3.5 font-medium text-ink">
                        {lead.name}
                      </td>
                      <td className="px-3 py-3.5 font-mono text-[13px] text-ink-muted">
                        {lead.phone}
                      </td>
                      <td className="px-3 py-3.5 text-ink-muted">{lead.list}</td>
                      <td className="px-3 py-3.5">
                        <Badge variant={statusVariant(lead.status)}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3.5 text-ink-muted">
                        {lead.lastCall}
                      </td>
                      <td className="px-3 py-3.5 text-ink-muted">
                        {lead.attempts}
                      </td>
                      <td className="px-5 py-3.5">
                        <CustomDropdown
                          align="right"
                          menuWidth={180}
                          trigger={
                            <button
                              type="button"
                              className="rounded-lg p-1.5 text-ink-hint hover:bg-surface-muted hover:text-ink"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          }
                        >
                          <DropdownItem>View details</DropdownItem>
                          <DropdownItem>Call now</DropdownItem>
                          <DropdownItem>Change status</DropdownItem>
                          <DropdownItem danger>Delete</DropdownItem>
                        </CustomDropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[13px] text-ink-muted">
            <span>
              Showing 1–{LEADS.length} of {TOTAL_LEADS.toLocaleString()}
            </span>
            <div className="flex gap-1">
              {["←", "1", "2", "3", "…", "→"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`min-w-[32px] rounded-lg px-2 py-1 transition-colors ${
                    p === "1"
                      ? "bg-accent text-white"
                      : "hover:bg-surface-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <BulkSelectionActionBar
        open={hasSelection}
        ariaLabel="Lead selection actions"
        selectedLabel={
          selectAllFiltered
            ? `All ${effectiveCount.toLocaleString()} matching leads selected`
            : `${selectedIds.size} lead${selectedIds.size !== 1 ? "s" : ""} selected`
        }
        onClear={clearSelection}
        actions={[
          {
            id: "create-campaign",
            label: "Create Campaign",
            icon: <Megaphone className="h-3.5 w-3.5 shrink-0" />,
            onClick: () => undefined,
            variant: "primary",
          },
          {
            id: "export",
            label: "Export CSV",
            icon: <Download className="h-3.5 w-3.5 shrink-0" />,
            onClick: () => undefined,
            variant: "secondary",
          },
          {
            id: "status",
            label: "Update Status",
            icon: <CircleDot className="h-3.5 w-3.5 shrink-0" />,
            onClick: () => undefined,
            variant: "white",
          },
          {
            id: "delete",
            label: "Delete",
            icon: <Trash2 className="h-3.5 w-3.5 shrink-0" />,
            onClick: () => undefined,
            variant: "danger",
          },
        ]}
        footer={
          !selectAllFiltered &&
          allPageSelected &&
          TOTAL_LEADS > LEADS.length ? (
            <div className="border-t border-blue-400/20 bg-blue-500/10 px-3 py-2 text-center sm:px-4">
              <span className="text-xs text-blue-100">
                All {LEADS.length} leads on this page are selected.{" "}
                <button
                  type="button"
                  onClick={selectAllMatching}
                  className="font-semibold text-white underline underline-offset-2 transition-colors hover:text-blue-50"
                >
                  Select all {TOTAL_LEADS.toLocaleString()} matching leads
                </button>
              </span>
            </div>
          ) : null
        }
      />
    </>
  );
}
