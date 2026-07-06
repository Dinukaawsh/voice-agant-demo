"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
};

const MENU_MAX_HEIGHT = 220;

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
  className,
  size = "md",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuRect, setMenuRect] = useState<{
    openUp: boolean;
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const openUp = spaceBelow < 140 && spaceAbove > spaceBelow;
    const maxHeight = Math.min(
      MENU_MAX_HEIGHT,
      openUp ? spaceAbove : spaceBelow,
    );

    setMenuRect({
      openUp,
      top: openUp ? undefined : rect.bottom + 4,
      bottom: openUp ? window.innerHeight - rect.top + 4 : undefined,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)),
      width: rect.width,
      maxHeight: Math.max(100, maxHeight),
    });
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();

    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  const menu =
    open && menuRect && mounted ? (
      <div
        ref={menuRef}
        style={{
          position: "fixed",
          top: menuRect.openUp ? undefined : menuRect.top,
          bottom: menuRect.openUp ? menuRect.bottom : undefined,
          left: menuRect.left,
          width: menuRect.width,
          maxHeight: menuRect.maxHeight,
          zIndex: 10000,
        }}
        className="custom-scrollbar flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
      >
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={opt.disabled}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors",
                opt.value === value
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-ink hover:bg-surface-muted",
                opt.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <span className="truncate">{opt.label}</span>
              {opt.value === value && (
                <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => {
            if (!v) updateMenuPosition();
            return !v;
          });
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-border-strong bg-surface text-left text-ink outline-none transition-all",
          "hover:border-accent/40 focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)]",
          disabled && "cursor-not-allowed opacity-60",
          size === "sm" ? "px-3 py-2 text-[13px]" : "px-3 py-2.5 text-sm",
          open && "border-accent shadow-[0_0_0_3px_var(--color-accent-soft)]",
        )}
      >
        <span
          className={cn(
            "truncate",
            !selected && "text-ink-hint",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-ink-hint transition-transform",
            open && "rotate-180 text-accent",
          )}
        />
      </button>
      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
