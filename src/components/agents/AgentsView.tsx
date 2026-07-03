"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import {
  Bot,
  Filter,
  MoreHorizontal,
  PhoneCall,
  Plus,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AgentCreationModal } from "@/components/agents/AgentCreationModal";
import { AgentWaveform } from "@/components/agents/AgentWaveform";
import { CustomDropdown, DropdownItem } from "@/components/ui/CustomDropdown";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MetricStatCard, MetricStatGrid } from "@/components/ui/MetricStatCard";
import { playBonk } from "@/lib/playBonk";
import { cn } from "@/lib/cn";

type AgentStatus = "Live" | "Testing" | "Draft";

type AgentRow = {
  id: string;
  name: string;
  language: string;
  status: AgentStatus;
  avatar: string;
  calls: number;
  qualified: number;
  updated: string;
};

const INITIAL_AGENTS: AgentRow[] = [
  {
    id: "health-fr-july",
    name: "Health insurance FR - July",
    language: "French",
    status: "Live",
    avatar: "/agents/agent-health.png",
    calls: 1240,
    qualified: 312,
    updated: "2 days ago",
  },
  {
    id: "solar-en-q3",
    name: "Solar leads EN - Q3",
    language: "English",
    status: "Live",
    avatar: "/agents/agent-solar.png",
    calls: 580,
    qualified: 89,
    updated: "5 days ago",
  },
  {
    id: "insurance-es-pilot",
    name: "Insurance ES - Pilot",
    language: "Spanish",
    status: "Testing",
    avatar: "/agents/agent-insurance.png",
    calls: 48,
    qualified: 12,
    updated: "1 week ago",
  },
  {
    id: "mutuelle-fr",
    name: "Mutuelle comparison FR",
    language: "French",
    status: "Draft",
    avatar: "/agents/agent-mutuelle.png",
    calls: 0,
    qualified: 0,
    updated: "Just now",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "Live", label: "Live" },
  { value: "Testing", label: "Testing" },
  { value: "Draft", label: "Draft" },
];

const LANGUAGE_OPTIONS = [
  { value: "all", label: "All languages" },
  { value: "French", label: "French" },
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Recently updated" },
  { value: "calls", label: "Most calls" },
  { value: "qualified", label: "Most qualified" },
];

const STATUS_STYLES: Record<
  AgentStatus,
  { dot: string; badge: string; wave: "cyan" | "purple" | "muted" }
> = {
  Live: {
    dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    wave: "cyan",
  },
  Testing: {
    dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    wave: "purple",
  },
  Draft: {
    dot: "bg-slate-400",
    badge: "bg-surface-muted text-slate-600 ring-border",
    wave: "muted",
  },
};

function AgentAvatar({ name, avatar, status }: { name: string; avatar: string; status: AgentStatus }) {
  const ring =
    status === "Live"
      ? "ring-emerald-200"
      : status === "Testing"
        ? "ring-amber-200"
        : "ring-border";

  return (
    <div className={cn("relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 shadow-sm", ring)}>
      <Image src={avatar} alt={name} width={48} height={48} className="h-full w-full object-cover" />
    </div>
  );
}

