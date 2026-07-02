"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ScrollArea } from "@/components/ui/ScrollArea";

type ModalSize = "md" | "lg" | "xl" | "2xl";

const sizeClass: Record<ModalSize, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-3xl",
  "2xl": "max-w-5xl",
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "xl",
  footer,
  bodyClassName,
  scrollable = true,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: ModalSize;
  footer?: React.ReactNode;
  bodyClassName?: string;
  scrollable?: boolean;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "animate-modal-in relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-modal",
          sizeClass[size],
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-surface-subtle px-6 py-4">
          <div className="min-w-0">
            <h2
              id="modal-title"
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
            className="shrink-0 rounded-lg p-2 text-ink-hint transition-colors hover:bg-surface-muted hover:text-ink"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {scrollable ? (
          <ScrollArea
            className={cn("min-h-0 flex-1 px-6 py-5", bodyClassName)}
          >
            {children}
          </ScrollArea>
        ) : (
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-5",
              bodyClassName,
            )}
          >
            {children}
          </div>
        )}

        {footer && (
          <div className="shrink-0 border-t border-border bg-surface-subtle px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
