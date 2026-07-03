"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import {
  Bot,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AgentCreationModal } from "@/components/agents/AgentCreationModal";
import { AgentWaveform } from "@/components/agents/AgentWaveform";
import { CustomDropdown, DropdownItem } from "@/components/ui/CustomDropdown";
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
  const [filter, setFilter] = useState<"all" | "live" | "active">("active");
  const [agents, setAgents] = useState<AgentRow[]>(INITIAL_AGENTS);
  const [activeId, setActiveId] = useState(INITIAL_AGENTS[0]?.id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const liveCount = agents.filter((a) => a.status === "Live").length;
  const testingCount = agents.filter((a) => a.status === "Testing").length;
  const draftCount = agents.filter((a) => a.status === "Draft").length;

  const visibleAgents =
    filter === "live"
      ? agents.filter((a) => a.status === "Live")
      : filter === "active"
        ? agents.filter((a) => a.status !== "Draft")
        : agents;

  const handleAgentHover = useCallback((id: string) => {
    setHoveredId(id);
    playBonk();
  }, []);

  function handleCreateAgent(agent: { name: string; language: string }) {
    const id = crypto.randomUUID();
    setAgents((prev) => [
      {
        id,
        name: agent.name,
        language: agent.language,
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

  const filterLabel =
    filter === "live" ? "Live only" : filter === "active" ? "Active agents" : "All agents";

  return (
    <>
      <div className="animate-fade-up space-y-5 p-5 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-[12px] font-medium text-ink-muted shadow-soft">
              <Bot className="h-3.5 w-3.5 text-violet-600" />
              {agents.length} agents
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {liveCount} live
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[12px] font-medium text-amber-700">
              {testingCount} in testing
            </span>
            {draftCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-[12px] font-medium text-slate-600">
                {draftCount} draft
              </span>
            )}
            <CustomDropdown
              align="left"
              menuWidth={176}
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[12px] font-medium text-ink-muted shadow-soft transition-colors hover:border-accent/30 hover:text-ink"
                >
                  <Radio className="h-3.5 w-3.5 text-accent" />
                  {filterLabel}
                  <ChevronDown className="h-3 w-3 text-ink-hint" />
                </button>
              }
            >
              <DropdownItem onClick={() => setFilter("active")}>Active agents</DropdownItem>
              <DropdownItem onClick={() => setFilter("live")}>Live only</DropdownItem>
              <DropdownItem onClick={() => setFilter("all")}>All agents</DropdownItem>
            </CustomDropdown>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create agent
          </Button>
        </div>

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
                      <p className="truncate text-[14px] font-semibold text-ink sm:text-[15px]">
                        {agent.name}
                      </p>
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
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                          style.badge,
                        )}
                      >
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
                    <AgentWaveform
                      variant={style.wave}
                      active={isHovered || isSelected}
                      className="w-24 lg:w-28"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {visibleAgents.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-14 text-center">
            <p className="text-[14px] text-ink-muted">No agents match this filter.</p>
          </div>
        )}
      </div>

      <AgentCreationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateAgent}
      />
    </>
  );
}
