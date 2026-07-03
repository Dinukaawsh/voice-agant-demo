"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  Clock,
  Gauge,
  Headset,
  Megaphone,
  PhoneCall,
  Plus,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricStatCard, MetricStatGrid } from "@/components/ui/MetricStatCard";
import {
  EmployeeCreationModal,
  type NewEmployee,
} from "@/components/employees/EmployeeCreationModal";
import { cn } from "@/lib/cn";

type EmployeeRow = NewEmployee & { id: string };

const INITIAL_EMPLOYEES: EmployeeRow[] = [
  {
    id: "emp-01",
    name: "Employee 1",
    agent: "Health insurance FR - July",
    campaign: "Health FR - July outbound",
    workWindow: "09:00-13:00 CET",
    timezone: "Europe/Paris",
    dailyCap: 500,
    callsToday: 342,
    answered: 88,
    eligible: 14,
    status: "Working",
  },
  {
    id: "emp-02",
    name: "Employee 2",
    agent: "Health insurance FR - July",
    campaign: "Health FR - July outbound",
    workWindow: "09:00-13:00 CET",
    timezone: "Europe/Paris",
    dailyCap: 500,
    callsToday: 318,
    answered: 74,
    eligible: 11,
    status: "Working",
  },
  {
    id: "emp-03",
    name: "Employee 3",
    agent: "Health insurance FR - July",
    campaign: "Health FR - July outbound",
    workWindow: "14:00-18:00 CET",
    timezone: "Europe/Paris",
    dailyCap: 500,
    callsToday: 0,
    answered: 0,
    eligible: 0,
    status: "Off-hours",
  },
  {
    id: "emp-04",
    name: "Employee 4",
    agent: "Solar leads EN - Q3",
    campaign: "Solar EN - Q3 push",
    workWindow: "10:00-17:00 GMT",
    timezone: "Europe/London",
    dailyCap: 500,
    callsToday: 500,
    answered: 121,
    eligible: 38,
    status: "Cap reached",
  },
  {
    id: "emp-05",
    name: "Employee 5",
    agent: "Insurance ES - Pilot",
    campaign: "Insurance ES pilot",
    workWindow: "09:00-14:00 CET",
    timezone: "Europe/Paris",
    dailyCap: 500,
    callsToday: 96,
    answered: 22,
    eligible: 7,
    status: "Paused",
  },
];

function statusStyle(status: string) {
  switch (status) {
    case "Working":
      return { dot: "bg-emerald-500", text: "text-emerald-600", accent: "border-l-emerald-500" };
    case "Cap reached":
      return { dot: "bg-blue-500", text: "text-blue-600", accent: "border-l-blue-500" };
    case "Paused":
      return { dot: "bg-amber-500", text: "text-amber-600", accent: "border-l-amber-500" };
    default:
      return { dot: "bg-slate-300", text: "text-ink-hint", accent: "border-l-slate-300" };
  }
}

function initials(name: string) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function PerfMetric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 text-center">
      <p className={cn("truncate tabular-nums text-[13px] font-semibold leading-tight text-ink", valueClassName)}>
        {value}
      </p>
      <p className="mt-0.5 truncate text-[9.5px] font-medium uppercase tracking-wide text-ink-hint">
        {label}
      </p>
    </div>
  );
}

