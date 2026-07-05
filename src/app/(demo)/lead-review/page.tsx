"use client";

import { useState } from "react";
import { Check, ChevronRight, Clock, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LeadCallDetail, buildLeadCall } from "@/components/leads/LeadCallDetail";
import { cn } from "@/lib/cn";

const REVIEW_QUEUE = [
  {
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

export default function LeadReviewPage() {
  const [selected, setSelected] = useState(0);
  const lead = REVIEW_QUEUE[selected];

  const call = buildLeadCall({
    name: lead.name,
    phone: lead.phone,
    status: "Qualified",
    agent: lead.agent,
    campaign: lead.campaign,
    duration: lead.duration,
    outcome: "Qualified",
    date: `Waiting ${lead.waiting}`,
    summary: `${lead.summary} Lead confirmed they are the account holder and agreed to receive a comparison by email. No objections raised during qualification questions.`,
  });

  return (
    <div className="animate-fade-up p-5 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="blue">{REVIEW_QUEUE.length} pending review</Badge>
          <span className="text-[13px] text-ink-muted">
            Approve or reject eligible leads before CRM export
          </span>
        </div>
        <button
          type="button"
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink-muted shadow-sm hover:text-ink"
        >
          Approve all
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {REVIEW_QUEUE.map((q, i) => (
            <button
              key={q.phone}
              type="button"
              onClick={() => setSelected(i)}
              className="block w-full text-left"
            >
              <Card
                className={cn(
                  "transition-all",
                  i === selected
                    ? "border-accent/40 shadow-card ring-2 ring-accent/10"
                    : "hover:border-accent/20 hover:shadow-soft",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{q.name}</h3>
                    <p className="mt-0.5 font-mono text-[12px] text-ink-muted">{q.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green">{q.score}%</p>
                    <p className="text-[11px] text-ink-hint">match score</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-[13px] text-ink-muted">{q.summary}</p>
                <div className="mt-3 flex items-center justify-between text-[12px] text-ink-hint">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Waiting {q.waiting}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Card>
            </button>
          ))}
        </div>

        <Card className="lg:col-span-3">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">{lead.name}</h2>
              <p className="mt-0.5 text-[13px] text-ink-muted">
                {lead.campaign} · {lead.agent}
              </p>
            </div>
            <Badge variant="green">Eligible · {lead.score}%</Badge>
          </div>

          <LeadCallDetail call={call} />

          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-[14px] font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              <X className="h-4 w-4" />
              Reject
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green py-3 text-[14px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <Check className="h-4 w-4" />
              Approve &amp; export
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
