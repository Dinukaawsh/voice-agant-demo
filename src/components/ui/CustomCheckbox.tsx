"use client";

import { useEffect, useRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

export type CustomCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

export function CustomCheckbox({
  checked,
  onCheckedChange,
  disabled,
  indeterminate = false,
  id,
  className,
  "aria-label": ariaLabel,
}: CustomCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isActive = checked || indeterminate;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, checked]);

  return (
    <span
      className={cn(
        "group relative inline-flex h-5 w-5 shrink-0 rounded-md focus-within:ring-2 focus-within:ring-accent/35 focus-within:ring-offset-2",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className={cn(
          "absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0",
          disabled && "cursor-not-allowed",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none flex h-5 w-5 items-center justify-center rounded-md border-2 shadow-sm transition-all",
          isActive
            ? "border-accent bg-accent text-white"
            : "border-border-strong bg-surface",
          !disabled &&
            !isActive &&
            "group-hover:border-accent/60 group-hover:bg-accent-soft/50",
          disabled && "opacity-50",
        )}
      >
        {indeterminate ? (
          <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
        ) : (
          <Check
            className={cn(
              "h-3.5 w-3.5 stroke-[2.5] transition-all duration-150",
              checked ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          />
        )}
      </span>
    </span>
  );
}