function EmployeeCard({ e }: { e: EmployeeRow }) {
  const s = statusStyle(e.status);
  const pct = Math.min(Math.round((e.callsToday / e.dailyCap) * 100), 100);
  const notAnswered = Math.max(e.callsToday - e.answered, 0);
  const answerRate = e.callsToday > 0 ? (e.answered / e.callsToday) * 100 : 0;
  const convRate = e.answered > 0 ? (e.eligible / e.answered) * 100 : 0;
  const hasCalls = e.callsToday > 0;

  return (
    <div
      className={cn(
        "group rounded-2xl border border-border border-l-[3px] bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card",
        s.accent,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-[13px] font-bold text-white shadow-sm ring-2 ring-white/40">
          {initials(e.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-ink">{e.name}</p>
          <span className="mt-0.5 inline-flex items-center gap-1.5 text-[11.5px]">
            <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
            <span className={cn("font-medium", s.text)}>{e.status}</span>
          </span>
        </div>
      </div>

      <div className="mt-3.5 space-y-1.5 text-[12px] text-ink-muted">
        <p className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 shrink-0 text-violet-500" />
          <span className="truncate">{e.agent}</span>
        </p>
        <p className="flex items-center gap-2">
          <Megaphone className="h-3.5 w-3.5 shrink-0 text-orange-500" />
          <span className="truncate">{e.campaign}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0 text-blue-500" />
          <span className="truncate">{e.workWindow}</span>
        </p>
      </div>

      <div className="mt-3.5">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="font-medium text-ink-muted">Calls today</span>
          <span className="font-semibold tabular-nums text-ink">
            {e.callsToday}
            <span className="text-ink-hint"> / {e.dailyCap}</span>
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-all",
              e.status === "Cap reached"
                ? "from-blue-500 to-indigo-500"
                : "from-pink-500 to-rose-500",
            )}
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-5 gap-1 rounded-xl border border-border/70 bg-surface-subtle/60 px-1.5 py-2.5">
        <PerfMetric label="Ans" value={hasCalls ? String(e.answered) : "-"} valueClassName="text-emerald-600" />
        <PerfMetric label="No ans" value={hasCalls ? String(notAnswered) : "-"} valueClassName="text-rose-600" />
        <PerfMetric label="Ans %" value={hasCalls ? `${answerRate.toFixed(0)}%` : "-"} valueClassName="text-blue-600" />
        <PerfMetric label="Conv %" value={hasCalls ? `${convRate.toFixed(1)}%` : "-"} valueClassName="text-violet-600" />
        <PerfMetric label="Elig" value={hasCalls ? String(e.eligible) : "-"} valueClassName="text-pink-600" />
      </div>
    </div>
  );
}

export function EmployeesView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [employees, setEmployees] = useState<EmployeeRow[]>(INITIAL_EMPLOYEES);

  const metrics = useMemo(() => {
    const working = employees.filter((e) => e.status === "Working").length;
    const callsToday = employees.reduce((s, e) => s + e.callsToday, 0);
    const capacity = employees.reduce((s, e) => s + e.dailyCap, 0);
    return { total: employees.length, working, callsToday, capacity };
  }, [employees]);

  function handleCreate(employee: NewEmployee) {
    setEmployees((prev) => [{ id: crypto.randomUUID(), ...employee }, ...prev]);
  }

  const statCards = [
    {
      label: "Employees",
      value: String(metrics.total),
      sub: "On your team",
      icon: Headset,
      tone: "rose" as const,
      glow: "bg-rose-500/10",
      ring: "ring-rose-500/20",
    },
    {
      label: "Working now",
      value: String(metrics.working),
      sub: "Currently dialing",
      icon: Users,
      tone: "emerald" as const,
      glow: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    {
      label: "Calls today",
      value: metrics.callsToday.toLocaleString(),
      sub: "Across all employees",
      icon: PhoneCall,
      tone: "blue" as const,
      glow: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      label: "Daily capacity",
      value: metrics.capacity.toLocaleString(),
      sub: `${metrics.total} × 500 calls/day`,
      icon: Gauge,
      tone: "violet" as const,
      glow: "bg-violet-500/10",
      ring: "ring-violet-500/20",
    },
  ];

  return (
    <>
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
            />
          ))}
        </MetricStatGrid>

        <Card className="flex flex-col gap-3 border-pink-100/80 bg-gradient-to-r from-pink-50/60 via-white to-orange-50/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
              <Headset className="h-4 w-4" />
            </div>
            <p className="text-[13px] leading-relaxed text-ink-muted">
              Employees do the dialing. Each one works a single campaign with an
              assigned agent and can place up to{" "}
              <span className="font-semibold text-ink">500 calls a day</span>. Need a
              10,000-lead campaign done in a day?{" "}
              <span className="font-semibold text-ink">Add 20 employees.</span>
            </p>
          </div>
          <Button color="brand" className="shrink-0" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New employee
          </Button>
        </Card>

        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {employees.map((e) => (
            <EmployeeCard key={e.id} e={e} />
          ))}
        </div>
      </div>

      <EmployeeCreationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
