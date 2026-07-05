"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Mic2, X } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { cn } from "@/lib/cn";

const SIDEBAR_EXPANDED = 248;
const SIDEBAR_COLLAPSED = 80;

function SidebarIconBox({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-colors duration-200 [&_svg]:shrink-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const [hovered, setHovered] = useState(false);

  const isExpanded = mobileOpen || hovered;

  function isActive(href: string) {
    if (href === "/agents") {
      return pathname === "/agents" || pathname.startsWith("/agents/");
    }
    return pathname.startsWith(href);
  }

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: isExpanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
      className={cn(
        "sidebar-shell z-40 flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-out",
        mobileOpen
          ? "fixed inset-y-0 left-0 translate-x-0"
          : "fixed inset-y-0 left-0 -translate-x-full lg:static lg:translate-x-0",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-3">
        <Link
          href="/dashboard"
          className="group/logo flex w-full items-center"
          onClick={onCloseMobile}
        >
          <div className="flex w-12 shrink-0 justify-center">
            <SidebarIconBox className="border-blue-500 bg-white text-blue-600 group-hover/logo:bg-blue-500 group-hover/logo:text-white">
              <Mic2 className="h-4 w-4" strokeWidth={2.25} />
            </SidebarIconBox>
          </div>
          {isExpanded && (
            <div className="ml-1 min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold tracking-tight text-ink">
                Twist Voice
              </p>
              <p className="truncate text-[11px] text-ink-hint">AI Voice Platform</p>
            </div>
          )}
        </Link>
        {mobileOpen && (
          <button
            type="button"
            className="ml-1 shrink-0 rounded-lg p-1.5 text-ink-hint hover:bg-sidebar-hover hover:text-ink lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={!isExpanded ? item.label : undefined}
              className={cn(
                "group/item flex h-11 items-center rounded-xl transition-colors",
                active
                  ? "bg-sidebar-active"
                  : "hover:bg-sidebar-hover",
              )}
            >
              <div className="flex w-12 shrink-0 justify-center">
                <SidebarIconBox
                  className={active ? item.iconActive : item.iconIdle}
                >
                  <Icon className="h-[17px] w-[17px]" strokeWidth={2.25} />
                </SidebarIconBox>
              </div>
              {isExpanded && (
                <>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-[13.5px] font-medium",
                      active ? "text-accent" : "text-ink-muted group-hover/item:text-ink",
                    )}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <span className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="shrink-0 border-t border-sidebar-border p-2">
        <button
          type="button"
          className="group/item flex h-11 w-full items-center rounded-xl transition-colors hover:bg-sidebar-hover"
        >
          <div className="flex w-12 shrink-0 justify-center">
            <SidebarIconBox className="border-slate-500 bg-white text-slate-600 group-hover/item:bg-slate-600 group-hover/item:text-white">
              <LogOut className="h-4 w-4" strokeWidth={2.25} />
            </SidebarIconBox>
          </div>
          {isExpanded && (
            <span className="truncate text-[13px] text-ink-hint group-hover/item:text-ink-muted">
              Sign out
            </span>
          )}
         </button>
      </div>
    </aside>
  );
}
