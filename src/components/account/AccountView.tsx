"use client";

import {
  Bell,
  Check,
  Copy,
  Crown,
  KeyRound,
  Mail,
  UserCog,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricStatCard, MetricStatGrid } from "@/components/ui/MetricStatCard";
import { cn } from "@/lib/cn";

const PROFILE = {
  name: "Admin",
  role: "Organization owner",
  email: "admin@twist-digital.com",
  phone: "+33 145 678 901",
  timezone: "Europe/Paris (CET)",
  language: "English",
  joined: "March 2025",
};

const ORGANIZATION = {
  name: "Twist Digital",
  industry: "Insurance brokerage",
  website: "twist-digital.com",
  address: "12 Rue de la Paix, 75002 Paris, France",
  vat: "FR 42 799 481 023",
  seats: "8 of 15 seats used",
};

const PLAN = {
  name: "Growth",
  price: "$499",
  cycle: "per month",
  renews: "August 1, 2026",
  minutes: "18,420 / 25,000 call minutes",
  minutesPct: 74,
};

const TEAM = [
  { id: "1", name: "Admin", email: "admin@twist-digital.com", role: "Owner", status: "Active" },
  { id: "2", name: "Camille Fournier", email: "camille@twist-digital.com", role: "Manager", status: "Active" },
  { id: "3", name: "Lucas Girard", email: "lucas@twist-digital.com", role: "Agent", status: "Active" },
  { id: "4", name: "Emma Rousseau", email: "emma@twist-digital.com", role: "Agent", status: "Invited" },
];

const NOTIFICATIONS = [
  { label: "Qualified lead alerts", desc: "Email when a lead is marked eligible", on: true },
  { label: "Campaign summaries", desc: "Daily digest of campaign performance", on: true },
  { label: "Billing reminders", desc: "Notify before each invoice is charged", on: true },
  { label: "Product updates", desc: "New features and platform changes", on: false },
];

const API_KEYS = [
  { label: "Production key", value: "tv_live_9f2c...a71b", created: "Mar 12, 2025", lastUsed: "2 hours ago" },
  { label: "Sandbox key", value: "tv_test_4d8e...c02f", created: "Mar 12, 2025", lastUsed: "Yesterday" },
];

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-500",
] as const;

const TEAM_ROW_GRID =
  "lg:grid-cols-[minmax(160px,1fr)_minmax(180px,1.2fr)_100px_100px]";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function roleVariant(role: string) {
  if (role === "Owner") return "blue" as const;
  if (role === "Manager") return "green" as const;
  return "default" as const;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-hint">{label}</p>
      <p className="mt-0.5 truncate text-[13px] font-medium text-ink">{value}</p>
    </div>
  );
}

