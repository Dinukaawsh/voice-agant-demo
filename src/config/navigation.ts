import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Bot,
  Megaphone,
  Users,
  Headset,
  ClipboardCheck,
  CreditCard,
  UserCog,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  /** Icon box when idle: white bg, colored icon + border */
  iconIdle: string;
  /** Icon box when active or row hovered */
  iconActive: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview, charts, and KPIs",
    iconIdle:
      "border-blue-500 bg-white text-blue-600 group-hover/item:bg-blue-500 group-hover/item:text-white",
    iconActive: "border-blue-500 bg-blue-500 text-white",
  },
  {
    label: "Agents",
    href: "/agents",
    icon: Bot,
    description: "Manage AI voice agents",
    iconIdle:
      "border-violet-500 bg-white text-violet-600 group-hover/item:bg-violet-500 group-hover/item:text-white",
    iconActive: "border-violet-500 bg-violet-500 text-white",
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
    description: "Outbound dialing campaigns",
    iconIdle:
      "border-orange-500 bg-white text-orange-600 group-hover/item:bg-orange-500 group-hover/item:text-white",
    iconActive: "border-orange-500 bg-orange-500 text-white",
  },
  {
    label: "Employees",
    href: "/employees",
    icon: Headset,
    description: "Calling staff who work your campaigns",
    iconIdle:
      "border-pink-500 bg-white text-pink-600 group-hover/item:bg-pink-500 group-hover/item:text-white",
    iconActive: "border-pink-500 bg-pink-500 text-white",
  },
  {
    label: "Leads",
    href: "/leads",
    icon: Users,
    description: "Leads for your organization",
    iconIdle:
      "border-cyan-500 bg-white text-cyan-600 group-hover/item:bg-cyan-500 group-hover/item:text-white",
    iconActive: "border-cyan-500 bg-cyan-500 text-white",
  },
  {
    label: "Lead Review",
    href: "/lead-review",
    icon: ClipboardCheck,
    description: "Review and approve eligible leads",
    iconIdle:
      "border-emerald-500 bg-white text-emerald-600 group-hover/item:bg-emerald-500 group-hover/item:text-white",
    iconActive: "border-emerald-500 bg-emerald-500 text-white",
  },
  {
    label: "Cost analyser",
    href: "/billing",
    icon: CreditCard,
    description: "Cost analyser and usage billing",
    iconIdle:
      "border-amber-500 bg-white text-amber-600 group-hover/item:bg-amber-500 group-hover/item:text-white",
    iconActive: "border-amber-500 bg-amber-500 text-white",
  },
  {
    label: "Account",
    href: "/account",
    icon: UserCog,
    description: "Profile, organization, and preferences",
    iconIdle:
      "border-slate-500 bg-white text-slate-600 group-hover/item:bg-slate-600 group-hover/item:text-white",
    iconActive: "border-slate-600 bg-slate-600 text-white",
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
  return { title: "Voice Agent Platform", description: "AI Voice Agent platform" };
}
