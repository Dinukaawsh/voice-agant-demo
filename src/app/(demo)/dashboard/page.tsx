import Link from "next/link";
import {
  PhoneCall,
  TrendingUp,
  Users,
  Bot,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const RECENT_CALLS = [
  {
    lead: "Marie Dupont",
    agent: "Health FR - July",
    status: "Qualified",
    duration: "4:32",
    time: "12 min ago",
  },
  {
    lead: "Jean Martin",
    agent: "Health FR - July",
    status: "No answer",
    duration: "-",
    time: "28 min ago",
  },
  {
    lead: "Sophie Bernard",
    agent: "Solar EN - Q3",
    status: "Callback",
    duration: "2:18",
    time: "1 hr ago",
  },
  {
    lead: "Pierre Leroy",
    agent: "Health FR - July",
    status: "Qualified",
    duration: "5:01",
    time: "2 hr ago",
  },
];

const CAMPAIGN_PROGRESS = [
  { name: "Health FR - July", pct: 68, calls: 1240, qualified: 312 },
  { name: "Solar EN - Q3", pct: 34, calls: 580, qualified: 89 },
  { name: "Insurance ES", pct: 12, calls: 210, qualified: 24 },
];

export default function DashboardPage() {
  return (
    <div className="animate-fade-up space-y-6 p-5 lg:p-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Calls today"
          value="1,847"
          change="+12.4% vs yesterday"
          icon={PhoneCall}
          trend="up"
        />
        <StatCard
          label="Qualified leads"
          value="412"
          change="+8.2% vs yesterday"
          icon={Users}
          trend="up"
        />
        <StatCard
          label="Avg. call duration"
          value="3:48"
          change="−6s vs last week"
          icon={Clock}
          trend="neutral"
        />
        <StatCard
          label="Active agents"
          value="6"
          change="2 in test mode"
          icon={Bot}
          trend="neutral"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardTitle
            subtitle="Last 7 days"
            action={
              <Badge variant="green">
                <TrendingUp className="mr-1 inline h-3 w-3" />
                +18% qualified
              </Badge>
            }
          >
            Call volume
          </CardTitle>
          <div className="flex h-48 items-end justify-between gap-2 px-1">
            {[42, 58, 51, 72, 65, 88, 76].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-accent to-accent/60 transition-all hover:from-accent hover:to-accent/80"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-ink-hint">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle subtitle="Outbound campaigns">Active campaigns</CardTitle>
          <div className="space-y-4">
            {CAMPAIGN_PROGRESS.map((c) => (
              <div key={c.name}>
                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                  <span className="font-medium text-ink">{c.name}</span>
                  <span className="text-ink-muted">{c.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-ink-hint">
                  {c.calls.toLocaleString()} calls · {c.qualified} qualified
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle
          subtitle="Latest outbound activity"
          action={
            <Link
              href="/campaigns"
              className="flex items-center gap-1 text-[13px] font-medium text-accent hover:underline"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          Recent calls
        </CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-border text-[12px] font-semibold uppercase tracking-wide text-ink-hint">
                <th className="pb-3 pr-4 font-semibold">Lead</th>
                <th className="pb-3 pr-4 font-semibold">Agent</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 pr-4 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_CALLS.map((call) => (
                <tr
                  key={call.lead}
                  className="border-b border-border/60 last:border-0 hover:bg-surface-muted/50"
                >
                  <td className="py-3.5 pr-4 font-medium text-ink">
                    {call.lead}
                  </td>
                  <td className="py-3.5 pr-4 text-ink-muted">{call.agent}</td>
                  <td className="py-3.5 pr-4">
                    <Badge
                      variant={
                        call.status === "Qualified"
                          ? "green"
                          : call.status === "Callback"
                            ? "blue"
                            : "default"
                      }
                    >
                      {call.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 pr-4 text-ink-muted">
                    {call.duration}
                  </td>
                  <td className="py-3.5 text-ink-hint">{call.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
