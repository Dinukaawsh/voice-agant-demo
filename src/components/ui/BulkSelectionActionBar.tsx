"use client";

import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type BulkActionVariant = "brand" | "secondary" | "danger" | "violet" | "emerald";

export type BulkAction = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  hidden?: boolean;
  variant?: BulkActionVariant;
};

const VARIANT_CLASS: Record<BulkActionVariant, string> = {
  brand:
    "border-[#3c0382] bg-[#3c0382] text-white shadow-md shadow-[#3c0382]/20 hover:bg-[#4a0499]",
  secondary:
    "border-border bg-white text-ink shadow-sm hover:border-[#3c0382]/30 hover:bg-violet-50/50",
  violet:
    "border-violet-600 bg-violet-200 text-violet-600 hover:bg-violet-300/80",
  emerald:
    "border-emerald-600 bg-emerald-200 text-emerald-600 hover:bg-emerald-300/80",
  danger:
    "border-red-600 bg-red-200 text-red-600 hover:bg-red-300/80",
};

type BulkSelectionActionBarProps = {
  open: boolean;
  selectedLabel: string;
  onClear: () => void;
  actions: BulkAction[];
  warning?: ReactNode;
  footer?: ReactNode;
  clearDisabled?: boolean;
  ariaLabel?: string;
  maxWidthClassName?: string;
  sidebarOffsetClassName?: string;
};

export function BulkSelectionActionBar({
  open,
  selectedLabel,
  onClear,
  actions,
  warning,
  footer,
  clearDisabled = false,
  ariaLabel = "Selection actions",
  maxWidthClassName = "w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl",
  sidebarOffsetClassName = "lg:left-[248px]",
}: BulkSelectionActionBarProps) {
  if (!open) return null;

  const visibleActions = actions.filter((a) => !a.hidden);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 pt-2 sm:px-6 sm:pb-4",
        sidebarOffsetClassName,
      )}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div
        className={cn(
          "pointer-events-auto overflow-hidden rounded-2xl border border-[#3c0382]/15 bg-white/95 shadow-2xl shadow-violet-900/10 ring-1 ring-violet-100 backdrop-blur-xl",
          maxWidthClassName,
        )}
      >
        <div className="h-1 bg-gradient-to-r from-violet-600 via-[#3c0382] to-indigo-600" />

        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
          <div className="flex min-w-0 items-center justify-center gap-3 sm:justify-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-violet-600 bg-violet-200 text-violet-600">
              <Check className="h-4 w-4" strokeWidth={2.75} />
            </div>
            <p className="min-w-0 text-center text-[13.5px] font-semibold text-ink sm:text-left">
              {selectedLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-stretch justify-center gap-2 sm:justify-end">
            {visibleActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  "inline-flex h-9 min-w-[7.5rem] flex-1 items-center justify-center gap-1.5 rounded-xl border-2 px-3 text-[12px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-none",
                  VARIANT_CLASS[action.variant ?? "secondary"],
                )}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onClear}
              disabled={clearDisabled}
              className={cn(
                "inline-flex h-9 min-w-[7.5rem] flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-slate-600 bg-slate-200 px-3 text-[12px] font-semibold text-slate-600 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-none",
              )}
              aria-label="Clear selection and close"
            >
              <X className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
              Cancel
            </button>
          </div>
        </div>

        {warning}
        {footer}
      </div>
    </div>
  );
}
