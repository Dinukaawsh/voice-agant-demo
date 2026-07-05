import {
  Clock,
  Download,
  Phone,
  PhoneCall,
  Plus,
  Target,
  TrendingDown,
  Users,
  Wallet,
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

const BALANCE = 1240.6;
const AVG_DAILY = 161.3;

const USAGE = [
  { label: "Calls placed", value: "1,847", icon: PhoneCall },
  { label: "Talk minutes", value: "5,410", icon: Clock },
  { label: "Eligible leads", value: "412", icon: Target },
];

const INVOICES = [
  { id: "INV-2026-007", period: "June 2026", amount: "$4,218.40", status: "Paid" },
  { id: "INV-2026-006", period: "May 2026", amount: "$3,892.10", status: "Paid" },
  { id: "INV-2026-005", period: "April 2026", amount: "$3,104.55", status: "Paid" },
];

export default function BillingPage() {
  const maxCost = Math.max(...DAILY_COSTS.map((d) => d.amount));
  const runwayDays = Math.floor(BALANCE / AVG_DAILY);

  return (
    <div className="animate-fade-up space-y-6 p-5 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-ink-muted">
          Cost analyser · Current billing period: July 1-31, 2026
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink-muted shadow-sm hover:text-ink"
        >
          <Download className="h-4 w-4" />
          Export report
        </button>
      </div>

      {/* Balance / billing */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-3 py-1 text-[12px] font-medium text-emerald-700">
              <Wallet className="h-3.5 w-3.5" />
              Account balance
            </div>
            <p className="text-4xl font-bold tracking-tight text-ink">
              ${BALANCE.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="mt-2 text-[13px] text-ink-muted">
              About <span className="font-semibold text-ink">{runwayDays} days</span> of
              calling left at your current pace (~${AVG_DAILY.toFixed(0)}/day).
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Add funds
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-[13.5px] font-semibold text-ink shadow-sm hover:bg-surface-subtle"
            >
              Auto top-up
            </button>
          </div>
        </div>
      </div>

      {/* Client-facing unit costs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Cost per call"
          value="$0.56"
          change="−$0.04 vs last month"
          icon={Phone}
          trend="up"
        />
        <StatCard
          label="Cost per eligible lead"
          value="$2.49"
          change="−12% vs last month"
          icon={TrendingDown}
          trend="up"
        />
        <StatCard
          label="Cost per minute"
          value="$0.19"
          change="−$0.01 vs last month"
          icon={Clock}
          trend="up"
        />
        <StatCard
          label="Spent this month"
          value="$1,027.90"
          change="Projected $3,840 end of month"
          icon={Wallet}
          trend="neutral"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardTitle subtitle="Daily spend this week">Cost trend</CardTitle>
          <div className="flex items-end justify-between gap-3 px-1">
            {DAILY_COSTS.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-medium text-ink-muted">
                  ${d.amount.toFixed(0)}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-accent to-accent/70 transition-all"
                  style={{ height: `${Math.round((d.amount / maxCost) * 160)}px` }}
                />
                <span className="text-[10px] text-ink-hint">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle subtitle="What you used this period">Usage summary</CardTitle>
          <div className="space-y-3">
            {USAGE.map((u) => {
              const Icon = u.icon;
              return (
                <div
                  key={u.label}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-subtle px-4 py-3"
                >
                  <span className="flex items-center gap-2.5 text-[13px] font-medium text-ink">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-accent shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    {u.label}
                  </span>
                  <span className="text-[15px] font-bold tabular-nums text-ink">
                    {u.value}
                  </span>
                </div>
              );
            })}
            <p className="flex items-center gap-2 pt-1 text-[12px] text-ink-hint">
              <Users className="h-3.5 w-3.5" />
              Billing reflects total usage. No per-service breakdown.
            </p>
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
                  <td className="py-3.5 pr-4 font-semibold text-ink">{inv.amount}</td>
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
