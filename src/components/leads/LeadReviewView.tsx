"use client";

import { useMemo, useState } from "react";
import { Check, ClipboardCheck, Clock, Target, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LeadCallDetail, buildLeadCall } from "@/components/leads/LeadCallDetail";
import { LeadStatusIndicator } from "@/components/leads/LeadStatusIndicator";
import { MetricStatCard, MetricStatGrid } from "@/components/ui/MetricStatCard";
import { cn } from "@/lib/cn";

type ReviewLead = {
  id: string;
  name: string;
  phone: string;
  agent: string;
  campaign: string;
  score: number;
  duration: string;
  summary: string;
  waiting: string;
};

const REVIEW_QUEUE: ReviewLead[] = [
  {
    id: "1",
    name: "Marie Dupont",
    phone: "+33 612 345 678",
    agent: "Health FR - July",
    campaign: "Health FR - July outbound",
    score: 92,
    duration: "4:32",
    summary: "Interested in mutuelle comparison. Current billing €142/mo. Age 58.",
    waiting: "12 min",
  },
  {
    id: "2",
    name: "Pierre Leroy",
    phone: "+33 655 443 322",
    agent: "Health FR - July",
    campaign: "Health FR - July outbound",
    score: 88,
    duration: "5:01",
    summary: "Has existing coverage, open to switching. Mentioned dental add-on.",
    waiting: "2 hr",
  },
  {
    id: "3",
    name: "Isabelle Roux",
    phone: "+33 633 221 100",
    agent: "Solar EN - Q3",
    campaign: "Solar EN - Q3 push",
    score: 76,
    duration: "3:44",
    summary: "Homeowner, south-facing roof. Wants callback next week.",
    waiting: "4 hr",
  },
];

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-orange-500 to-rose-500",
  "from-emerald-500 to-teal-600",
] as const;

function leadInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

function scoreTone(score: number) {
  if (score >= 90) return "text-emerald-600";
  if (score >= 80) return "text-blue-600";
  return "text-amber-600";
}

