"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Bot,
  ChevronDown,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AgentCreationModal } from "@/components/agents/AgentCreationModal";
import { AgentWaveform } from "@/components/agents/AgentWaveform";
import { CustomDropdown, DropdownItem } from "@/components/ui/CustomDropdown";

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
  { dot: string; label: string; wave: "cyan" | "purple" | "muted" }
> = {
  Live: {
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]",
    label: "text-emerald-300",
    wave: "cyan",
  },
  Testing: {
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]",
    label: "text-amber-300",
    wave: "purple",
  },
  Draft: {
    dot: "bg-slate-400 shadow-[0_0_6px_rgba(148,163,184,0.5)]",
    label: "text-slate-400",
    wave: "muted",
  },
};

function AgentAvatar({ name, avatar }: { name: string; avatar: string }) {
  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15 shadow-lg">
      <Image
        src={avatar}
        alt={name}
        width={48}
        height={48}
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-indigo-950/40 to-transparent" />
    </div>
  );
}

export function AgentsView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "live" | "active">("active");
  const [agents, setAgents] = useState<AgentRow[]>(INITIAL_AGENTS);
  const [activeId, setActiveId] = useState(INITIAL_AGENTS[0]?.id);

  const liveCount = agents.filter((a) => a.status === "Live").length;
  const testingCount = agents.filter((a) => a.status === "Testing").length;

  const visibleAgents =
    filter === "live"
      ? agents.filter((a) => a.status === "Live")
      : filter === "active"
        ? agents.filter((a) => a.status !== "Draft")
        : agents;

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
    filter === "live"
      ? "Live only"
      : filter === "active"
        ? "Active agents"
        : "All agents";

  return (
    <>
      <div className="animate-fade-up p-5 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-ink-muted">
            {agents.length} agents · {liveCount} live · {testingCount} in testing
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create agent
          </Button>
        </div>

        <section className="agent-panel overflow-hidden rounded-2xl border border-indigo-500/20 p-5 sm:p-6 lg:p-7">
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/30 ring-2 ring-violet-400/25">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold tracking-tight text-white">
                  Voice Agents
                </h2>
                <p className="text-[12px] text-indigo-200/70">
                  Manage AI voice agents for your campaigns
                </p>
              </div>
            </div>

            <CustomDropdown
              align="right"
              menuWidth={176}
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  {filterLabel}
                  <ChevronDown className="h-3.5 w-3.5 text-white/60" />
                </button>
              }
            >
              <DropdownItem onClick={() => setFilter("active")}>
                Active agents
              </DropdownItem>
              <DropdownItem onClick={() => setFilter("live")}>
                Live only
              </DropdownItem>
              <DropdownItem onClick={() => setFilter("all")}>
                All agents
              </DropdownItem>
            </CustomDropdown>
          </div>

          <ul className="flex flex-col gap-2.5 sm:gap-3">
            {visibleAgents.map((agent) => {
              const style = STATUS_STYLES[agent.status];
              const isActive = agent.id === activeId;

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
                    className={`agent-row group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5 ${
                      isActive ? "agent-row-active" : ""
                    }`}
                  >
                    <AgentAvatar name={agent.name} avatar={agent.avatar} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[14px] font-semibold text-white sm:text-[15px]">
                          {agent.name}
                        </p>
                        <CustomDropdown
                          align="right"
                          menuWidth={176}
                          trigger={
                            <button
                              type="button"
                              onClick={(e) => e.stopPropagation()}
                              className="ml-auto shrink-0 rounded-lg p-1.5 text-white/40 opacity-0 transition-all hover:bg-white/10 hover:text-white/80 group-hover:opacity-100 sm:ml-0"
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
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          <span className={`text-[12px] font-medium ${style.label}`}>
                            {agent.status}
                          </span>
                        </span>
                        <span className="text-[12px] text-white/40">{agent.language}</span>
                        {agent.calls > 0 && (
                          <span className="hidden text-[12px] text-white/35 sm:inline">
                            {agent.calls.toLocaleString()} calls · {agent.qualified} qualified
                          </span>
                        )}
                        <span className="text-[12px] text-white/30 sm:hidden">
                          Updated {agent.updated}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center">
                      <AgentWaveform variant={style.wave} className="w-20 sm:w-32" />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {visibleAgents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center">
              <p className="text-[14px] text-white/50">No agents match this filter.</p>
            </div>
          )}
        </section>
      </div>

      <AgentCreationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateAgent}
      />
    </>
  );
}
