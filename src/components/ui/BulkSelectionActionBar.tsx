"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export const BULK_ACTION_BTN =
  "inline-flex h-9 min-w-[7.5rem] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-none";

export type BulkActionVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "neutral"
  | "white";

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
  primary: "bg-accent text-white shadow-sm hover:bg-accent-hover",
  secondary:
    "border border-blue-400/35 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25",
  white:
    "border border-white/20 bg-white/10 text-white hover:bg-white/15",
  danger:
    "border border-red-400/40 bg-red-500/15 text-red-100 hover:bg-red-500/25",
  neutral:
    "border border-slate-500/60 bg-slate-800/80 text-slate-200 hover:bg-slate-700/90",
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
          "pointer-events-auto overflow-hidden rounded-2xl border border-blue-500/25",
          "bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950",
          "shadow-2xl shadow-slate-950/40 ring-1 ring-white/10",
          maxWidthClassName,
        )}
      >
        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
          <p className="min-w-0 text-center text-sm font-semibold text-blue-100 sm:text-left">
            {selectedLabel}
          </p>

          <div className="flex flex-wrap items-stretch justify-center gap-2 sm:justify-end">
            {visibleActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  BULK_ACTION_BTN,
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
              className={cn(BULK_ACTION_BTN, VARIANT_CLASS.neutral)}
              aria-label="Clear selection and close"
            >
              <X className="h-3.5 w-3.5 shrink-0" />
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