export function LeadReviewView() {
  const [queue, setQueue] = useState(REVIEW_QUEUE);
  const [selectedId, setSelectedId] = useState(REVIEW_QUEUE[0]?.id ?? "");
  const [approvedToday, setApprovedToday] = useState(24);
  const [rejectedToday, setRejectedToday] = useState(6);

  const selectedIndex = queue.findIndex((q) => q.id === selectedId);
  const lead = queue[selectedIndex >= 0 ? selectedIndex : 0] ?? queue[0];

  const avgScore = useMemo(() => {
    if (queue.length === 0) return 0;
    return Math.round(queue.reduce((sum, q) => sum + q.score, 0) / queue.length);
  }, [queue]);

  const call = lead
    ? buildLeadCall({
        name: lead.name,
        phone: lead.phone,
        status: "Qualified",
        agent: lead.agent,
        campaign: lead.campaign,
        duration: lead.duration,
        outcome: "Qualified",
        date: `Waiting ${lead.waiting}`,
        summary: `${lead.summary} Lead confirmed they are the account holder and agreed to receive a comparison by email. No objections raised during qualification questions.`,
      })
    : null;

  function selectNextAfterAction() {
    setQueue((prev) => {
      const idx = prev.findIndex((q) => q.id === selectedId);
      const next = prev.filter((q) => q.id !== selectedId);
      if (next.length === 0) {
        setSelectedId("");
        return next;
      }
      const nextIdx = Math.min(idx, next.length - 1);
      setSelectedId(next[nextIdx].id);
      return next;
    });
  }

  function handleApprove() {
    setApprovedToday((n) => n + 1);
    selectNextAfterAction();
  }

  function handleReject() {
    setRejectedToday((n) => n + 1);
    selectNextAfterAction();
  }

  function handleApproveAll() {
    setApprovedToday((n) => n + queue.length);
    setQueue([]);
    setSelectedId("");
  }

  const statCards = [
    {
      label: "Pending review",
      value: String(queue.length),
      sub: "Awaiting your decision",
      icon: ClipboardCheck,
      tone: "emerald" as const,
      glow: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    {
      label: "Avg match score",
      value: queue.length > 0 ? `${avgScore}%` : "—",
      sub: "Across review queue",
      icon: Target,
      tone: "blue" as const,
      glow: "bg-blue-500/10",
      ring: "ring-blue-500/20",
      badge:
        queue.length > 0 ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
            <TrendingUp className="h-2.5 w-2.5" />
            High intent
          </span>
        ) : undefined,
    },
    {
      label: "Approved today",
      value: String(approvedToday),
      sub: "Exported to CRM",
      icon: Check,
      tone: "violet" as const,
      glow: "bg-violet-500/10",
      ring: "ring-violet-500/20",
    },
    {
      label: "Rejected today",
      value: String(rejectedToday),
      sub: "Returned to follow-up",
      icon: X,
      tone: "rose" as const,
      glow: "bg-rose-500/10",
      ring: "ring-rose-500/20",
    },
  ];

  return (
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
            badge={stat.badge}
          />
        ))}
      </MetricStatGrid>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button color="brand" onClick={handleApproveAll} disabled={queue.length === 0}>
          <Check className="h-4 w-4" />
          Approve all
        </Button>
      </div>

      <p className="text-[13px] text-ink-muted">
        <span className="font-semibold text-ink">{queue.length}</span> lead
        {queue.length === 1 ? "" : "s"} pending review · Approve or reject before CRM export
      </p>

      {queue.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="text-[15px] font-semibold text-ink">Review queue is clear</p>
          <p className="mt-1 text-[13px] text-ink-muted">All eligible leads have been processed for today.</p>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-5">
          <Card className="overflow-hidden p-0 lg:col-span-2">
            <div className="border-b border-border bg-gradient-to-r from-emerald-50/50 via-white to-violet-50/30 px-5 py-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Review queue</h2>
            </div>

            <div className="divide-y divide-border/60">
              {queue.map((q, index) => {
                const isSelected = q.id === selectedId;
                const phoneParts = formatLeadPhone(q.phone);

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedId(q.id)}
                    className={cn(
                      "group w-full border-l-[3px] px-4 py-4 text-left transition-colors sm:px-5",
                      isSelected
                        ? "border-l-emerald-500 bg-emerald-50/60"
                        : "border-l-transparent hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-transparent",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-bold text-white shadow-sm",
                          AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
                        )}
                      >
                        {leadInitials(q.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-[13px] font-semibold text-ink">{q.name}</p>
                          <div className="shrink-0 text-right">
                            <p className={cn("text-[14px] font-semibold tabular-nums", scoreTone(q.score))}>
                              {q.score}%
                            </p>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-ink-hint">Match</p>
                          </div>
                        </div>

                        <p className="mt-0.5 font-mono text-[12px] text-ink-muted">
                          {phoneParts.prefix ? (
                            <>
                              <span className="text-ink-hint">{phoneParts.prefix}</span>
                              <span className="ml-1.5">{phoneParts.number}</span>
                            </>
                          ) : (
                            phoneParts.number
                          )}
                        </p>

                        <p className="mt-1.5 line-clamp-2 text-[12px] text-ink-muted">{q.summary}</p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-hint">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Waiting {q.waiting}
                          </span>
                          <span>·</span>
                          <span className="truncate">{q.campaign}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {lead && call ? (
            <Card className="overflow-hidden p-0 lg:col-span-3">
              <div className="border-b border-border bg-gradient-to-r from-emerald-50/50 via-white to-violet-50/30 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-bold text-white shadow-sm",
                        AVATAR_GRADIENTS[selectedIndex % AVATAR_GRADIENTS.length],
                      )}
                    >
                      {leadInitials(lead.name)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-[16px] font-semibold text-ink">{lead.name}</h2>
                      <p className="mt-0.5 truncate text-[13px] text-ink-muted">
                        {lead.campaign} · {lead.agent}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <LeadStatusIndicator status="Qualified" />
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
                      {lead.score}% match
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <LeadCallDetail call={call} />

                <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                  <Button
                    variant="secondary"
                    className="flex-1 border-red-200/80 text-red-600 hover:border-red-300"
                    onClick={handleReject}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button color="brand" className="flex-1" onClick={handleApprove}>
                    <Check className="h-4 w-4" />
                    Approve &amp; export
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
