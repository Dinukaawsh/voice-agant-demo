"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function MockShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setMobileOpen((v) => !v)} />
        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
