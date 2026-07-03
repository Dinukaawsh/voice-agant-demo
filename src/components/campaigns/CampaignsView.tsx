"use client";

import { useMemo, useState } from "react";
import {
  Filter,
  Megaphone,
  MoreHorizontal,
  Pause,
  PhoneCall,
  Play,
  Plus,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MetricIconButton } from "@/components/ui/MetricIconBox";
import { MetricStatCard, MetricStatGrid } from "@/components/ui/MetricStatCard";
import { CampaignCreationModal } from "@/components/campaigns/CampaignCreationModal";
import { CampaignStatusIndicator } from "@/components/campaigns/CampaignStatusIndicator";
import type { NewCampaign } from "./CampaignCreationWizard";
import { cn } from "@/lib/cn";

type CampaignRow = {
  id: string;
  name: string;
  agent: string;
  status: string;
  leads: number;
  dialed: number;
  answered: number;
  qualified: number;
  schedule: string;
};

const INITIAL_CAMPAIGNS: CampaignRow[] = [
  {
    id: "health-fr-july-outbound",
    name: "Health FR - July outbound",
    agent: "Health insurance FR - July",
    status: "Running",
    leads: 4200,
    dialed: 908,
    answered: 201,
    qualified: 5,
    schedule: "Mon–Fri, 9am–6pm CET",
  },
  {
    id: "solar-en-q3-push",
    name: "Solar EN - Q3 push",
    agent: "Solar leads EN - Q3",
    status: "Running",
    leads: 2800,
    dialed: 580,
    answered: 142,
    qualified: 89,
    schedule: "Mon–Sat, 10am–5pm GMT",
  },
  {
    id: "insurance-es-pilot",
    name: "Insurance ES pilot",
    agent: "Insurance ES - Pilot",
    status: "Paused",
    leads: 950,
    dialed: 210,
    answered: 48,
    qualified: 24,
    schedule: "Paused by admin",
  },
  {
    id: "mutuelle-fr-august",
    name: "Mutuelle FR - August",
    agent: "Mutuelle comparison FR",
    status: "Draft",
    leads: 0,
    dialed: 0,
    answered: 0,
    qualified: 0,
    schedule: "Not scheduled",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "Running", label: "Running" },
  { value: "Paused", label: "Paused" },
  { value: "Draft", label: "Draft" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "leads", label: "Most leads" },
  { value: "progress", label: "Highest progress" },
  { value: "qualified", label: "Most qualified" },
];

function statusAccent(status: string) {
  if (status === "Running") return "border-l-emerald-500";
  if (status === "Paused") return "border-l-amber-500";
  return "border-l-slate-300";
}

function progressGradient(status: string) {
  if (status === "Paused") return "from-slate-400 to-slate-500";
  if (status === "Draft") return "from-slate-300 to-slate-400";
  return "from-orange-500 via-rose-500 to-violet-500";
}

const CAMPAIGN_ROW_GRID =
  "lg:grid-cols-[minmax(200px,1.25fr)_84px_minmax(120px,0.8fr)_minmax(300px,1.6fr)_72px]";

function formatCampaignRate(value: number) {
  return `${value.toFixed(2)}%`;
}

function campaignDetailStats(campaign: CampaignRow) {
  const notAnswered = Math.max(campaign.dialed - campaign.answered, 0);
  const answerRate = campaign.dialed > 0 ? (campaign.answered / campaign.dialed) * 100 : 0;
  const convRate = campaign.dialed > 0 ? (campaign.qualified / campaign.dialed) * 100 : 0;

  return { notAnswered, answerRate, convRate };
}

function CampaignDetailMetric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 text-center lg:text-right">
      <p className={cn("truncate tabular-nums text-[14px] font-semibold leading-tight text-ink", valueClassName)}>
        {value}
      </p>
      <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wide text-ink-hint">{label}</p>
    </div>
  );
}

