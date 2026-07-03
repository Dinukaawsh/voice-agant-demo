"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
  itemLabel?: string;
};

function getPageItems(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }
  if (page >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
}: PaginationProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const pages = getPageItems(page, totalPages);

  function goTo(next: number) {
    if (next < 1 || next > totalPages || next === page) return;
    onPageChange?.(next);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-gradient-to-r from-surface-subtle/50 via-white to-violet-50/20 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-center text-[13px] text-ink-muted sm:text-left">
        Showing{" "}
        <span className="font-semibold tabular-nums text-ink">
          {start.toLocaleString()}–{end.toLocaleString()}
        </span>{" "}
        of <span className="font-semibold tabular-nums text-ink">{totalItems.toLocaleString()}</span>{" "}
        {itemLabel}
      </p>

      <nav
        className="flex items-center justify-center gap-2"
        aria-label="Pagination"
      >
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all",
            page <= 1
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
              : "border-slate-300 bg-white text-slate-600 shadow-sm hover:border-[#3c0382] hover:bg-violet-50 hover:text-[#3c0382] active:scale-95",
          )}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>

        <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-white p-1 shadow-sm">
          {pages.map((item, i) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${i}`}
                className="flex h-8 w-8 items-center justify-center text-slate-400"
                aria-hidden
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => goTo(item)}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  "flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-[13px] font-semibold tabular-nums transition-all",
                  item === page
                    ? "bg-[#3c0382] text-white shadow-md shadow-[#3c0382]/25"
                    : "text-ink-muted hover:bg-violet-50 hover:text-[#3c0382]",
                )}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all",
            page >= totalPages
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
              : "border-slate-300 bg-white text-slate-600 shadow-sm hover:border-[#3c0382] hover:bg-violet-50 hover:text-[#3c0382] active:scale-95",
          )}
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </nav>
    </div>
  );
}
