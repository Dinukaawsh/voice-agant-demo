import {
  Check,
  X,
  Play,
  ChevronRight,
  Clock,
  FileAudio,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
  return (
    <div className="animate-fade-up p-5 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="blue">3 pending review</Badge>
          <span className="text-[13px] text-ink-muted">
            Approve or reject eligible leads before CRM export
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-xl border border-border bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink-muted shadow-sm hover:text-ink"
          >
            Approve all
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {REVIEW_QUEUE.map((lead, i) => (
            <Card
              key={lead.phone}
              className={`cursor-pointer transition-all ${
                i === 0
                  ? "border-accent/40 ring-2 ring-accent/10 shadow-card"
                  : "hover:border-accent/20 hover:shadow-soft"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-ink">{lead.name}</h3>
                  <p className="mt-0.5 font-mono text-[12px] text-ink-muted">
                    {lead.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green">{lead.score}%</p>
                  <p className="text-[11px] text-ink-hint">match score</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-[13px] text-ink-muted">
                {lead.summary}
              </p>
              <div className="mt-3 flex items-center justify-between text-[12px] text-ink-hint">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Waiting {lead.waiting}
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="lg:col-span-3">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {REVIEW_QUEUE[0].name}
              </h2>
              <p className="mt-0.5 text-[13px] text-ink-muted">
                {REVIEW_QUEUE[0].campaign} · {REVIEW_QUEUE[0].agent}
              </p>
            </div>
            <Badge variant="green">Eligible</Badge>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Duration", value: REVIEW_QUEUE[0].duration },
              { label: "Match score", value: `${REVIEW_QUEUE[0].score}%` },
              { label: "Recording", value: "Available" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-surface-subtle px-4 py-3"
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-ink-hint">
                  {item.label}
                </p>
                <p className="mt-0.5 font-semibold text-ink">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
              AI summary
            </p>
            <p className="rounded-xl border border-border bg-surface-subtle p-4 text-[14px] leading-relaxed text-ink">
              {REVIEW_QUEUE[0].summary} Lead confirmed they are the account holder
              and agreed to receive a comparison by email. No objections raised
              during qualification questions.
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink-muted">
              Call recording
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-md shadow-accent/25"
              >
                <Play className="h-4 w-4 fill-current" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex h-8 items-center gap-0.5">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-accent/40"
                      style={{
                        height: `${18 + Math.sin(i * 0.5) * 10 + (i % 5) * 2}px`,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-ink-hint">
                  <span>0:00</span>
                  <span className="flex items-center gap-1">
                    <FileAudio className="h-3 w-3" />
                    call_marie_dupont.mp3
                  </span>
                  <span>4:32</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
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
              Approve & export
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
