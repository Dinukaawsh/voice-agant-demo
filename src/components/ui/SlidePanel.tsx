"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function SlidePanel({
  open,
  onClose,
  title,
  subtitle,
  children,
  headerExtra,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] transition-opacity"
        aria-label="Close panel"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="slide-panel-title"
        className={cn(
          "slide-panel-enter absolute inset-y-3 right-3 flex w-[min(100%,560px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-modal sm:inset-y-4 sm:right-4 sm:w-[min(100%,600px)] lg:w-[640px]",
          className,
        )}
      >
        <div className="shrink-0 border-b border-border bg-surface-subtle">
          <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h2
                id="slide-panel-title"
                className="text-lg font-semibold tracking-tight text-ink"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="mt-0.5 text-[13px] leading-relaxed text-ink-muted">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl border border-border bg-white p-2 text-ink-hint shadow-sm transition-colors hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {headerExtra}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
