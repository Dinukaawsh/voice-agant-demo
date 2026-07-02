"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Mic2, X } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/agents") {
      return pathname === "/agents" || pathname.startsWith("/agents/");
    }
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`z-40 flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
        mobileOpen
          ? "fixed inset-y-0 left-0 translate-x-0"
          : "fixed inset-y-0 left-0 -translate-x-full lg:static lg:translate-x-0"
      } ${collapsed ? "w-[72px]" : "w-[248px]"}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden"
          onClick={onCloseMobile}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/25">
            <Mic2 className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-ink">
                Twist Voice
              </p>
              <p className="truncate text-[11px] text-ink-hint">Demo mockup</p>
            </div>
          )}
        </Link>
        <button
          type="button"
          className="rounded-lg p-1.5 text-ink-hint hover:bg-sidebar-hover hover:text-ink lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all ${
                active
                  ? "bg-sidebar-active text-accent shadow-sm"
                  : "text-ink-muted hover:bg-sidebar-hover hover:text-ink"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  active
                    ? "text-accent"
                    : "text-ink-hint group-hover:text-ink-muted"
                }`}
              />
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-ink-hint transition-colors hover:bg-sidebar-hover hover:text-ink-muted ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
