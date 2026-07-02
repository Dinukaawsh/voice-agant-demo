import { Plus, Upload, Filter, Search, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const LEADS = [
  {
    name: "Marie Dupont",
    phone: "+33 6 12 34 56 78",
    list: "Health FR — July",
    status: "Qualified",
    lastCall: "Today, 14:32",
    attempts: 1,
  },
  {
    name: "Jean Martin",
    phone: "+33 6 98 76 54 32",
    list: "Health FR — July",
    status: "No answer",
    lastCall: "Today, 13:58",
    attempts: 3,
  },
  {
    name: "Sophie Bernard",
    phone: "+33 7 11 22 33 44",
    list: "Solar EN — Q3",
    status: "Callback",
    lastCall: "Today, 12:15",
    attempts: 2,
  },
  {
    name: "Pierre Leroy",
    phone: "+33 6 55 44 33 22",
    list: "Health FR — July",
    status: "Qualified",
    lastCall: "Yesterday",
    attempts: 1,
  },
  {
    name: "Claire Moreau",
    phone: "+33 6 77 88 99 00",
    list: "Health FR — July",
    status: "Not called",
    lastCall: "—",
    attempts: 0,
  },
  {
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

export default function LeadsPage() {
  return (
    <div className="animate-fade-up p-5 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                i === 0
                  ? "bg-accent text-white"
                  : "border border-border bg-white text-ink-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink-muted shadow-sm hover:text-ink"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-medium text-white shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add lead
          </button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="text-[13px] text-ink-muted">
            <span className="font-semibold text-ink">6,950</span> leads total
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted/50 px-3 py-1.5 text-ink-hint">
              <Search className="h-3.5 w-3.5" />
              <span className="text-[13px]">Search leads…</span>
            </div>
            <button
              type="button"
              className="rounded-lg border border-border p-2 text-ink-muted hover:text-ink"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/30 text-[12px] font-semibold uppercase tracking-wide text-ink-hint">
                <th className="px-5 py-3">
                  <input type="checkbox" className="rounded accent-accent" />
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
              {LEADS.map((lead) => (
                <tr
                  key={lead.phone}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-muted/40"
                >
                  <td className="px-5 py-3.5">
                    <input type="checkbox" className="rounded accent-accent" />
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
                  <td className="px-3 py-3.5 text-ink-muted">{lead.attempts}</td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      className="rounded-lg p-1 text-ink-hint hover:bg-surface-muted hover:text-ink"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[13px] text-ink-muted">
          <span>Showing 1–6 of 6,950</span>
          <div className="flex gap-1">
            {["←", "1", "2", "3", "…", "→"].map((p) => (
              <button
                key={p}
                type="button"
                className={`min-w-[32px] rounded-lg px-2 py-1 ${
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
  );
}