export function CampaignsView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>(INITIAL_CAMPAIGNS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const agentOptions = useMemo(() => {
    const agents = [...new Set(campaigns.map((c) => c.agent))];
    return [
      { value: "all", label: "All agents" },
      ...agents.map((a) => ({ value: a, label: a })),
    ];
  }, [campaigns]);

  const metrics = useMemo(() => {
    const running = campaigns.filter((c) => c.status === "Running").length;
    const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
    const totalDialed = campaigns.reduce((s, c) => s + c.dialed, 0);
    const totalQualified = campaigns.reduce((s, c) => s + c.qualified, 0);
    const convRate =
      totalDialed > 0 ? Math.round((totalQualified / totalDialed) * 100) : 0;

    return { running, totalLeads, totalDialed, totalQualified, convRate };
  }, [campaigns]);

  const activeFilterCount = [
    statusFilter !== "all",
    agentFilter !== "all",
    sortBy !== "newest",
  ].filter(Boolean).length;

  const filteredCampaigns = useMemo(() => {
    let list = campaigns.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (agentFilter !== "all" && c.agent !== agentFilter) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "leads") return b.leads - a.leads;
      if (sortBy === "qualified") return b.qualified - a.qualified;
      if (sortBy === "progress") {
        const pa = a.leads > 0 ? a.dialed / a.leads : 0;
        const pb = b.leads > 0 ? b.dialed / b.leads : 0;
        return pb - pa;
      }
      return 0;
    });

    return list;
  }, [campaigns, statusFilter, agentFilter, sortBy]);

  function clearFilters() {
    setStatusFilter("all");
    setAgentFilter("all");
    setSortBy("newest");
  }

  function handleCreateCampaign(campaign: NewCampaign) {
    setCampaigns((prev) => [{ id: crypto.randomUUID(), ...campaign }, ...prev]);
  }

  const statCards = [
    {
      label: "Running campaigns",
      value: String(metrics.running),
      sub: `${campaigns.length} total`,
      icon: Megaphone,
      tone: "orange" as const,
      glow: "bg-orange-500/10",
      ring: "ring-orange-500/20",
    },
    {
      label: "Total leads",
      value: metrics.totalLeads.toLocaleString(),
      sub: "Across all campaigns",
      icon: Users,
      tone: "blue" as const,
      glow: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      label: "Calls placed",
      value: metrics.totalDialed.toLocaleString(),
      sub: "Outbound dials",
      icon: PhoneCall,
      tone: "violet" as const,
      glow: "bg-violet-500/10",
      ring: "ring-violet-500/20",
    },
    {
      label: "Qualified",
      value: metrics.totalQualified.toLocaleString(),
      sub: `${metrics.convRate}% conversion`,
      icon: Target,
      tone: "emerald" as const,
      glow: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
      trend: true,
    },
  ];

  return (
    <>
      <div className="animate-fade-up space-y-6 p-5 lg:p-8">
        {/* Metrics */}
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
                stat.trend && metrics.convRate > 0 ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                    <TrendingUp className="h-2.5 w-2.5" />
                    {metrics.convRate}%
                  </span>
                ) : undefined
              }
            />
          ))}
        </MetricStatGrid>

        {/* Toolbar + horizontal filter strip */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-end gap-2">
            <div
              className={cn(
                "filter-strip hidden origin-right items-center justify-end gap-2 overflow-hidden sm:flex",
                filtersOpen ? "filter-strip-open" : "filter-strip-closed",
              )}
            >
              <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                <CustomSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={STATUS_OPTIONS}
                  size="sm"
                  className="w-[130px]"
                />
                <CustomSelect
                  value={agentFilter}
                  onChange={setAgentFilter}
                  options={agentOptions}
                  size="sm"
                  className="w-[200px]"
                />
                <CustomSelect
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                  size="sm"
                  className="w-[150px]"
                />
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
              </div>
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
                  : "border-orange-200/80 bg-white text-orange-600 shadow-sm hover:border-[#3c0382] hover:bg-[#3c0382] hover:text-white",
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
              New campaign
            </Button>
          </div>

          {/* Mobile: filters stack below when open */}
          <div
            className={cn(
              "grid gap-2 overflow-hidden transition-all duration-300 sm:hidden",
              filtersOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_OPTIONS}
              size="sm"
            />
            <CustomSelect
              value={agentFilter}
              onChange={setAgentFilter}
              options={agentOptions}
              size="sm"
            />
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              size="sm"
            />
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-1 rounded-full border border-border bg-white py-2 text-[12px] font-semibold text-ink-muted"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results hint */}
        <p className="text-[13px] text-ink-muted">
          Showing{" "}
          <span className="font-semibold text-ink">{filteredCampaigns.length}</span> of{" "}
          {campaigns.length} campaigns
          {activeFilterCount > 0 && (
            <span className="text-ink-hint"> · {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active</span>
          )}
        </p>

        <Card className="overflow-hidden p-0">
          {/* Desktop header */}
          <div className={cn("hidden border-b border-border bg-gradient-to-r from-orange-50/50 via-white to-violet-50/30 px-5 py-3 lg:grid lg:items-center lg:gap-3", CAMPAIGN_ROW_GRID)}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Campaign</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Status</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Progress</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Campaign details</span>
            <span className="text-right text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Actions</span>
          </div>

          <div className="divide-y divide-border/60">
            {filteredCampaigns.map((c) => {
              const progress = c.leads > 0 ? Math.round((c.dialed / c.leads) * 100) : 0;
              const { notAnswered, answerRate, convRate } = campaignDetailStats(c);

              return (
                <div
                  key={c.id}
                  className={cn(
                    "group border-l-[3px] px-4 py-4 transition-colors hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-transparent sm:px-5",
                    statusAccent(c.status),
                  )}
                >
                  <div className={cn("flex flex-col gap-4 lg:grid lg:items-center lg:gap-3", CAMPAIGN_ROW_GRID)}>
                    {/* Campaign */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20">
                        <Megaphone className="h-4 w-4" strokeWidth={2.25} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{c.name}</p>
                        <p className="truncate text-[12px] text-ink-hint">{c.schedule}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">Status · </span>
                      <CampaignStatusIndicator status={c.status} />
                    </div>

                    {/* Progress */}
                    <div className="min-w-0">
                      <div className="mb-1.5 flex items-center justify-between text-[11px]">
                        <span className="font-medium text-ink-muted">
                          <span className="lg:hidden">Progress · </span>
                          {c.leads > 0 ? `${progress}%` : "—"}
                        </span>
                        {c.dialed > 0 && (
                          <span className="text-ink-hint">{c.leads.toLocaleString()} leads</span>
                        )}
                      </div>
                      {c.leads > 0 ? (
                        <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                          <div
                            className={cn("h-full rounded-full bg-gradient-to-r transition-all", progressGradient(c.status))}
                            style={{ width: `${Math.max(progress, 2)}%` }}
                          />
                        </div>
                      ) : (
                        <div className="h-2 rounded-full bg-surface-muted" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">
                        Campaign details
                      </span>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-3 rounded-xl border border-border/70 bg-surface-subtle/60 px-3 py-2.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-2 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
                        <CampaignDetailMetric
                          label="Dialed"
                          value={c.dialed > 0 ? c.dialed.toLocaleString() : "—"}
                        />
                        <CampaignDetailMetric
                          label="Answered"
                          value={c.dialed > 0 ? c.answered.toLocaleString() : "—"}
                          valueClassName="text-emerald-600"
                        />
                        <CampaignDetailMetric
                          label="Not Answered"
                          value={c.dialed > 0 ? notAnswered.toLocaleString() : "—"}
                          valueClassName="text-rose-600"
                        />
                        <CampaignDetailMetric
                          label="Answer Rate"
                          value={c.dialed > 0 ? formatCampaignRate(answerRate) : "—"}
                          valueClassName="text-blue-600"
                        />
                        <CampaignDetailMetric
                          label="Conv. Rate"
                          value={c.dialed > 0 ? formatCampaignRate(convRate) : "—"}
                          valueClassName="text-violet-600"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5 lg:opacity-70 lg:transition-opacity lg:group-hover:opacity-100">
                      {c.status === "Running" ? (
                        <MetricIconButton icon={Pause} tone="amber" label="Pause campaign" />
                      ) : c.status === "Paused" ? (
                        <MetricIconButton icon={Play} tone="emerald" label="Resume campaign" />
                      ) : null}
                      <div className="group/tip relative inline-flex">
                        <button
                          type="button"
                          aria-label="More options"
                          className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-500 transition-opacity hover:opacity-70"
                        >
                          <MoreHorizontal className="h-4 w-4" strokeWidth={2.25} />
                        </button>
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100"
                        >
                          More options
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="border-t border-border py-12 text-center">
              <p className="text-[14px] text-ink-muted">No campaigns match your filters.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 text-[13px] font-semibold text-[#3c0382] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </Card>
      </div>

      <CampaignCreationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateCampaign}
      />
    </>
  );
}
