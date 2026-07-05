"use client";

import { useMemo, useState, type ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CircleDot,
  Download,
  Filter,
  Layers,
  Megaphone,
  MoreHorizontal,
  PhoneCall,
  PhoneMissed,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  Upload,
  UploadCloud,
  User,
  Users,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CustomDropdown, DropdownItem } from "@/components/ui/CustomDropdown";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { Pagination } from "@/components/ui/Pagination";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MetricStatCard, MetricStatGrid } from "@/components/ui/MetricStatCard";
import { BulkSelectionActionBar } from "@/components/ui/BulkSelectionActionBar";
import {
  LeadStatusPicker,
  leadStatusAccent,
  type LeadStatusKey,
} from "@/components/leads/LeadStatusIndicator";
import {
  ImportLeadsModal,
  type NewLeadList,
} from "@/components/leads/ImportLeadsModal";
import { LeadCallDetail, buildLeadCall } from "@/components/leads/LeadCallDetail";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

const TOTAL_LEADS = 6950;

type LeadList = {
  name: string;
  total: number;
  qualified: number;
  noAnswer: number;
  notCalled: number;
  uploaded: string;
};

const LEAD_LISTS: LeadList[] = [
  {
    name: "Health FR - July",
    total: 4200,
    qualified: 312,
    noAnswer: 980,
    notCalled: 2908,
    uploaded: "Jul 1, 2026",
  },
  {
    name: "Solar EN - Q3",
    total: 2800,
    qualified: 89,
    noAnswer: 620,
    notCalled: 2091,
    uploaded: "Jun 24, 2026",
  },
  {
    name: "Insurance ES",
    total: 950,
    qualified: 24,
    noAnswer: 210,
    notCalled: 716,
    uploaded: "Jun 28, 2026",
  },
];

const LEAD_ROW_GRID =
  "lg:grid-cols-[40px_minmax(140px,1fr)_minmax(120px,1fr)_minmax(100px,0.8fr)_minmax(118px,auto)_minmax(100px,0.9fr)_64px_minmax(80px,auto)]";

function LeadTableIconAction({
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
        className="flex h-8 w-8 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
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

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  list: string;
  status: LeadStatusKey;
  lastCall: string;
  attempts: number;
};

const INITIAL_LEADS: LeadRow[] = [
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

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "Qualified", label: "Qualified" },
  { value: "Callback", label: "Callback" },
  { value: "In progress", label: "In progress" },
  { value: "No answer", label: "No answer" },
  { value: "Not called", label: "Not called" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Recently called" },
  { value: "attempts", label: "Most attempts" },
  { value: "name", label: "Name A–Z" },
];

const LEAD_AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-slate-400 to-slate-600",
  "from-orange-500 to-rose-500",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-teal-600",
  "from-emerald-500 to-green-600",
] as const;

function leadInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

function leadAvatarGradient(id: string) {
  const index = (parseInt(id, 10) - 1) % LEAD_AVATAR_GRADIENTS.length;
  return LEAD_AVATAR_GRADIENTS[index];
}

function formatLeadPhone(phone: string) {
  const match = phone.trim().match(/^(\+\d+)\s*(.*)$/);
  if (!match) {
    return { prefix: null as string | null, number: phone.replace(/\s+/g, "") };
  }
  return {
    prefix: match[1],
    number: match[2].replace(/\s+/g, ""),
  };
}

