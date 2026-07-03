"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import { CustomDropdown, DropdownItem } from "@/components/ui/CustomDropdown";
import { getPageMeta } from "@/config/navigation";
import { cn } from "@/lib/cn";

const NOTIFICATIONS = [
  { id: 1, title: "Campaign completed dial batch", time: "2m ago", unread: true },
  { id: 2, title: "12 new qualified leads today", time: "1h ago", unread: true },
  { id: 3, title: "Agent Health FR updated", time: "Yesterday", unread: false },
];

function IconAction({
  children,
  className,
  badge,
  "aria-label": ariaLabel,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  badge?: number;
  "aria-label": string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-violet-200/80 bg-white text-violet-600 shadow-sm transition-all duration-200",
        "hover:border-[#3c0382] hover:bg-[#3c0382] hover:text-white hover:shadow-md",
        className,
      )}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#3c0382] px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {badge}
        </span>
      )}
    </button>
  );
}

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { title, description } = getPageMeta(pathname);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-white/80 px-4 backdrop-blur-xl sm:px-5 lg:px-8">
      <div className="flex h-16 items-center gap-3 lg:gap-4">
        {/* Left — page title */}
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-white text-ink-muted shadow-sm transition-colors hover:border-[#3c0382]/40 hover:text-[#3c0382] lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 max-w-[200px] sm:max-w-none">
            <h1 className="truncate text-[17px] font-semibold tracking-tight text-ink sm:text-lg">
              {title}
            </h1>
            <p className="hidden truncate text-[12.5px] text-ink-muted md:block">
              {description}
            </p>
          </div>
        </div>

        {/* Center — search */}
        <div className="relative mx-auto hidden min-w-0 flex-1 sm:block md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="topbar-search group relative">
            <span className="pointer-events-none absolute left-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-indigo-50 text-[#3c0382] transition-colors group-focus-within:from-[#3c0382] group-focus-within:to-violet-600 group-focus-within:text-white">
              <Search className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <input
              type="search"
              placeholder="Search agents, campaigns, leads…"
              className="topbar-search-input w-full rounded-full border border-border/80 bg-gradient-to-r from-surface-subtle/90 via-white to-violet-50/30 py-2.5 pr-[4.5rem] pl-12 text-[13.5px] text-ink shadow-sm outline-none transition-all placeholder:text-ink-hint"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-lg border border-border/80 bg-white/90 px-2 py-1 text-[10px] font-semibold text-ink-muted shadow-sm sm:inline-flex">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right — actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
          <IconAction aria-label="Search" className="sm:hidden">
            <Search className="h-4 w-4" strokeWidth={2.25} />
          </IconAction>

          <CustomDropdown
            align="right"
            menuWidth={300}
            trigger={
              <IconAction aria-label="Notifications" badge={unreadCount}>
                <Bell className="h-4 w-4" strokeWidth={2.25} />
              </IconAction>
            }
          >
            <div className="border-b border-border px-3 py-2.5">
              <p className="text-[13px] font-semibold text-ink">Notifications</p>
              <p className="text-[11px] text-ink-hint">{unreadCount} unread</p>
            </div>
            {NOTIFICATIONS.map((n) => (
              <button
                key={n.id}
                type="button"
                className={cn(
                  "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-muted",
                  n.unread && "bg-violet-50/60",
                )}
              >
                <span className="flex items-start gap-2">
                  {n.unread && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3c0382]" />
                  )}
                  <span className={cn("text-[13px] leading-snug", n.unread ? "font-medium text-ink" : "text-ink-muted")}>
                    {n.title}
                  </span>
                </span>
                <span className={cn("text-[11px] text-ink-hint", n.unread && "pl-3.5")}>
                  {n.time}
                </span>
              </button>
            ))}
            <div className="border-t border-border p-1.5">
              <DropdownItem>View all notifications</DropdownItem>
            </div>
          </CustomDropdown>

          <CustomDropdown
            align="right"
            menuWidth={220}
            trigger={
              <button
                type="button"
                className="group flex items-center gap-2 rounded-full border border-border/80 bg-white py-1 pl-1 pr-2.5 shadow-sm transition-all hover:border-[#3c0382]/25 hover:shadow-md sm:gap-2.5 sm:pr-3"
              >
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3c0382] to-violet-500 text-[11px] font-bold text-white ring-2 ring-violet-100 transition-all group-hover:ring-[#3c0382]/20">
                  TD
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-[13px] font-semibold leading-tight text-ink">Admin</p>
                  <p className="text-[11px] text-ink-hint">Twist Digital</p>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 text-ink-hint transition-transform group-hover:text-[#3c0382] sm:block" />
              </button>
            }
          >
            <DropdownItem onClick={() => router.push("/account")}>
              <span className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-ink-muted" />
                Profile
              </span>
            </DropdownItem>
            <DropdownItem onClick={() => router.push("/account")}>
              <span className="flex items-center gap-2">
                <Settings className="h-3.5 w-3.5 text-ink-muted" />
                Account settings
              </span>
            </DropdownItem>
            <div className="my-1 border-t border-border" />
            <DropdownItem danger>
              <span className="flex items-center gap-2">
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </span>
            </DropdownItem>
          </CustomDropdown>
        </div>
      </div>
    </header>
  );
}
