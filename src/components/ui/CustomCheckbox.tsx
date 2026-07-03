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
        "group relative inline-flex h-[22px] w-[22px] shrink-0 rounded-[8px] focus-within:ring-4 focus-within:ring-[#3c0382]/15",
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
          "pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-[8px] border-2 transition-all duration-200",
          indeterminate &&
            "border-violet-600 bg-violet-200 text-violet-700 shadow-sm shadow-violet-500/10",
          !indeterminate &&
            checked &&
            "border-[#3c0382] bg-[#3c0382] text-white shadow-md shadow-[#3c0382]/25",
          !isActive &&
            "border-slate-300 bg-white shadow-sm group-hover:border-violet-400 group-hover:bg-violet-50/90",
          disabled && "opacity-45",
        )}
      >
        {indeterminate ? (
          <Minus className="h-3.5 w-3.5 stroke-[3] checkbox-pop" />
        ) : (
          <Check
            className={cn(
              "h-3.5 w-3.5 stroke-[3] transition-all duration-200",
              checked ? "checkbox-pop scale-100 opacity-100" : "scale-50 opacity-0",
            )}
          />
        )}
      </span>
    </span>
  );
}