function LeadListStat({
  label,
  value,
  dotClass,
  valueClass,
}: {
  label: string;
  value: number;
  dotClass: string;
  valueClass?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-hint">
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClass)} />
        <span className="truncate">{label}</span>
      </p>
      <p className={cn("mt-0.5 text-[13px] font-semibold tabular-nums text-ink", valueClass)}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function LeadListCard({
  list,
  selected,
  onSelect,
}: {
  list: LeadList;
  selected: boolean;
  onSelect: () => void;
}) {
  const q = list.total > 0 ? (list.qualified / list.total) * 100 : 0;
  const na = list.total > 0 ? (list.noAnswer / list.total) * 100 : 0;
  const nc = list.total > 0 ? (list.notCalled / list.total) * 100 : 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex flex-col rounded-2xl border bg-white p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card",
        selected
          ? "border-[#3c0382] ring-1 ring-[#3c0382]/20"
          : "border-border hover:border-[#3c0382]/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-sm">
          <Layers className="h-4 w-4" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-ink">{list.name}</p>
          <p className="truncate text-[11.5px] text-ink-hint">Uploaded {list.uploaded}</p>
        </div>
        <div className="text-right">
          <p className="text-[17px] font-bold tabular-nums leading-none text-ink">
            {list.total.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-hint">
            leads
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex h-2 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full bg-emerald-500" style={{ width: `${q}%` }} />
        <div className="h-full bg-amber-500" style={{ width: `${na}%` }} />
        <div className="h-full bg-slate-300" style={{ width: `${nc}%` }} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <LeadListStat label="Qualified" value={list.qualified} dotClass="bg-emerald-500" valueClass="text-emerald-600" />
        <LeadListStat label="No answer" value={list.noAnswer} dotClass="bg-amber-500" valueClass="text-amber-600" />
        <LeadListStat label="Not called" value={list.notCalled} dotClass="bg-slate-300" />
      </div>
    </button>
  );
}

