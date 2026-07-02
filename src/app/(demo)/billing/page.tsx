import {
  DollarSign,
  TrendingDown,
  Phone,
  Mic,
  Server,
  Download,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const DAILY_COSTS = [
  { day: "Mon", amount: 142.5 },
  { day: "Tue", amount: 168.2 },
  { day: "Wed", amount: 155.8 },
  { day: "Thu", amount: 189.4 },
  { day: "Fri", amount: 201.1 },
  { day: "Sat", amount: 98.6 },
  { day: "Sun", amount: 72.3 },
];

const BREAKDOWN = [
  { provider: "Telephony (Twilio)", amount: 412.8, pct: 38, icon: Phone },
  { provider: "Speech-to-text", amount: 218.4, pct: 20, icon: Mic },
  { provider: "Text-to-speech", amount: 186.2, pct: 17, icon: Server },
  { provider: "LLM inference", amount: 164.5, pct: 15, icon: Server },
  { provider: "Infrastructure", amount: 108.9, pct: 10, icon: Server },
];

const INVOICES = [
  { id: "INV-2026-007", period: "June 2026", amount: "$4,218.40", status: "Paid" },
  { id: "INV-2026-006", period: "May 2026", amount: "$3,892.10", status: "Paid" },
  { id: "INV-2026-005", period: "April 2026", amount: "$3,104.55", status: "Paid" },
];

export default function BillingPage() {
  const maxCost = Math.max(...DAILY_COSTS.map((d) => d.amount));

  return (
    <div className="animate-fade-up space-y-6 p-5 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-ink-muted">
          Cost analyser · Current billing period: July 1–31, 2026
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink-muted shadow-sm hover:text-ink"
        >
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Month to date"
          value="$1,027.90"
          change="Projected $3,840 end of month"
          icon={DollarSign}
          trend="neutral"
        />
        <StatCard
          label="Cost per call"
          value="$0.56"
          change="−$0.04 vs last month"
          icon={Phone}
          trend="up"
        />
        <StatCard
          label="Cost per qualified lead"
          value="$2.49"
          change="−12% vs last month"
          icon={TrendingDown}
          trend="up"
        />
        <StatCard
          label="Total calls (MTD)"
          value="1,847"
          icon={Phone}
          trend="neutral"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardTitle subtitle="Daily spend this week">Cost trend</CardTitle>
          <div className="flex h-52 items-end justify-between gap-3 px-1">
            {DAILY_COSTS.map((d) => (
              <div
                key={d.day}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <span className="text-[11px] font-medium text-ink-muted">
                  ${d.amount.toFixed(0)}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-accent to-accent/70 transition-all hover:from-accent hover:to-accent/70"
                  style={{ height: `${(d.amount / maxCost) * 100}%` }}
                />
                <span className="text-[10px] text-ink-hint">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle subtitle="By service provider">Cost breakdown</CardTitle>
          <div className="space-y-4">
            {BREAKDOWN.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.provider}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
                      <Icon className="h-3.5 w-3.5 text-ink-hint" />
                      {item.provider}
                    </span>
                    <span className="text-[13px] font-semibold text-ink">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-accent/80"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle subtitle="Billing history">Invoices</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-border text-[12px] font-semibold uppercase tracking-wide text-ink-hint">
                <th className="pb-3 pr-4">Invoice</th>
                <th className="pb-3 pr-4">Period</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-border/60 last:border-0 hover:bg-surface-muted/40"
                >
                  <td className="py-3.5 pr-4 font-mono text-[13px] font-medium text-ink">
                    {inv.id}
                  </td>
                  <td className="py-3.5 pr-4 text-ink-muted">{inv.period}</td>
                  <td className="py-3.5 pr-4 font-semibold text-ink">
                    {inv.amount}
                  </td>
                  <td className="py-3.5 pr-4">
                    <Badge variant="green">{inv.status}</Badge>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      className="text-[13px] font-medium text-accent hover:underline"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
