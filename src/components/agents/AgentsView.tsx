"use client";

import { useState } from "react";
import {
  Bot,
  Plus,
  MoreHorizontal,
  Play,
  Languages,
  CheckCircle2,
  FlaskConical,
  LayoutGrid,
  List,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AgentCreationModal } from "@/components/agents/AgentCreationModal";
import { CustomDropdown, DropdownItem } from "@/components/ui/CustomDropdown";

const AGENTS = [
  {
    name: "Health insurance FR — July",
    language: "French",
    status: "Live",
    calls: 1240,
    qualified: 312,
    updated: "2 days ago",
  },
  {
    name: "Solar leads EN — Q3",
    language: "English",
    status: "Live",
    calls: 580,
    qualified: 89,
    updated: "5 days ago",
  },
  {
    name: "Insurance ES — Pilot",
    language: "Spanish",
    status: "Testing",
    calls: 48,
    qualified: 12,
    updated: "1 week ago",
  },
  {
    name: "Mutuelle comparison FR",
    language: "French",
    status: "Draft",
    calls: 0,
    qualified: 0,
    updated: "Just now",
  },
];

function statusVariant(status: string) {
  if (status === "Live") return "green" as const;
  if (status === "Testing") return "amber" as const;
  return "default" as const;
}

export function AgentsView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <>
      <div className="animate-fade-up p-5 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-ink-muted">
            {AGENTS.length} agents · 2 live · 1 in testing
          </p>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded-lg p-2 transition-colors ${
                  view === "grid"
                    ? "bg-accent-soft text-accent"
                    : "text-ink-hint hover:text-ink-muted"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded-lg p-2 transition-colors ${
                  view === "list"
                    ? "bg-accent-soft text-accent"
                    : "text-ink-hint hover:text-ink-muted"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create agent
            </Button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2">
            {AGENTS.map((agent) => (
              <Card
                key={agent.name}
                className="group transition-all hover:border-accent/25 hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink">{agent.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant={statusVariant(agent.status)}>
                          {agent.status}
                        </Badge>
                        <span className="flex items-center gap-1 text-[12px] text-ink-hint">
                          <Languages className="h-3 w-3" />
                          {agent.language}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CustomDropdown
                    align="right"
                    menuWidth={176}
                    trigger={
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-ink-hint opacity-0 transition-opacity hover:bg-surface-muted hover:text-ink group-hover:opacity-100"
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

                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-hint">
                      Calls
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-ink">
                      {agent.calls.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-hint">
                      Qualified
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-green">
                      {agent.qualified}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-hint">
                      Updated
                    </p>
                    <p className="mt-0.5 text-[13px] text-ink-muted">
                      {agent.updated}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-subtle py-2 text-[13px] font-medium text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Test call
                  </button>
                  {agent.status === "Live" ? (
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-[13px] font-medium text-ink-muted hover:bg-surface-muted"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      View stats
                    </button>
                  ) : agent.status === "Testing" ? (
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-[13px] font-medium text-ink-muted hover:bg-surface-muted"
                    >
                      <FlaskConical className="h-3.5 w-3.5" />
                      Results
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCreateOpen(true)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-accent/30 bg-accent-soft py-2 text-[13px] font-medium text-accent hover:bg-accent-muted"
                    >
                      Continue setup
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden p-0">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-[12px] font-semibold uppercase tracking-wide text-ink-hint">
                  <th className="px-5 py-3">Agent</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Language</th>
                  <th className="px-3 py-3">Calls</th>
                  <th className="px-3 py-3">Qualified</th>
                  <th className="px-3 py-3">Updated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((agent) => (
                  <tr
                    key={agent.name}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-subtle"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                          <Bot className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-ink">{agent.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <Badge variant={statusVariant(agent.status)}>
                        {agent.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-4 text-ink-muted">{agent.language}</td>
                    <td className="px-3 py-4 font-medium text-ink">
                      {agent.calls.toLocaleString()}
                    </td>
                    <td className="px-3 py-4 font-medium text-green">
                      {agent.qualified}
                    </td>
                    <td className="px-3 py-4 text-ink-muted">{agent.updated}</td>
                    <td className="px-5 py-4">
                      <CustomDropdown
                        align="right"
                        menuWidth={176}
                        trigger={
                          <button
                            type="button"
                            className="rounded-lg p-1.5 text-ink-hint hover:bg-surface-muted hover:text-ink"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        }
                      >
                        <DropdownItem>Edit agent</DropdownItem>
                        <DropdownItem>Test call</DropdownItem>
                        <DropdownItem danger>Archive</DropdownItem>
                      </CustomDropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <AgentCreationModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
