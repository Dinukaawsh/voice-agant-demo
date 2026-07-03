"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  ChevronRight,
  Clock,
  Megaphone,
  PhoneCall,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AgentWaveform } from "@/components/agents/AgentWaveform";
import { Badge } from "@/components/ui/Badge";

const STATS = [
  {
    label: "Calls today",
    value: "1,847",
    change: "+12.4%",
    sub: "vs yesterday",
    trend: "up" as const,
    icon: PhoneCall,
    gradient: "from-blue-500 to-indigo-600",
    glow: "bg-blue-500/10",
    ring: "ring-blue-500/20",
  },
  {
    label: "Qualified leads",
    value: "412",
    change: "+8.2%",
    sub: "vs yesterday",
    trend: "up" as const,
    icon: Users,
    gradient: "from-emerald-500 to-teal-600",
    glow: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
  {
    label: "Avg. duration",
    value: "3:48",
    change: "−6s",
    sub: "vs last week",
    trend: "neutral" as const,
    icon: Clock,
    gradient: "from-violet-500 to-purple-600",
    glow: "bg-violet-500/10",
    ring: "ring-violet-500/20",
  },
  {
    label: "Live agents",
    value: "2",
    change: "4 total",
    sub: "2 in testing",
    trend: "neutral" as const,
    icon: Bot,
    gradient: "from-orange-500 to-rose-500",
    glow: "bg-orange-500/10",
    ring: "ring-orange-500/20",
  },
];

const CALL_VOLUME = [
  { day: "Mon", calls: 840 },
  { day: "Tue", calls: 1160 },
  { day: "Wed", calls: 1020 },
  { day: "Thu", calls: 1440 },
  { day: "Fri", calls: 1300 },
  { day: "Sat", calls: 1760 },
  { day: "Sun", calls: 1520 },
];

const LIVE_AGENTS = [
  {
    name: "Health insurance FR - July",
    status: "Live",
    avatar: "/agents/agent-health.png",
    wave: "cyan" as const,
  },
  {
    name: "Solar leads EN - Q3",
    status: "Live",
    avatar: "/agents/agent-solar.png",
    wave: "cyan" as const,
  },
  {
    name: "Insurance ES - Pilot",
    status: "Testing",
    avatar: "/agents/agent-insurance.png",
    wave: "purple" as const,
  },
];

const CAMPAIGNS = [
  {
    name: "Health FR - July",
    pct: 68,
    calls: 1240,
    qualified: 312,
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Solar EN - Q3",
    pct: 34,
    calls: 580,
    qualified: 89,
    color: "from-orange-500 to-rose-500",
  },
  {
    name: "Insurance ES",
    pct: 12,
    calls: 210,
    qualified: 24,
    color: "from-emerald-500 to-teal-500",
  },
];

const RECENT_CALLS = [
  {
    lead: "Marie Dupont",
    agent: "Health FR - July",
    status: "Qualified",
    duration: "4:32",
    time: "12 min ago",
    initials: "MD",
    avatarBg: "from-blue-500 to-indigo-600",
  },
  {
    lead: "Jean Martin",
    agent: "Health FR - July",
    status: "No answer",
    duration: "—",
    time: "28 min ago",
    initials: "JM",
    avatarBg: "from-slate-400 to-slate-600",
  },
  {
    lead: "Sophie Bernard",
    agent: "Solar EN - Q3",
    status: "Callback",
    duration: "2:18",
    time: "1 hr ago",
    initials: "SB",
    avatarBg: "from-orange-500 to-rose-500",
  },
  {
    lead: "Pierre Leroy",
    agent: "Health FR - July",
    status: "Qualified",
    duration: "5:01",
    time: "2 hr ago",
    initials: "PL",
    avatarBg: "from-violet-500 to-purple-600",
  },
];

function statusBadge(status: string) {
  if (status === "Qualified") return "green" as const;
  if (status === "Callback") return "blue" as const;
  return "default" as const;
}

function buildAreaPath(data: typeof CALL_VOLUME, height: number, width: number) {
  const max = Math.max(...data.map((d) => d.calls));
  const step = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - (d.calls / max) * (height - 20) - 10;
    return { x, y };
  });

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  return { line, area, points };
}

