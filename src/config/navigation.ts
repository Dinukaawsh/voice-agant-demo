import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Bot,
  Megaphone,
  Users,
  Headset,
  ClipboardCheck,
  CreditCard,
  Plug,
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
      "border-[#5B58EB]/40 bg-[#112C70] text-[#5B58EB] group-hover/item:bg-[#5B58EB] group-hover/item:text-white",
    iconActive: "border-[#5B58EB] bg-[#5B58EB] text-white",
  },
  {
    label: "Agents",
    href: "/agents",
    icon: Bot,
    description: "Manage AI voice agents",
    iconIdle:
      "border-[#8B63FF]/40 bg-[#112C70] text-[#8B63FF] group-hover/item:bg-[#8B63FF] group-hover/item:text-white",
    iconActive: "border-[#8B63FF] bg-[#8B63FF] text-white",
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
    description: "Outbound dialing campaigns",
    iconIdle:
      "border-orange-400/40 bg-[#112C70] text-orange-400 group-hover/item:bg-orange-500 group-hover/item:text-white",
    iconActive: "border-orange-500 bg-orange-500 text-white",
  },
  {
    label: "Employees",
    href: "/employees",
    icon: Headset,
    description: "Calling staff who work your campaigns",
    iconIdle:
      "border-pink-400/40 bg-[#112C70] text-pink-400 group-hover/item:bg-pink-500 group-hover/item:text-white",
    iconActive: "border-pink-500 bg-pink-500 text-white",
  },
  {
    label: "Leads",
    href: "/leads",
    icon: Users,
    description: "Leads for your organization",
    iconIdle:
      "border-[#56E1E9]/40 bg-[#112C70] text-[#56E1E9] group-hover/item:bg-[#56E1E9] group-hover/item:text-[#0A2353]",
    iconActive: "border-[#56E1E9] bg-[#56E1E9] text-[#0A2353]",
  },
  {
    label: "Lead Review",
    href: "/lead-review",
    icon: ClipboardCheck,
    description: "Review and approve eligible leads",
    iconIdle:
      "border-emerald-400/40 bg-[#112C70] text-emerald-400 group-hover/item:bg-emerald-500 group-hover/item:text-white",
    iconActive: "border-emerald-500 bg-emerald-500 text-white",
  },
  {
    label: "Cost analyser",
    href: "/billing",
    icon: CreditCard,
    description: "Cost analyser and usage billing",
    iconIdle:
      "border-amber-400/40 bg-[#112C70] text-amber-400 group-hover/item:bg-amber-500 group-hover/item:text-white",
    iconActive: "border-amber-500 bg-amber-500 text-white",
  },
  {
    label: "Connections",
    href: "/connections",
    icon: Plug,
    description: "Connect your CRMs and tools via API & webhooks",
    iconIdle:
      "border-teal-400/40 bg-[#112C70] text-teal-400 group-hover/item:bg-teal-500 group-hover/item:text-white",
    iconActive: "border-teal-500 bg-teal-500 text-white",
  },
  {
    label: "Account",
    href: "/account",
    icon: UserCog,
    description: "Profile, organization, and preferences",
    iconIdle:
      "border-white/20 bg-[#112C70] text-white/60 group-hover/item:bg-white/20 group-hover/item:text-white",
    iconActive: "border-white/40 bg-white/20 text-white",
  },
];

export function getPageMeta(pathname: string): {
  title: string;
  description: string;
} {
  const item = NAV_ITEMS.find((n) => pathname.startsWith(n.href));
  if (item) return { title: item.label, description: item.description };
  if (pathname.startsWith("/agents/new/workflow")) {
    return {
      title: "Workflow Builder",
      description: "AI-assisted conversational flow designer",
    };
  }
  if (pathname.startsWith("/agents/new")) {
    return {
      title: "Create Agent",
      description: "Guided step-by-step agent setup",
    };
  }
  return { title: "Voice Agent Platform", description: "AI Voice Agent platform" };
}