export function AgentsView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [agents, setAgents] = useState<AgentRow[]>(INITIAL_AGENTS);
  const [activeId, setActiveId] = useState(INITIAL_AGENTS[0]?.id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const metrics = useMemo(() => {
    const live = agents.filter((a) => a.status === "Live").length;
    const testing = agents.filter((a) => a.status === "Testing").length;
    const totalCalls = agents.reduce((s, a) => s + a.calls, 0);
    const totalQualified = agents.reduce((s, a) => s + a.qualified, 0);
    const convRate = totalCalls > 0 ? Math.round((totalQualified / totalCalls) * 100) : 0;
    return { live, testing, totalCalls, totalQualified, convRate };
  }, [agents]);

  const activeFilterCount = [
    statusFilter !== "all",
    languageFilter !== "all",
    sortBy !== "newest",
  ].filter(Boolean).length;

  const visibleAgents = useMemo(() => {
    let list = agents.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (languageFilter !== "all" && a.language !== languageFilter) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "calls") return b.calls - a.calls;
      if (sortBy === "qualified") return b.qualified - a.qualified;
      return 0;
    });

    return list;
  }, [agents, statusFilter, languageFilter, sortBy]);

  const handleAgentHover = useCallback((id: string) => {
    setHoveredId(id);
    playBonk();
  }, []);

  function clearFilters() {
    setStatusFilter("all");
    setLanguageFilter("all");
    setSortBy("newest");
  }

  function handleCreateAgent(agent: { name: string; language: string }) {
    const langLabel =
      agent.language === "fr"
        ? "French"
        : agent.language === "es"
          ? "Spanish"
          : "English";

    const id = crypto.randomUUID();
    setAgents((prev) => [
      {
        id,
        name: agent.name,
        language: langLabel,
        status: "Draft",
        avatar: "/agents/agent-mutuelle.png",
        calls: 0,
        qualified: 0,
        updated: "Just now",
      },
      ...prev,
    ]);
    setActiveId(id);
  }

  const statCards = [
    {
      label: "Live agents",
      value: String(metrics.live),
      sub: `${agents.length} total · ${metrics.testing} testing`,
      icon: Zap,
      tone: "emerald" as const,
      glow: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    {
      label: "Total calls",
      value: metrics.totalCalls.toLocaleString(),
      sub: "Across all agents",
      icon: PhoneCall,
      tone: "blue" as const,
      glow: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      label: "Qualified",
      value: metrics.totalQualified.toLocaleString(),
      sub: "Leads qualified",
      icon: Target,
      tone: "violet" as const,
      glow: "bg-violet-500/10",
      ring: "ring-violet-500/20",
    },
    {
      label: "Conversion",
      value: `${metrics.convRate}%`,
      sub: "Qualified per call",
      icon: Bot,
      tone: "orange" as const,
      glow: "bg-orange-500/10",
      ring: "ring-orange-500/20",
      trend: metrics.convRate > 0,
    },
  ];

  const filterFields = (
    <>
      <CustomSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} size="sm" className="w-[130px]" />
      <CustomSelect value={languageFilter} onChange={setLanguageFilter} options={LANGUAGE_OPTIONS} size="sm" className="w-[140px]" />
      <CustomSelect value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} size="sm" className="w-[160px]" />
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1.5 text-[11px] font-semibold text-ink-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </>
  );

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
              badge={
                stat.trend ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                    <TrendingUp className="h-2.5 w-2.5" />
                    {metrics.convRate}%
                  </span>
                ) : undefined
              }
            />
          ))}
        </MetricStatGrid>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end gap-2">
            <div
              className={cn(
                "filter-strip hidden origin-right items-center justify-end gap-2 overflow-hidden sm:flex",
                filtersOpen ? "filter-strip-open" : "filter-strip-closed",
              )}
            >
              <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">{filterFields}</div>
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              aria-label="Toggle filters"
              className={cn(
                "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-200",
                filtersOpen
                  ? "border-[#3c0382] bg-[#3c0382] text-white shadow-md"
                  : "border-violet-200/80 bg-white text-violet-600 shadow-sm hover:border-[#3c0382] hover:bg-[#3c0382] hover:text-white",
              )}
            >
              <Filter className="h-4 w-4" strokeWidth={2.25} />
              {activeFilterCount > 0 && !filtersOpen && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#3c0382] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <Button color="brand" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create agent
            </Button>
          </div>

          <div className={cn("grid gap-2 overflow-hidden transition-all duration-300 sm:hidden", filtersOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0")}>
            <CustomSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} size="sm" />
            <CustomSelect value={languageFilter} onChange={setLanguageFilter} options={LANGUAGE_OPTIONS} size="sm" />
            <CustomSelect value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} size="sm" />
            {activeFilterCount > 0 && (
              <button type="button" onClick={clearFilters} className="inline-flex items-center justify-center gap-1 rounded-full border border-border bg-white py-2 text-[12px] font-semibold text-ink-muted">
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <p className="text-[13px] text-ink-muted">
          Showing <span className="font-semibold text-ink">{visibleAgents.length}</span> of {agents.length} agents
          {activeFilterCount > 0 && (
            <span className="text-ink-hint"> · {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active</span>
          )}
        </p>

        <ul className="flex flex-col gap-3">
          {visibleAgents.map((agent) => {
            const style = STATUS_STYLES[agent.status];
            const isSelected = agent.id === activeId;
            const isHovered = agent.id === hoveredId;

            return (
              <li key={agent.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveId(agent.id)}
                  onMouseEnter={() => handleAgentHover(agent.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveId(agent.id);
                    }
                  }}
                  className={cn(
                    "agent-card group flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-white px-4 py-4 shadow-soft sm:gap-4",
                    isSelected && "border-accent/30 bg-accent-soft ring-1 ring-accent/15",
                  )}
                >
                  <AgentAvatar name={agent.name} avatar={agent.avatar} status={agent.status} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[14px] font-semibold text-ink sm:text-[15px]">{agent.name}</p>
                      <CustomDropdown
                        align="right"
                        menuWidth={176}
                        trigger={
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="ml-auto shrink-0 rounded-lg p-1.5 text-ink-hint opacity-0 transition-all hover:bg-surface-muted hover:text-ink group-hover:opacity-100 sm:ml-0"
                            aria-label="More options"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        }
                      >
                        <DropdownItem>Edit agent</DropdownItem>
                        <DropdownItem>Clone</DropdownItem>
                        <DropdownItem>Test call</DropdownItem>
                        <DropdownItem danger>Archive</DropdownItem>
                      </CustomDropdown>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", style.badge)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                        {agent.status}
                      </span>
                      <span className="text-[12px] text-ink-muted">{agent.language}</span>
                      {agent.calls > 0 && (
                        <span className="hidden text-[12px] text-ink-hint sm:inline">
                          {agent.calls.toLocaleString()} calls ·{" "}
                          <span className="font-medium text-emerald-600">{agent.qualified} qualified</span>
                        </span>
                      )}
                      <span className="text-[12px] text-ink-hint sm:ml-auto">{agent.updated}</span>
                    </div>
                  </div>

                  <div className="hidden shrink-0 rounded-xl border border-border bg-surface-subtle px-2.5 py-2 sm:block">
                    <AgentWaveform variant={style.wave} active={isHovered || isSelected} className="w-24 lg:w-28" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {visibleAgents.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-14 text-center">
            <p className="text-[14px] text-ink-muted">No agents match your filters.</p>
            <button type="button" onClick={clearFilters} className="mt-2 text-[13px] font-semibold text-[#3c0382] hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>

      <AgentCreationModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreateAgent} />
    </>
  );
}
