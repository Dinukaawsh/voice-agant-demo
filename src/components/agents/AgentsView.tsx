"use client";

import { useMemo, useState, useRef, useEffect, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Filter,
  GitBranch,
  ListOrdered,
  MoreHorizontal,
  Pencil,
  PhoneCall,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AgentCreationModal } from "@/components/agents/AgentCreationModal";
import { AgentEditModal } from "@/components/agents/AgentEditModal";
import { CustomDropdown, DropdownItem } from "@/components/ui/CustomDropdown";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MetricStatCard, MetricStatGrid } from "@/components/ui/MetricStatCard";
import { cn } from "@/lib/cn";

type AgentStatus = "Ready" | "Live" | "Testing" | "Draft";

type CreationMode = "form" | "workflow";

type AgentRow = {
  id: string;
  name: string;
  tier: string;
  category: string;
  language: string;
  status: AgentStatus;
  backgroundSound: string;
  backgroundVolume: number;
  extractionFields: number;
  created: string;
  calls: number;
  qualified: number;
  creationMode: CreationMode;
};

const INITIAL_AGENTS: AgentRow[] = [
  {
    id: "lior-2",
    name: "Lior 2",
    tier: "Super agent",
    category: "Insurance",
    language: "French",
    status: "Ready",
    backgroundSound: "Cafe Background",
    backgroundVolume: 40,
    extractionFields: 8,
    created: "Jun 29, 2026",
    calls: 1240,
    qualified: 312,
    creationMode: "workflow",
  },
  {
    id: "solar-en-q3",
    name: "Solar leads EN - Q3",
    tier: "Standard agent",
    category: "Solar",
    language: "English",
    status: "Live",
    backgroundSound: "Office Ambience",
    backgroundVolume: 25,
    extractionFields: 5,
    created: "Jun 18, 2026",
    calls: 580,
    qualified: 89,
    creationMode: "form",
  },
  {
    id: "insurance-es-pilot",
    name: "Insurance ES - Pilot",
    tier: "Standard agent",
    category: "Insurance",
    language: "Spanish",
    status: "Testing",
    backgroundSound: "None",
    backgroundVolume: 0,
    extractionFields: 6,
    created: "Jun 12, 2026",
    calls: 48,
    qualified: 12,
    creationMode: "form",
  },
  {
    id: "mutuelle-fr",
    name: "Mutuelle comparison FR",
    tier: "Standard agent",
    category: "Health",
    language: "French",
    status: "Draft",
    backgroundSound: "Soft Rain",
    backgroundVolume: 30,
    extractionFields: 4,
    created: "Jul 2, 2026",
    calls: 0,
    qualified: 0,
    creationMode: "workflow",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "Ready", label: "Ready" },
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
  { value: "newest", label: "Recently created" },
  { value: "calls", label: "Most calls" },
  { value: "qualified", label: "Most qualified" },
];

const AGENT_AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-orange-500 to-rose-500",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-cyan-500 to-blue-600",
] as const;

const STATUS_STYLES: Record<AgentStatus, { dot: string; badge: string; ring: string }> = {
  Ready: {
    dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    ring: "ring-emerald-200",
  },
  Live: {
    dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    ring: "ring-emerald-200",
  },
  Testing: {
    dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    ring: "ring-amber-200",
  },
  Draft: {
    dot: "bg-slate-400",
    badge: "bg-surface-muted text-slate-600 ring-border",
    ring: "ring-border",
  },
};

function agentInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function agentAvatarGradient(id: string) {
  const index = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AGENT_AVATAR_GRADIENTS[index % AGENT_AVATAR_GRADIENTS.length];
}

function AgentInitials({ name, id, status }: { name: string; id: string; status: AgentStatus }) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-bold text-white shadow-sm ring-2",
        agentAvatarGradient(id),
        STATUS_STYLES[status].ring,
      )}
    >
      {agentInitials(name)}
    </div>
  );
}

function AgentDetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-hint">{label}</p>
      <p className="truncate text-[12px] font-medium text-ink">{value}</p>
    </div>
  );
}

