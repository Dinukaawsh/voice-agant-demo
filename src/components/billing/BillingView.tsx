"use client";

import {
  Clock,
  Download,
  Phone,
  PhoneCall,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricStatCard, MetricStatGrid } from "@/components/ui/MetricStatCard";
import { cn } from "@/lib/cn";

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
  { label: "Calls placed", value: "1,847", icon: PhoneCall, tone: "blue" as const },
  { label: "Talk minutes", value: "5,410", icon: Clock, tone: "violet" as const },
  { label: "Eligible leads", value: "412", icon: Target, tone: "emerald" as const },
];

const INVOICES = [
  { id: "INV-2026-007", period: "June 2026", amount: "$4,218.40", status: "Paid" },
  { id: "INV-2026-006", period: "May 2026", amount: "$3,892.10", status: "Paid" },
  { id: "INV-2026-005", period: "April 2026", amount: "$3,104.55", status: "Paid" },
];

const INVOICE_ROW_GRID =
  "lg:grid-cols-[minmax(140px,1fr)_minmax(100px,0.8fr)_minmax(90px,0.7fr)_80px_100px]";

function buildCostChartPath(
  data: typeof DAILY_COSTS,
  height: number,
  width: number,
  valueKey: "amount" = "amount",
) {
  const max = Math.max(...data.map((d) => d[valueKey]));
  const step = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - (d[valueKey] / max) * (height - 20) - 10;
    return { x, y };
  });

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  return { line, area, points, max };
}