export function LeadsView() {
  const [leads, setLeads] = useState<LeadRow[]>(INITIAL_LEADS);
  const [leadLists, setLeadLists] = useState<LeadList[]>(LEAD_LISTS);
  const [importOpen, setImportOpen] = useState(false);
  const [detailLead, setDetailLead] = useState<LeadRow | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAllFiltered, setSelectAllFiltered] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [listFilter, setListFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const listOptions = useMemo(() => {
    const lists = [...new Set(leadLists.map((l) => l.name))];
    return [{ value: "all", label: "All lists" }, ...lists.map((l) => ({ value: l, label: l }))];
  }, [leadLists]);

  function handleImportList(list: NewLeadList) {
    setLeadLists((prev) => [
      {
        name: list.name,
        total: list.total,
        qualified: 0,
        noAnswer: 0,
        notCalled: list.total,
        uploaded: "Just now",
      },
      ...prev,
    ]);
  }

  function toggleListFilter(name: string) {
    setListFilter((prev) => (prev === name ? "all" : name));
  }

  const metrics = useMemo(
    () => ({
      total: TOTAL_LEADS,
      qualified: 412,
      pending: 2104,
      noAnswer: 1842,
      convRate: Math.round((412 / TOTAL_LEADS) * 100),
    }),
    [],
  );

  const activeFilterCount = [
    statusFilter !== "all",
    listFilter !== "all",
    sortBy !== "newest",
  ].filter(Boolean).length;

  const filteredLeads = useMemo(() => {
    let list = leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (listFilter !== "all" && l.list !== listFilter) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "attempts") return b.attempts - a.attempts;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [leads, statusFilter, listFilter, sortBy]);

  const pageIds = useMemo(() => filteredLeads.map((l) => l.id), [filteredLeads]);
  const totalPages = Math.max(1, Math.ceil(TOTAL_LEADS / pageSize));
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id)) && !allPageSelected;
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

  function clearFilters() {
    setStatusFilter("all");
    setListFilter("all");
    setSortBy("newest");
  }

  function updateLeadStatus(id: string, status: LeadStatusKey) {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  }

  function deleteLead(id: string) {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function callLead(id: string) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              status: "In progress",
              lastCall: "Just now",
              attempts: lead.attempts + 1,
            }
          : lead,
      ),
    );
  }

  const statCards = [
    {
      label: "Total leads",
      value: metrics.total.toLocaleString(),
      sub: "Organization-wide",
      icon: Users,
      tone: "blue" as const,
      glow: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      label: "Qualified",
      value: metrics.qualified.toLocaleString(),
      sub: `${metrics.convRate}% of total`,
      icon: Target,
      tone: "emerald" as const,
      glow: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
      trend: true,
    },
    {
      label: "Pending",
      value: metrics.pending.toLocaleString(),
      sub: "Awaiting contact",
      icon: User,
      tone: "slate" as const,
      glow: "bg-slate-500/10",
      ring: "ring-slate-500/20",
    },
    {
      label: "No answer",
      value: metrics.noAnswer.toLocaleString(),
      sub: "Needs retry",
      icon: PhoneMissed,
      tone: "amber" as const,
      glow: "bg-amber-500/10",
      ring: "ring-amber-500/20",
    },
  ];

  const filterFields = (
    <>
      <CustomSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} size="sm" className="w-[140px]" />
      <CustomSelect value={listFilter} onChange={setListFilter} options={listOptions} size="sm" className="w-[160px]" />
      <CustomSelect value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} size="sm" className="w-[150px]" />
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
      <div className="animate-fade-up space-y-6 p-5 pb-24 lg:p-8 lg:pb-28">
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

        {/* Lead lists */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-600" />
              <h3 className="text-[15px] font-semibold text-ink">Lead lists</h3>
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                {leadLists.length}
              </span>
            </div>
            {listFilter !== "all" && (
              <button
                type="button"
                onClick={() => setListFilter("all")}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#3c0382] hover:underline"
              >
                <X className="h-3.5 w-3.5" />
                Clear list filter
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {leadLists.map((list) => (
              <LeadListCard
                key={list.name}
                list={list}
                selected={listFilter === list.name}
                onSelect={() => toggleListFilter(list.name)}
              />
            ))}
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cyan-300/80 bg-cyan-50/40 p-4 text-center transition-colors hover:border-cyan-500 hover:bg-cyan-50"
            >
              <UploadCloud className="h-7 w-7 text-cyan-600" />
              <span className="text-[13px] font-semibold text-ink">Upload a new list</span>
              <span className="text-[12px] text-ink-hint">Import leads from a CSV</span>
            </button>
          </div>
        </div>

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
                  : "border-cyan-200/80 bg-white text-cyan-600 shadow-sm hover:border-[#3c0382] hover:bg-[#3c0382] hover:text-white",
              )}
            >
              <Filter className="h-4 w-4" strokeWidth={2.25} />
              {activeFilterCount > 0 && !filtersOpen && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#3c0382] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <Button variant="secondary" onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button color="brand">
              <Plus className="h-4 w-4" />
              Add lead
            </Button>
          </div>

          <div className={cn("grid gap-2 overflow-hidden transition-all duration-300 sm:hidden", filtersOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0")}>
            <CustomSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} size="sm" />
            <CustomSelect value={listFilter} onChange={setListFilter} options={listOptions} size="sm" />
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
          Showing <span className="font-semibold text-ink">{filteredLeads.length}</span> of{" "}
          {TOTAL_LEADS.toLocaleString()} leads
          {activeFilterCount > 0 && (
            <span className="text-ink-hint"> · {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active</span>
          )}
        </p>

        <Card className="overflow-hidden p-0">
          <div className={cn("hidden border-b border-border bg-gradient-to-r from-cyan-50/50 via-white to-violet-50/30 px-5 py-3 lg:grid lg:items-center lg:gap-3", LEAD_ROW_GRID)}>
            <span className="flex justify-center">
              <CustomCheckbox
                checked={allPageSelected || selectAllFiltered}
                indeterminate={somePageSelected && !selectAllFiltered}
                onCheckedChange={toggleSelectAllPage}
                aria-label="Select all on this page"
              />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Name</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Phone</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">List</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Status</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Last call</span>
            <span className="text-right text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Tries</span>
            <span className="text-right text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Actions</span>
          </div>

          <div className="divide-y divide-border/60">
            {filteredLeads.map((lead) => {
              const isSelected = selectAllFiltered || selectedIds.has(lead.id);
              const phoneParts = formatLeadPhone(lead.phone);

              return (
                <div
                  key={lead.id}
                  onClick={() => setDetailLead(lead)}
                  className={cn(
                    "group cursor-pointer border-l-[3px] px-4 py-4 transition-colors sm:px-5",
                    leadStatusAccent(lead.status),
                    isSelected
                      ? "bg-violet-50/60 hover:bg-violet-50/80"
                      : "hover:bg-gradient-to-r hover:from-cyan-50/30 hover:to-transparent",
                  )}
                >
                  <div className={cn("flex flex-col gap-4 lg:grid lg:items-center lg:gap-3", LEAD_ROW_GRID)}>
                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={isSelected}
                        onCheckedChange={() => toggleLead(lead.id)}
                        aria-label={`Select ${lead.name}`}
                      />
                    </div>

                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-bold text-white shadow-sm",
                          leadAvatarGradient(lead.id),
                        )}
                      >
                        {leadInitials(lead.name)}
                      </div>
                      <p className="truncate text-[13px] font-semibold text-ink">{lead.name}</p>
                    </div>

                    <p className="font-mono text-[13px] text-ink-muted">
                      <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">Phone · </span>
                      {phoneParts.prefix ? (
                        <>
                          <span className="text-ink-hint">{phoneParts.prefix}</span>
                          <span className="ml-2 text-ink-muted">{phoneParts.number}</span>
                        </>
                      ) : (
                        phoneParts.number
                      )}
                    </p>

                    <p className="truncate text-[13px] text-ink-muted">
                      <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">List · </span>
                      {lead.list}
                    </p>

                    <div onClick={(e) => e.stopPropagation()}>
                      <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">Status · </span>
                      <LeadStatusPicker
                        status={lead.status}
                        onChange={(status) => updateLeadStatus(lead.id, status)}
                      />
                    </div>

                    <p className="text-[13px] text-ink-muted">
                      <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">Last call · </span>
                      {lead.lastCall}
                    </p>

                    <p className="text-right tabular-nums">
                      <span className="text-[10px] font-semibold uppercase text-ink-hint lg:hidden">Tries </span>
                      <span
                        className={cn(
                          "inline-flex min-w-[1.75rem] justify-center rounded-lg px-2 py-0.5 font-semibold",
                          lead.attempts >= 3
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80"
                            : "text-ink-muted",
                        )}
                      >
                        {lead.attempts}
                      </span>
                    </p>

                    <div
                      className="flex items-center justify-end gap-0.5 lg:opacity-80 lg:transition-opacity lg:group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LeadTableIconAction
                        icon={PhoneCall}
                        label="Call now"
                        iconClassName="text-emerald-600"
                        onClick={() => callLead(lead.id)}
                      />
                      <LeadTableIconAction
                        icon={Trash2}
                        label="Delete lead"
                        iconClassName="text-red-500"
                        onClick={() => deleteLead(lead.id)}
                      />
                      <CustomDropdown
                        align="right"
                        menuWidth={180}
                        trigger={
                          <div className="group/tip relative inline-flex">
                            <span
                              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-slate-500 transition-opacity hover:opacity-70"
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
                        <DropdownItem>View details</DropdownItem>
                      </CustomDropdown>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLeads.length === 0 && (
            <div className="border-t border-border py-12 text-center">
              <p className="text-[14px] text-ink-muted">No leads match your filters.</p>
              <button type="button" onClick={clearFilters} className="mt-2 text-[13px] font-semibold text-[#3c0382] hover:underline">
                Clear filters
              </button>
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={TOTAL_LEADS}
            pageSize={pageSize}
            onPageChange={setPage}
            itemLabel="leads"
          />
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
            variant: "brand",
          },
          {
            id: "export",
            label: "Export CSV",
            icon: <Download className="h-3.5 w-3.5 shrink-0" />,
            onClick: () => undefined,
            variant: "emerald",
          },
          {
            id: "status",
            label: "Update Status",
            icon: <CircleDot className="h-3.5 w-3.5 shrink-0" />,
            onClick: () => undefined,
            variant: "violet",
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
          !selectAllFiltered && allPageSelected && TOTAL_LEADS > pageIds.length ? (
            <div className="border-t border-violet-200 bg-violet-50 px-4 py-2.5 text-center">
              <span className="text-[12px] text-ink-muted">
                All {pageIds.length} leads on this page are selected.{" "}
                <button
                  type="button"
                  onClick={selectAllMatching}
                  className="font-semibold text-[#3c0382] underline underline-offset-2 hover:text-violet-700"
                >
                  Select all {TOTAL_LEADS.toLocaleString()} matching leads
                </button>
              </span>
            </div>
          ) : null
        }
      />

      <ImportLeadsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImportList}
      />

      <Modal
        open={detailLead !== null}
        onClose={() => setDetailLead(null)}
        size="2xl"
        title={detailLead?.name ?? "Lead"}
        subtitle={
          detailLead ? `${detailLead.phone} · ${detailLead.list}` : undefined
        }
      >
        {detailLead && (
          <LeadCallDetail
            call={buildLeadCall({
              name: detailLead.name,
              phone: detailLead.phone,
              status: detailLead.status,
              campaign: detailLead.list,
              outcome: detailLead.status,
              attempts: detailLead.attempts,
              date: detailLead.lastCall,
            })}
          />
        )}
      </Modal>
    </>
  );
}