function AgentIconAction({
  icon: Icon,
  label,
  onClick,
  iconClassName,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: ComponentProps<"button">["onClick"];
  iconClassName?: string;
}) {
  return (
    <div className="group/tip relative inline-flex">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="flex h-9 w-9 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
      >
        <Icon className={cn("h-4 w-4", iconClassName)} strokeWidth={2.25} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}

function CreateAgentDropdown({ onFormWizard }: { onFormWizard: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button color="brand" onClick={() => setOpen(!open)}>
        <Plus className="h-4 w-4" />
        Create agent
      </Button>
      {open && (
        <div className="animate-fade-up absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-white shadow-card">
          <div className="px-3 pb-1 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">
              Choose creation mode
            </p>
          </div>
          <div className="p-1.5">
            <button
              onClick={() => {
                setOpen(false);
                onFormWizard();
              }}
              className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <ListOrdered className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[13px] font-semibold text-ink">
                  Form wizard
                </span>
                <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">
                  Step-by-step form. Upload recordings one by one.
                </p>
              </div>
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push("/agents/new/workflow");
              }}
              className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-violet-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <GitBranch className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-ink">
                    Workflow mode
                  </span>
                  <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-600">
                    New
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">
                  Chat with AI to build your flow. Visual diagram editor.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AgentsView() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentRow | null>(null);
  const [agents, setAgents] = useState<AgentRow[]>(INITIAL_AGENTS);
  const [activeId, setActiveId] = useState(INITIAL_AGENTS[0]?.id);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const metrics = useMemo(() => {
    const live = agents.filter((a) => a.status === "Live" || a.status === "Ready").length;
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
        tier: "Standard agent",
        category: "Insurance",
        language: langLabel,
        status: "Draft",
        backgroundSound: "None",
        backgroundVolume: 0,
        extractionFields: 0,
        created: "Just now",
        calls: 0,
        qualified: 0,
        creationMode: "form",
      },
      ...prev,
    ]);
    setActiveId(id);
  }

  function handleSaveEdit(updated: { name: string; language: string }) {
    if (!editingAgent) return;
    setAgents((prev) =>
      prev.map((a) =>
        a.id === editingAgent.id
          ? { ...a, name: updated.name, language: updated.language }
          : a,
      ),
    );
    setEditingAgent(null);
  }

  function deleteAgent(id: string) {
    setAgents((prev) => {
      const next = prev.filter((a) => a.id !== id);
      setActiveId((current) => (current === id ? next[0]?.id : current));
      return next;
    });
    setEditingAgent((current) => (current?.id === id ? null : current));
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

            <CreateAgentDropdown
              onFormWizard={() => setCreateOpen(true)}
            />
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
            const backgroundLabel =
              agent.backgroundVolume > 0
                ? `${agent.backgroundSound} · ${agent.backgroundVolume}%`
                : agent.backgroundSound;

            return (
              <li key={agent.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveId(agent.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveId(agent.id);
                    }
                  }}
                  className={cn(
                    "agent-card group flex cursor-pointer flex-col gap-4 rounded-2xl border border-border bg-white px-4 py-4 shadow-soft sm:flex-row sm:items-center sm:gap-5",
                    isSelected && "border-accent/30 bg-accent-soft ring-1 ring-accent/15",
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <AgentInitials name={agent.name} id={agent.id} status={agent.status} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-ink">{agent.name}</p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-muted">
                        <span className="font-medium text-ink-muted">{agent.tier}</span>
                        <span className="text-ink-hint">·</span>
                        <span>{agent.category}</span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                            style.badge,
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                          {agent.status}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                            agent.creationMode === "workflow"
                              ? "bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-200"
                              : "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200",
                          )}
                        >
                          {agent.creationMode === "workflow" ? (
                            <><GitBranch className="h-2.5 w-2.5" /> Workflow</>
                          ) : (
                            <><ListOrdered className="h-2.5 w-2.5" /> Form</>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid min-w-0 grid-cols-2 gap-x-5 gap-y-3 border-t border-border pt-3 sm:min-w-[300px] sm:flex-1 sm:border-0 sm:pt-0 lg:min-w-[360px]">
                    <AgentDetailItem label="Language" value={agent.language} />
                    <AgentDetailItem label="Background sound" value={backgroundLabel} />
                    <AgentDetailItem
                      label="Extraction fields"
                      value={`${agent.extractionFields} field${agent.extractionFields === 1 ? "" : "s"}`}
                    />
                    <AgentDetailItem label="Created" value={agent.created} />
                  </div>

                  <div
                    className="flex shrink-0 items-center justify-end gap-1 border-t border-border pt-3 sm:border-0 sm:pt-0 sm:pl-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (agent.creationMode === "workflow") {
                          router.push("/agents/new/workflow");
                        } else {
                          setEditingAgent(agent);
                        }
                      }}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-violet-200/80 bg-violet-50 px-3 text-[12px] font-semibold text-violet-700 transition-colors hover:border-violet-300 hover:bg-violet-100"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />
                      Edit
                    </button>
                    <AgentIconAction
                      icon={Trash2}
                      label="Delete agent"
                      iconClassName="text-red-500"
                      onClick={() => deleteAgent(agent.id)}
                    />
                    <CustomDropdown
                      align="right"
                      menuWidth={176}
                      trigger={
                        <div className="group/tip relative inline-flex">
                          <span
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center text-slate-500 transition-opacity hover:opacity-70"
                            aria-label="More options"
                          >
                            <MoreHorizontal className="h-4 w-4" strokeWidth={2.25} />
                          </span>
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100"
                          >
                            More options
                          </span>
                        </div>
                      }
                    >
                      <DropdownItem>Clone</DropdownItem>
                      <DropdownItem>Test call</DropdownItem>
                      <DropdownItem danger>Archive</DropdownItem>
                    </CustomDropdown>
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
      <AgentEditModal
        agent={editingAgent}
        onClose={() => setEditingAgent(null)}
        onSave={handleSaveEdit}
      />
    </>
  );
}