export function DashboardView() {
  const maxCalls = Math.max(...CALL_VOLUME.map((d) => d.calls));
  const chart = buildAreaPath(CALL_VOLUME, 160, 400);
  const conversionRate = Math.round((412 / 1847) * 100);

  return (
    <div className="animate-fade-up space-y-6 p-5 lg:p-8">
      {/* Hero */}
      <section className="dashboard-hero relative overflow-hidden rounded-2xl border border-blue-100/80 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-violet-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-3 py-1 text-[12px] font-medium text-blue-700 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="dashboard-live-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Platform live · 2 agents on calls
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Good morning, Demo Admin
            </h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-ink-muted">
              Your voice agents placed{" "}
              <span className="font-semibold text-ink">1,847 calls</span> today with a{" "}
              <span className="font-semibold text-emerald-600">{conversionRate}% qualification rate</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-[1.02]"
            >
              <Megaphone className="h-4 w-4" />
              View campaigns
            </Link>
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/80 px-4 py-2.5 text-[13px] font-semibold text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            >
              <Bot className="h-4 w-4 text-violet-600" />
              Manage agents
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`dashboard-stat-card group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-soft ring-1 ${stat.ring} transition-all hover:-translate-y-0.5 hover:shadow-card`}
            >
              <div className={`dashboard-stat-glow ${stat.glow}`} />
              <div className="relative">
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-md`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
                  </div>
                  {stat.trend === "up" && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-[12px] font-medium uppercase tracking-wide text-ink-hint">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-ink">
                  {stat.value}
                </p>
                <p className="mt-1 text-[12px] text-ink-muted">
                  {stat.trend === "up" ? stat.sub : (
                    <>
                      <span className="font-medium text-ink-muted">{stat.change}</span> · {stat.sub}
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Live agents */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft lg:col-span-8 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-semibold text-ink">Call volume</h3>
                <Badge variant="green">
                  <TrendingUp className="mr-1 inline h-3 w-3" />
                  +18% qualified
                </Badge>
              </div>
              <p className="mt-0.5 text-[13px] text-ink-muted">Last 7 days outbound activity</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-surface-subtle px-3 py-1.5 text-[12px] font-medium text-ink-muted">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Peak: Sat · 1,760 calls
            </div>
          </div>

          <div className="relative">
            <svg
              viewBox="0 0 400 160"
              className="mb-2 h-44 w-full"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#7c3aed" />
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
              <path d={chart.area} fill="url(#chartFill)" />
              <path
                d={chart.line}
                fill="none"
                stroke="url(#chartLine)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {chart.points.map((p, i) => (
                <circle
                  key={CALL_VOLUME[i].day}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="white"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              ))}
            </svg>
            <div className="flex justify-between px-1">
              {CALL_VOLUME.map((d, i) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="dashboard-chart-bar w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400/70 opacity-20"
                    style={{
                      height: `${Math.round((d.calls / maxCalls) * 48)}px`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                  <span className="text-[11px] font-medium text-ink-muted">
                    {d.calls.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-ink-hint">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="agent-panel flex flex-col rounded-2xl p-5 lg:col-span-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-white">Live now</h3>
              <p className="text-[12px] text-indigo-200/70">Real-time agent activity</p>
            </div>
            <Link
              href="/agents"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="flex flex-1 flex-col gap-2">
            {LIVE_AGENTS.map((agent) => (
              <li
                key={agent.name}
                className="agent-row flex items-center gap-3 rounded-xl px-3 py-2.5"
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15">
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-white">
                    {agent.name}
                  </p>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        agent.status === "Live"
                          ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                          : "bg-amber-400"
                      }`}
                    />
                    <span
                      className={
                        agent.status === "Live" ? "text-emerald-300" : "text-amber-300"
                      }
                    >
                      {agent.status}
                    </span>
                  </span>
                </div>
                <AgentWaveform variant={agent.wave} className="w-14" />
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-300" />
              <p className="text-[12px] text-white/80">
                <span className="font-semibold text-white">22.3%</span> qualification rate today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns + Recent calls */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft lg:col-span-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-ink">Campaign progress</h3>
              <p className="text-[13px] text-ink-muted">Outbound campaigns running</p>
            </div>
            <Link
              href="/campaigns"
              className="text-[12px] font-medium text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-5">
            {CAMPAIGNS.map((c) => (
              <div key={c.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-ink">{c.name}</span>
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-bold text-ink">
                    {c.pct}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${c.color} transition-all`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-ink-hint">
                  {c.calls.toLocaleString()} calls ·{" "}
                  <span className="font-medium text-emerald-600">{c.qualified} qualified</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft lg:col-span-7 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-ink">Recent calls</h3>
              <p className="text-[13px] text-ink-muted">Latest outbound activity</p>
            </div>
            <Link
              href="/leads"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul className="space-y-2">
            {RECENT_CALLS.map((call) => (
              <li
                key={call.lead}
                className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-all hover:border-border hover:bg-surface-subtle"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${call.avatarBg} text-[12px] font-bold text-white shadow-sm`}
                >
                  {call.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-ink">{call.lead}</p>
                  <p className="truncate text-[12px] text-ink-muted">{call.agent}</p>
                </div>
                <Badge variant={statusBadge(call.status)}>{call.status}</Badge>
                <div className="hidden text-right sm:block">
                  <p className="text-[13px] font-medium text-ink">{call.duration}</p>
                  <p className="text-[11px] text-ink-hint">{call.time}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-ink-hint opacity-0 transition-opacity group-hover:opacity-100" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
