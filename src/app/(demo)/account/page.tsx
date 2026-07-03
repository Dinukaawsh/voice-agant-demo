import {
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  ShieldCheck,
  KeyRound,
  Bell,
  Copy,
  Check,
  Crown,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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
  { name: "Admin", email: "admin@twist-digital.com", role: "Owner", status: "Active" },
  { name: "Camille Fournier", email: "camille@twist-digital.com", role: "Manager", status: "Active" },
  { name: "Lucas Girard", email: "lucas@twist-digital.com", role: "Agent", status: "Active" },
  { name: "Emma Rousseau", email: "emma@twist-digital.com", role: "Agent", status: "Invited" },
];

const NOTIFICATIONS = [
  { label: "Qualified lead alerts", desc: "Email when a lead is marked eligible", on: true },
  { label: "Campaign summaries", desc: "Daily digest of campaign performance", on: true },
  { label: "Billing reminders", desc: "Notify before each invoice is charged", on: true },
  { label: "Product updates", desc: "New features and platform changes", on: false },
];

const API_KEYS = [
  { label: "Production key", value: "sk_live_9f2c...a71b", created: "Mar 12, 2025", lastUsed: "2 hours ago" },
  { label: "Sandbox key", value: "sk_test_4d8e...c02f", created: "Mar 12, 2025", lastUsed: "Yesterday" },
];

function roleVariant(role: string) {
  if (role === "Owner") return "blue" as const;
  if (role === "Manager") return "green" as const;
  return "default" as const;
}

export default function AccountPage() {
  return (
    <div className="animate-fade-up space-y-6 p-5 lg:p-8">
      {/* Profile header */}
      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-xl font-semibold text-white shadow-md shadow-accent/25">
              TD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-ink">{PROFILE.name}</h2>
                <Badge variant="blue">{PROFILE.role}</Badge>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-muted">
                <Mail className="h-3.5 w-3.5" />
                {PROFILE.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Change password</Button>
            <Button>Edit profile</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Phone, label: "Phone", value: PROFILE.phone },
            { icon: Globe, label: "Timezone", value: PROFILE.timezone },
            { icon: Globe, label: "Language", value: PROFILE.language },
            { icon: ShieldCheck, label: "Member since", value: PROFILE.joined },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-4 w-4 text-ink-hint" />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-ink-hint">
                    {item.label}
                  </p>
                  <p className="text-[13.5px] text-ink">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Organization */}
        <Card className="lg:col-span-3">
          <CardTitle subtitle="Details shared across your workspace">
            Organization
          </CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Building2, label: "Company", value: ORGANIZATION.name },
              { icon: Globe, label: "Industry", value: ORGANIZATION.industry },
              { icon: Globe, label: "Website", value: ORGANIZATION.website },
              { icon: ShieldCheck, label: "VAT number", value: ORGANIZATION.vat },
              { icon: MapPin, label: "Address", value: ORGANIZATION.address },
              { icon: Building2, label: "Seats", value: ORGANIZATION.seats },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 h-4 w-4 text-ink-hint" />
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-hint">
                      {item.label}
                    </p>
                    <p className="text-[13.5px] text-ink">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Plan */}
        <Card className="lg:col-span-2">
          <CardTitle subtitle="Current subscription">Plan</CardTitle>
          <div className="rounded-xl border border-accent/30 bg-accent-soft/50 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                <Crown className="h-4 w-4 text-accent" />
                {PLAN.name}
              </span>
              <Badge variant="green">Active</Badge>
            </div>
            <p className="mt-2 text-[13px] text-ink-muted">
              <span className="text-xl font-bold text-ink">{PLAN.price}</span>{" "}
              {PLAN.cycle}
            </p>
            <p className="mt-1 text-[12px] text-ink-hint">
              Renews {PLAN.renews}
            </p>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[12px]">
              <span className="font-medium text-ink">Call minutes</span>
              <span className="text-ink-muted">{PLAN.minutes}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent/80"
                style={{ width: `${PLAN.minutesPct}%` }}
              />
            </div>
          </div>

          <Button variant="secondary" className="mt-4 w-full">
            Manage subscription
          </Button>
        </Card>
      </div>

      {/* Team members */}
      <Card>
        <CardTitle
          subtitle="People with access to this workspace"
          action={<Button>Invite member</Button>}
        >
          Team members
        </CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-border text-[12px] font-semibold uppercase tracking-wide text-ink-hint">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {TEAM.map((member) => (
                <tr
                  key={member.email}
                  className="border-b border-border/60 last:border-0 hover:bg-surface-muted/40"
                >
                  <td className="py-3.5 pr-4 font-medium text-ink">
                    {member.name}
                  </td>
                  <td className="py-3.5 pr-4 text-ink-muted">{member.email}</td>
                  <td className="py-3.5 pr-4">
                    <Badge variant={roleVariant(member.role)}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="py-3.5">
                    <Badge variant={member.status === "Active" ? "green" : "amber"}>
                      {member.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifications */}
        <Card>
          <CardTitle subtitle="Choose what you get emailed about">
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-ink-hint" />
              Notifications
            </span>
          </CardTitle>
          <div className="space-y-4">
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.label}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{n.label}</p>
                  <p className="text-[12px] text-ink-hint">{n.desc}</p>
                </div>
                <span
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    n.on ? "bg-accent" : "bg-surface-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      n.on ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* API keys */}
        <Card>
          <CardTitle subtitle="Use these to connect the CRM API">
            <span className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-ink-hint" />
              API keys
            </span>
          </CardTitle>
          <div className="space-y-3">
            {API_KEYS.map((key, i) => (
              <div
                key={key.label}
                className="rounded-xl border border-border bg-surface-subtle p-3.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-ink">{key.label}</p>
                  <span className="flex items-center gap-1 text-[12px] text-accent">
                    {i === 0 ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copy
                  </span>
                </div>
                <p className="mt-1.5 font-mono text-[13px] text-ink-muted">
                  {key.value}
                </p>
                <p className="mt-2 text-[11px] text-ink-hint">
                  Created {key.created} · Last used {key.lastUsed}
                </p>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-4 w-full">
            Generate new key
          </Button>
        </Card>
      </div>
    </div>
  );
}
