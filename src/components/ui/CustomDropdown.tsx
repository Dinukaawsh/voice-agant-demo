"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type CustomDropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
  menuWidth?: number;
};

export function CustomDropdown({
  trigger,
  children,
  align = "right",
  className,
  menuWidth = 200,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuRect, setMenuRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerWrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = useCallback(() => {
    const el = triggerWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left =
      align === "right"
        ? Math.max(8, rect.right - menuWidth)
        : Math.min(rect.left, window.innerWidth - menuWidth - 8);

    setMenuRect({ top: rect.bottom + 6, left, width: menuWidth });
  }, [align, menuWidth]);

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
        onClickCapture={() => setOpen(false)}
        style={{
          position: "fixed",
          top: menuRect.top,
          left: menuRect.left,
          width: menuRect.width,
          zIndex: 10000,
        }}
        className={cn(
          "custom-scrollbar max-h-64 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-lg",
          className,
        )}
      >
        {children}
      </div>
    ) : null;

  return (
    <div ref={rootRef} className="relative inline-flex">
      <div
        ref={triggerWrapRef}
        onClick={() => {
          setOpen((v) => {
            if (!v) updateMenuPosition();
            return !v;
          });
        }}
        className="inline-flex"
      >
        {trigger}
      </div>
      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  danger,
}: {
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-ink hover:bg-surface-muted",
      )}
    >
      {children}
    </button>
  );
}
