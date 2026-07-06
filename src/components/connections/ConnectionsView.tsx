"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Link2,
  Plug,
  Plus,
  RefreshCw,
  Trash2,
  Webhook,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MetricStatCard, MetricStatGrid } from "@/components/ui/MetricStatCard";
import { SlidePanel } from "@/components/ui/SlidePanel";
import { cn } from "@/lib/cn";

type ConnStatus = "connected" | "available" | "error";

type Integration = {
  id: string;
  name: string;
  category: string;
  blurb: string;
  status: ConnStatus;
  accent: string; // gradient for the logo tile
  initials: string;
  lastSync?: string;
};

const INTEGRATIONS: Integration[] = [
  {
    id: "vertikl",
    name: "Vertikl CRM",
    category: "CRM",
    blurb: "Push qualified leads straight into Vertikl with field mapping.",
    status: "connected",
    accent: "from-violet-500 to-purple-600",
    initials: "VK",
    lastSync: "2 min ago",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    blurb: "Sync contacts, deals, and call outcomes to HubSpot.",
    status: "connected",
    accent: "from-orange-500 to-rose-500",
    initials: "HS",
    lastSync: "14 min ago",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    blurb: "Create and update Leads & Opportunities in Salesforce.",
    status: "available",
    accent: "from-sky-500 to-blue-600",
    initials: "SF",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    category: "CRM",
    blurb: "Send qualified leads into your Pipedrive pipeline.",
    status: "available",
    accent: "from-emerald-500 to-teal-600",
    initials: "PD",
  },
  {
    id: "gohighlevel",
    name: "GoHighLevel",
    category: "CRM",
    blurb: "Route leads and call summaries into GHL sub-accounts.",
    status: "error",
    accent: "from-amber-500 to-orange-600",
    initials: "GH",
    lastSync: "Auth expired",
  },
  {
    id: "zoho",
    name: "Zoho CRM",
    category: "CRM",
    blurb: "Map extraction fields to Zoho modules automatically.",
    status: "available",
    accent: "from-red-500 to-rose-600",
    initials: "ZO",
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "Automation",
    blurb: "Trigger 6,000+ apps whenever a lead qualifies.",
    status: "available",
    accent: "from-orange-500 to-amber-500",
    initials: "ZP",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    category: "Export",
    blurb: "Append every qualified lead to a spreadsheet row.",
    status: "available",
    accent: "from-green-500 to-emerald-600",
    initials: "GS",
  },
];

const STATUS_META: Record<ConnStatus, { label: string; badge: string; dot: string }> = {
  connected: {
    label: "Connected",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]",
  },
  available: {
    label: "Not connected",
    badge: "bg-surface-muted text-ink-muted ring-border",
    dot: "bg-slate-300",
  },
  error: {
    label: "Action needed",
    badge: "bg-red-50 text-red-700 ring-red-200",
    dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  },
};

const AUTH_OPTIONS = [
  { value: "apikey", label: "API key" },
  { value: "oauth", label: "OAuth 2.0" },
  { value: "basic", label: "Basic auth" },
];

type WebhookRow = {
  id: string;
  url: string;
  event: string;
  active: boolean;
};

const INITIAL_WEBHOOKS: WebhookRow[] = [
  { id: "wh1", url: "https://crm.acme.com/hooks/voice-agent", event: "lead.qualified", active: true },
  { id: "wh2", url: "https://ops.acme.com/api/call-ended", event: "call.completed", active: true },
  { id: "wh3", url: "https://staging.acme.com/hooks/test", event: "lead.qualified", active: false },
];

const WEBHOOK_EVENTS = [
  { value: "lead.qualified", label: "lead.qualified" },
  { value: "lead.rejected", label: "lead.rejected" },
  { value: "call.completed", label: "call.completed" },
  { value: "call.failed", label: "call.failed" },
];

function LogoTile({ accent, initials, size = "md" }: { accent: string; initials: string; size?: "md" | "sm" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-bold text-white shadow-sm",
        accent,
        size === "md" ? "h-12 w-12 text-[13px]" : "h-9 w-9 text-[11px] rounded-xl",
      )}
    >
      {initials}
    </div>
  );
}

