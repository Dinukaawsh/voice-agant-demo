"use client";

import { useState } from "react";
import {
  Plus,
  Pause,
  Play,
  MoreHorizontal,
  Megaphone,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CampaignCreationModal } from "@/components/campaigns/CampaignCreationModal";

const CAMPAIGNS = [
  {
    name: "Health FR - July outbound",
    agent: "Health insurance FR - July",
    status: "Running",
    leads: 4200,
    called: 1240,
    qualified: 312,
    schedule: "Mon–Fri, 9am–6pm CET",
  },
  {
    name: "Solar EN - Q3 push",
    agent: "Solar leads EN - Q3",
    status: "Running",
    leads: 2800,
    called: 580,
    qualified: 89,
    schedule: "Mon–Sat, 10am–5pm GMT",
  },
  {
    name: "Insurance ES pilot",
    agent: "Insurance ES - Pilot",
    status: "Paused",
    leads: 950,
    called: 210,
    qualified: 24,
    schedule: "Paused by admin",
  },
  {
    name: "Mutuelle FR - August",
    agent: "Mutuelle comparison FR",
    status: "Draft",
    leads: 0,
    called: 0,
    qualified: 0,
    schedule: "Not scheduled",
  },
];

function statusVariant(status: string) {
  if (status === "Running") return "green" as const;
  if (status === "Paused") return "amber" as const;
  return "default" as const;
}

export function CampaignsView() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="animate-fade-up p-5 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-ink-muted">
            2 running · 1 paused · 1 draft
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New campaign
          </Button>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-[12px] font-semibold uppercase tracking-wide text-ink-hint">
                  <th className="px-5 py-3.5">Campaign</th>
                  <th className="px-3 py-3.5">Agent</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5 w-[180px]">Progress</th>
                  <th className="px-3 py-3.5 text-right">Leads</th>
                  <th className="px-3 py-3.5 text-right">Called</th>
                  <th className="px-3 py-3.5 text-right">Qualified</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map((c) => {
                  const progress =
                    c.leads > 0 ? Math.round((c.called / c.leads) * 100) : 0;
                  const convRate =
                    c.called > 0
                      ? Math.round((c.qualified / c.called) * 100)
                      : 0;

                  return (
                    <tr
                      key={c.name}
                      className="group border-b border-border/60 transition-colors last:border-0 hover:bg-surface-subtle"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                            <Megaphone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-ink">{c.name}</p>
                            <p className="text-[12px] text-ink-hint">
                              {c.schedule}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-ink-muted">{c.agent}</td>
                      <td className="px-3 py-4">
                        <Badge variant={statusVariant(c.status)}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-4">
                        {c.leads > 0 ? (
                          <div>
                            <div className="mb-1 flex justify-between text-[11px]">
                              <span className="text-ink-muted">{progress}%</span>
                              <span className="text-ink-hint">{convRate}% conv.</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  c.status === "Paused"
                                    ? "bg-ink-hint"
                                    : "bg-accent"
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-ink-hint">-</span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-right font-medium text-ink">
                        {c.leads.toLocaleString()}
                      </td>
                      <td className="px-3 py-4 text-right text-ink-muted">
                        {c.called.toLocaleString()}
                      </td>
                      <td className="px-3 py-4 text-right font-medium text-green">
                        {c.qualified}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                          {c.status === "Running" ? (
                            <button
                              type="button"
                              className="rounded-lg border border-border p-2 text-ink-muted hover:bg-surface-muted"
                              title="Pause"
                            >
                              <Pause className="h-3.5 w-3.5" />
                            </button>
                          ) : c.status === "Paused" ? (
                            <button
                              type="button"
                              className="rounded-lg border border-green/30 bg-green-soft p-2 text-green"
                              title="Resume"
                            >
                              <Play className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="rounded-lg p-2 text-ink-hint hover:bg-surface-muted hover:text-ink"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <CampaignCreationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