export function AccountView() {
  const statCards = [
    {
      label: "Team members",
      value: String(TEAM.length),
      sub: ORGANIZATION.seats,
      icon: Users,
      tone: "blue" as const,
      glow: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      label: "Plan usage",
      value: `${PLAN.minutesPct}%`,
      sub: PLAN.minutes,
      icon: Crown,
      tone: "violet" as const,
      glow: "bg-violet-500/10",
      ring: "ring-violet-500/20",
    },
    {
      label: "API keys",
      value: String(API_KEYS.length),
      sub: "Production & sandbox",
      icon: KeyRound,
      tone: "amber" as const,
      glow: "bg-amber-500/10",
      ring: "ring-amber-500/20",
    },
    {
      label: "Workspace",
      value: "Active",
      sub: `${PLAN.name} · renews ${PLAN.renews}`,
      icon: UserCog,
      tone: "emerald" as const,
      glow: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
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
          />
        ))}
      </MetricStatGrid>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border bg-gradient-to-r from-violet-50/50 via-white to-blue-50/30 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-lg font-bold text-white shadow-sm">
                {initials(PROFILE.name)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[16px] font-semibold text-ink">{PROFILE.name}</h2>
                  <Badge variant="blue">{PROFILE.role}</Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-muted">
                  <Mail className="h-3.5 w-3.5" />
                  {PROFILE.email}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary">Change password</Button>
              <Button color="brand">Edit profile</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
          <DetailItem label="Phone" value={PROFILE.phone} />
          <DetailItem label="Timezone" value={PROFILE.timezone} />
          <DetailItem label="Language" value={PROFILE.language} />
          <DetailItem label="Member since" value={PROFILE.joined} />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="overflow-hidden p-0 lg:col-span-3">
          <div className="border-b border-border bg-gradient-to-r from-violet-50/50 via-white to-blue-50/30 px-5 py-3 sm:px-6">
            <h2 className="text-[15px] font-semibold text-ink">Organization</h2>
            <p className="text-[13px] text-ink-muted">Details shared across your workspace</p>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <DetailItem label="Company" value={ORGANIZATION.name} />
            <DetailItem label="Industry" value={ORGANIZATION.industry} />
            <DetailItem label="Website" value={ORGANIZATION.website} />
            <DetailItem label="VAT number" value={ORGANIZATION.vat} />
            <DetailItem label="Address" value={ORGANIZATION.address} />
            <DetailItem label="Seats" value={ORGANIZATION.seats} />
          </div>
        </Card>

        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="border-b border-border bg-gradient-to-r from-violet-50/50 via-white to-blue-50/30 px-5 py-3 sm:px-6">
            <h2 className="text-[15px] font-semibold text-ink">Plan</h2>
            <p className="text-[13px] text-ink-muted">Current subscription</p>
          </div>
          <div className="p-5 sm:p-6">
            <div className="rounded-xl border border-violet-200/80 bg-violet-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                  <Crown className="h-4 w-4 text-violet-600" />
                  {PLAN.name}
                </span>
                <Badge variant="green">Active</Badge>
              </div>
              <p className="mt-2 text-[13px] text-ink-muted">
                <span className="text-xl font-bold text-ink">{PLAN.price}</span> {PLAN.cycle}
              </p>
              <p className="mt-1 text-[12px] text-ink-hint">Renews {PLAN.renews}</p>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[12px]">
                <span className="font-medium text-ink">Call minutes</span>
                <span className="text-ink-muted">{PLAN.minutes}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                  style={{ width: `${PLAN.minutesPct}%` }}
                />
              </div>
            </div>

            <Button variant="secondary" className="mt-4 w-full">
              Manage subscription
            </Button>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border bg-gradient-to-r from-violet-50/50 via-white to-blue-50/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Team members</h2>
            <p className="text-[13px] text-ink-muted">People with access to this workspace</p>
          </div>
          <Button color="brand">
            Invite member
          </Button>
        </div>

        <div
          className={cn(
            "hidden border-b border-border bg-surface-subtle/40 px-5 py-3 lg:grid lg:items-center lg:gap-3",
            TEAM_ROW_GRID,
          )}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Member</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Email</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Role</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-hint">Status</span>
        </div>

        <div className="divide-y divide-border/60">
          {TEAM.map((member, index) => (
            <div
              key={member.id}
              className={cn(
                "group px-4 py-4 transition-colors hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-transparent sm:px-5 lg:grid lg:items-center lg:gap-3",
                TEAM_ROW_GRID,
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white shadow-sm",
                    AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length],
                  )}
                >
                  {initials(member.name)}
                </div>
                <p className="font-semibold text-ink">{member.name}</p>
              </div>
              <p className="truncate text-[13px] text-ink-muted">
                <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">
                  Email ·
                </span>
                {member.email}
              </p>
              <div>
                <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">
                  Role ·
                </span>
                <Badge variant={roleVariant(member.role)}>{member.role}</Badge>
              </div>
              <div>
                <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-hint lg:hidden">
                  Status ·
                </span>
                <Badge variant={member.status === "Active" ? "green" : "amber"}>{member.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border bg-gradient-to-r from-violet-50/50 via-white to-blue-50/30 px-5 py-3 sm:px-6">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <Bell className="h-4 w-4 text-ink-hint" />
              Notifications
            </h2>
            <p className="text-[13px] text-ink-muted">Choose what you get emailed about</p>
          </div>
          <div className="space-y-4 p-5 sm:p-6">
            {NOTIFICATIONS.map((n) => (
              <div key={n.label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[13px] font-medium text-ink">{n.label}</p>
                  <p className="text-[12px] text-ink-hint">{n.desc}</p>
                </div>
                <span
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
                    n.on ? "bg-[#3c0382]" : "bg-surface-muted",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                      n.on ? "translate-x-4" : "translate-x-0.5",
                    )}
                  />
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border bg-gradient-to-r from-violet-50/50 via-white to-blue-50/30 px-5 py-3 sm:px-6">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <KeyRound className="h-4 w-4 text-ink-hint" />
              API keys
            </h2>
            <p className="text-[13px] text-ink-muted">Use these to connect the CRM API</p>
          </div>
          <div className="space-y-3 p-5 sm:p-6">
            {API_KEYS.map((key, i) => (
              <div
                key={key.label}
                className="rounded-xl border border-border/70 bg-surface-subtle/60 p-3.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-ink">{key.label}</p>
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-[#3c0382]">
                    {i === 0 ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-[13px] text-ink-muted">{key.value}</p>
                <p className="mt-2 text-[11px] text-ink-hint">
                  Created {key.created} · Last used {key.lastUsed}
                </p>
              </div>
            ))}
            <Button variant="secondary" className="w-full">
              Generate new key
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
