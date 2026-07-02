import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Bot,
  Megaphone,
  Users,
  ClipboardCheck,
  CreditCard,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview, charts, and KPIs",
  },
  {
    label: "Agents",
    href: "/agents",
    icon: Bot,
    description: "Manage AI voice agents",
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
    description: "Outbound dialing campaigns",
  },
  {
    label: "Leads",
    href: "/leads",
    icon: Users,
    description: "Leads for your organization",
  },
  {
    label: "Lead Review",
    href: "/lead-review",
    icon: ClipboardCheck,
    description: "Review and approve eligible leads",
  },
  {
    label: "Billing",
    href: "/billing",
    icon: CreditCard,
    description: "Cost analyser and usage billing",
  },
];

export function getPageMeta(pathname: string): {
  title: string;
  description: string;
} {
  const item = NAV_ITEMS.find((n) => pathname.startsWith(n.href));
  if (item) return { title: item.label, description: item.description };
  if (pathname.startsWith("/agents/new")) {
    return {
      title: "Create Agent",
      description: "Guided step-by-step agent setup",
    };
  }
  return { title: "Voice Agent Platform", description: "Demo mockup" };
}