export function BillingView() {
  const peakDay = DAILY_COSTS.reduce((best, d) => (d.amount > best.amount ? d : best), DAILY_COSTS[0]);
  const chart = buildCostChartPath(DAILY_COSTS, 160, 400);
  const runwayDays = Math.floor(BALANCE / AVG_DAILY);

  const statCards = [
    {
      label: "Account balance",
      value: `$${BALANCE.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      sub: `~${runwayDays} days of calling left`,
      icon: Wallet,
      tone: "emerald" as const,
      glow: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    {
      label: "Spent this month",
      value: "$1,027.90",
      sub: "Projected $3,840 end of month",
      icon: TrendingUp,
      tone: "orange" as const,
      glow: "bg-orange-500/10",
      ring: "ring-orange-500/20",
    },
    {
      label: "Cost per call",
      value: "$0.56",
      sub: "−$0.04 vs last month",
      icon: Phone,
      tone: "blue" as const,
      glow: "bg-blue-500/10",
      ring: "ring-blue-500/20",
      badge: (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
          <TrendingDown className="h-2.5 w-2.5" />
          −7%
        </span>
      ),
    },
    {
      label: "Cost per eligible lead",
      value: "$2.49",
      sub: "−12% vs last month",
      icon: Target,
      tone: "violet" as const,
      glow: "bg-violet-500/10",
      ring: "ring-violet-500/20",
      badge: (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
          <TrendingDown className="h-2.5 w-2.5" />
          −12%
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-up space-y-6 p-5 lg:p-8">
      <MetricStatGrid>
        {statCards.map((stat) => (
          <MetricStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            sub={stat.sub}
            icon={stat.icon}
            tone={stat.tone}
            ring={stat.ring}
            glow={stat.glow}
            badge={stat.badge}
          />
        ))}
      </MetricStatGrid>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-ink-muted">
          Current billing period:{" "}
          <span className="font-semibold text-ink">July 1–31, 2026</span>
          <span className="text-ink-hint"> · Avg ${AVG_DAILY.toFixed(0)}/day</span>
        </p>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="secondary">
            <Plus className="h-4 w-4" />
            Add funds
          </Button>
          <Button color="brand">
            <Download className="h-4 w-4" />
            Export report
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="overflow-hidden p-0 lg:col-span-3">
          <div className="flex flex-col gap-3 border-b border-border bg-gradient-to-r from-amber-50/50 via-white to-violet-50/30 px-5 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-6">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Cost trend</h2>
              <p className="text-[13px] text-ink-muted">Daily spend this week</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-surface-subtle px-3 py-1.5 text-[12px] font-medium text-ink-muted">
              <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
              Peak: {peakDay.day} · ${peakDay.amount.toFixed(0)}
            </div>
          </div>
          <div className="px-5 py-5 sm:px-6">
            <div className="relative">
              <div className="relative mb-2 h-44 w-full">
                <svg
                  viewBox="0 0 400 160"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="billingChartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="billingChartLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  {[40, 80, 120].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="400"
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                  ))}
                  <path d={chart.area} fill="url(#billingChartFill)" />
                  <path
                    d={chart.line}
                    fill="none"
                    stroke="url(#billingChartLine)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  {chart.points.map((p, i) => (
                    <span
                      key={DAILY_COSTS[i].day}
                      className="absolute box-border h-2 w-2 rounded-full border-2 border-amber-500 bg-white"
                      style={{
                        left: `${(p.x / 400) * 100}%`,
                        top: `${(p.y / 160) * 100}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between px-1">
                {DAILY_COSTS.map((d) => (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[11px] font-medium tabular-nums text-ink-muted">
                      ${d.amount.toFixed(0)}
                    </span>
                    <span className="text-[10px] text-ink-hint">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="border-b border-border bg-gradient-to-r from-amber-50/50 via-white to-violet-50/30 px-5 py-3 sm:px-6">
            <h2 className="text-[15px] font-semibold text-ink">Usage summary</h2>
            <p className="text-[13px] text-ink-muted">What you used this period</p>
          </div>
          <div className="space-y-2 p-5 sm:p-6">
            {USAGE.map((u) => {
              const Icon = u.icon;
              return (
                <div
                  key={u.label}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-surface-subtle/60 px-4 py-3"
                >
                  <span className="flex items-center gap-2.5 text-[13px] font-medium text-ink">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border-2",
                        u.tone === "blue" && "border-blue-600 bg-blue-200 text-blue-600",
                        u.tone === "violet" && "border-violet-600 bg-violet-200 text-violet-600",
                        u.tone === "emerald" && "border-emerald-600 bg-emerald-200 text-emerald-600",
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.25} />
                    </span>
                    {u.label}
                  </span>
                  <span className="text-[15px] font-bold tabular-nums text-ink">{u.value}</span>
                </div>
              );
            })}
            <p className="pt-1 text-[12px] text-ink-hint">
              Billing reflects total usage across all campaigns and agents.
            </p>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-1 border-b border-border bg-gradient-to-r from-amber-50/50 via-white to-violet-50/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Invoices</h2>
            <p className="text-[13px] text-ink-muted">Billing history</p>
          </div>
        </div>

        <div
          className={cn(
            "hidden border-b border-border bg-surface-subtle/40 px-5 py-3 lg:grid lg:items-center lg:gap-3",
            INVOICE_ROW_GRID,
          )}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Invoice</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Period</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Amount</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Status</span>
          <span className="text-right text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Actions</span>
        </div>

        <div className="divide-y divide-border/60">
          {INVOICES.map((inv) => (
            <div
              key={inv.id}
              className={cn(
                "group px-4 py-4 transition-colors hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-transparent sm:px-5 lg:grid lg:items-center lg:gap-3",
                INVOICE_ROW_GRID,
              )}
            >
              <p className="font-mono text-[13px] font-semibold text-ink">
                <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">
                  Invoice ·
                </span>
                {inv.id}
              </p>
              <p className="text-[13px] text-ink-muted">
                <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">
                  Period ·
                </span>
                {inv.period}
              </p>
              <p className="font-semibold tabular-nums text-ink">
                <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">
                  Amount ·
                </span>
                {inv.amount}
              </p>
              <div>
                <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">
                  Status ·
                </span>
                <Badge variant="green">{inv.status}</Badge>
              </div>
              <p className="text-right lg:block">
                <button
                  type="button"
                  className="text-[13px] font-semibold text-[#3c0382] transition-opacity hover:opacity-70"
                >
                  Download PDF
                </button>
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