export function ConnectionsView() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [webhooks, setWebhooks] = useState<WebhookRow[]>(INITIAL_WEBHOOKS);
  const [connectTarget, setConnectTarget] = useState<Integration | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newHookUrl, setNewHookUrl] = useState("");
  const [newHookEvent, setNewHookEvent] = useState("lead.qualified");

  const apiKey = "tv_live_demo_8f3a2b1c9d4e7f6a5b0c1d2e";
  const baseUrl = "https://api.voice.twistdigital.solutions/v1";

  const metrics = useMemo(() => {
    const connected = integrations.filter((i) => i.status === "connected").length;
    const attention = integrations.filter((i) => i.status === "error").length;
    const activeHooks = webhooks.filter((w) => w.active).length;
    return { connected, attention, activeHooks };
  }, [integrations, webhooks]);

  function copyKey() {
    navigator.clipboard?.writeText(apiKey).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function saveConnection() {
    if (!connectTarget) return;
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === connectTarget.id ? { ...i, status: "connected", lastSync: "Just now" } : i,
      ),
    );
    setConnectTarget(null);
  }

  function disconnect(id: string) {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "available", lastSync: undefined } : i)),
    );
  }

  function addWebhook() {
    const url = newHookUrl.trim();
    if (!url) return;
    setWebhooks((prev) => [
      { id: crypto.randomUUID(), url, event: newHookEvent, active: true },
      ...prev,
    ]);
    setNewHookUrl("");
  }

  function toggleWebhook(id: string) {
    setWebhooks((prev) => prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w)));
  }

  function removeWebhook(id: string) {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  }

  const statCards = [
    {
      label: "Active connections",
      value: String(metrics.connected),
      sub: `${integrations.length} integrations available`,
      icon: Plug,
      tone: "violet" as const,
      glow: "bg-violet-500/10",
      ring: "ring-violet-500/20",
    },
    {
      label: "Active webhooks",
      value: String(metrics.activeHooks),
      sub: `${webhooks.length} endpoints configured`,
      icon: Webhook,
      tone: "blue" as const,
      glow: "bg-blue-500/10",
      ring: "ring-blue-500/20",
    },
    {
      label: "API requests",
      value: "48.2k",
      sub: "Last 30 days",
      icon: Activity,
      tone: "emerald" as const,
      glow: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
    },
    {
      label: "Needs attention",
      value: String(metrics.attention),
      sub: metrics.attention > 0 ? "Re-authorise to resume sync" : "Everything healthy",
      icon: Zap,
      tone: metrics.attention > 0 ? ("rose" as const) : ("slate" as const),
      glow: metrics.attention > 0 ? "bg-rose-500/10" : "bg-slate-500/10",
      ring: metrics.attention > 0 ? "ring-rose-500/20" : "ring-slate-500/20",
    },
  ];

  return (
    <>
      <div className="animate-fade-up space-y-6 p-5 lg:p-8">
        <MetricStatGrid>
          {statCards.map((s) => (
            <MetricStatCard
              key={s.label}
              label={s.label}
              value={s.value}
              sub={s.sub}
              icon={s.icon}
              tone={s.tone}
              ring={s.ring}
              glow={s.glow}
            />
          ))}
        </MetricStatGrid>

        {/* Integrations grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Integrations</h2>
              <p className="text-[13px] text-ink-muted">
                Connect the platform to your existing CRMs and tools.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {integrations.map((it) => {
              const meta = STATUS_META[it.status];
              const isConnected = it.status === "connected";
              return (
                <div
                  key={it.id}
                  className="group flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <LogoTile accent={it.accent} initials={it.initials} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[14px] font-semibold text-ink">{it.name}</p>
                        <Badge>{it.category}</Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-muted">
                        {it.blurb}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                        meta.badge,
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                      {it.status === "connected" && it.lastSync ? `Synced ${it.lastSync}` : meta.label}
                    </span>

                    {isConnected ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConnectTarget(it)}
                          className="rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          onClick={() => disconnect(it.id)}
                          className="rounded-full border border-border bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <Button color="brand" className="px-3.5 py-1.5 text-[12px]" onClick={() => setConnectTarget(it)}>
                        {it.status === "error" ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5" />
                            Reconnect
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* API + Webhooks */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* API access */}
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-[#3c0382]" />
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-violet-500 bg-violet-100 text-violet-600">
                  <KeyRound className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold text-ink">API access</h2>
                  <p className="text-[12px] text-ink-muted">Use these to call the platform directly.</p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-ink">Base URL</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-subtle px-3 py-2.5">
                  <Link2 className="h-4 w-4 shrink-0 text-ink-hint" />
                  <code className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{baseUrl}</code>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-ink">Secret API key</label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-subtle px-3 py-2.5">
                  <KeyRound className="h-4 w-4 shrink-0 text-ink-hint" />
                  <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-ink">
                    {showKey ? apiKey : "tv_live_••••••••••••••••••••••••••••"}
                  </code>
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="shrink-0 rounded-lg p-1.5 text-ink-hint transition-colors hover:bg-white hover:text-ink"
                    aria-label={showKey ? "Hide key" : "Show key"}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={copyKey}
                    className="shrink-0 rounded-lg p-1.5 text-ink-hint transition-colors hover:bg-white hover:text-ink"
                    aria-label="Copy key"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl border border-amber-200/70 bg-amber-50/60 px-3 py-2.5">
                <p className="text-[12px] text-amber-800">Keep this secret. Rotating invalidates the old key.</p>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Rotate
                </button>
              </div>
            </div>
          </section>

          {/* Webhooks */}
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-blue-500 bg-blue-100 text-blue-600">
                  <Webhook className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold text-ink">Webhooks</h2>
                  <p className="text-[12px] text-ink-muted">We POST call events to your endpoints.</p>
                </div>
              </div>

              <div className="space-y-2">
                {webhooks.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface-subtle/60 p-3"
                  >
                    <button
                      type="button"
                      onClick={() => toggleWebhook(w.id)}
                      className={cn(
                        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                        w.active ? "bg-emerald-500" : "bg-slate-300",
                      )}
                      aria-label={w.active ? "Disable webhook" : "Enable webhook"}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
                          w.active ? "left-[18px]" : "left-0.5",
                        )}
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[12px] text-ink">{w.url}</p>
                      <p className="text-[11px] text-ink-hint">
                        <span className="font-semibold text-ink-muted">{w.event}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWebhook(w.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink-hint transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove webhook"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid gap-2 rounded-xl border border-dashed border-border bg-surface-subtle/40 p-3 sm:grid-cols-[1fr_150px]">
                <input
                  type="text"
                  value={newHookUrl}
                  onChange={(e) => setNewHookUrl(e.target.value)}
                  placeholder="https://your-app.com/webhook"
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-[12.5px] text-ink shadow-sm outline-none transition-all placeholder:text-ink-hint focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
                <CustomSelect value={newHookEvent} onChange={setNewHookEvent} options={WEBHOOK_EVENTS} size="sm" />
                <button
                  type="button"
                  onClick={addWebhook}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-blue-300/80 bg-blue-50/50 py-2 text-[12.5px] font-semibold text-blue-700 transition-colors hover:border-blue-500 hover:bg-blue-50 sm:col-span-2"
                >
                  <Plus className="h-4 w-4" />
                  Add webhook endpoint
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Connect / manage panel */}
      <SlidePanel
        open={connectTarget !== null}
        onClose={() => setConnectTarget(null)}
        title={
          connectTarget
            ? connectTarget.status === "connected"
              ? `Manage ${connectTarget.name}`
              : `Connect ${connectTarget.name}`
            : "Connect"
        }
        subtitle="Enter your credentials and map fields to sync leads automatically."
      >
        {connectTarget && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="custom-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-subtle/60 p-3.5">
                <LogoTile accent={connectTarget.accent} initials={connectTarget.initials} />
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-ink">{connectTarget.name}</p>
                  <p className="text-[12px] text-ink-muted">{connectTarget.blurb}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-ink">Authentication method</label>
                <CustomSelect value="apikey" onChange={() => {}} options={AUTH_OPTIONS} />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-ink">API key / token</label>
                <input
                  type="text"
                  placeholder="Paste your CRM API key"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink-hint focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-ink">Instance / base URL</label>
                <input
                  type="text"
                  placeholder="https://your-instance.crm.com"
                  className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink-hint focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </div>

              <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
                <p className="mb-3 text-[13px] font-semibold text-ink">Field mapping</p>
                <div className="space-y-2">
                  {[
                    ["Full name", "Contact → Name"],
                    ["Date of birth", "Contact → Birthdate"],
                    ["Monthly premium", "Deal → Amount"],
                    ["Interested", "Lead → Status"],
                  ].map(([field, target]) => (
                    <div key={field} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <span className="truncate rounded-lg bg-surface-subtle px-3 py-2 text-[12px] font-medium text-ink">
                        {field}
                      </span>
                      <span className="text-ink-hint">→</span>
                      <span className="truncate rounded-lg border border-border bg-white px-3 py-2 text-[12px] text-ink-muted">
                        {target}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-border bg-surface-subtle p-4 sm:px-6">
              <div className="grid grid-cols-[1fr_1fr] gap-3">
                <Button variant="secondary" className="w-full" onClick={() => setConnectTarget(null)}>
                  Cancel
                </Button>
                <Button color="brand" className="w-full gap-2" onClick={saveConnection}>
                  <Check className="h-4 w-4" />
                  {connectTarget.status === "connected" ? "Save changes" : "Connect"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </>
  );
}
