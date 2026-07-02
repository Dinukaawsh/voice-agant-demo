"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { getPageMeta } from "@/config/navigation";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { title, description } = getPageMeta(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/95 px-5 backdrop-blur-md lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-border bg-surface p-2 text-ink-muted shadow-sm hover:text-ink lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-ink">
            {title}
          </h1>
          <p className="hidden truncate text-[13px] text-ink-muted sm:block">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-border bg-surface-subtle px-3 py-2 text-ink-hint md:flex">
          <Search className="h-4 w-4" />
          <span className="text-[13px]">Search…</span>
          <kbd className="ml-6 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
            ⌘K
          </kbd>
        </div>
        <button
          type="button"
          className="relative rounded-xl border border-border bg-surface p-2.5 text-ink-muted shadow-sm transition-colors hover:text-ink"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <Link
          href="/account"
          className="flex items-center gap-2.5 rounded-xl border border-border bg-surface py-1.5 pl-1.5 pr-3 shadow-sm transition-colors hover:border-accent/30 hover:bg-accent-soft"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-white">
            TD
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-[13px] font-medium leading-tight text-ink">
              Demo Admin
            </p>
            <p className="text-[11px] text-ink-hint">Twist Digital</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
