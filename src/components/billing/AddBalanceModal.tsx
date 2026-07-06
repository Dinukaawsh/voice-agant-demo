"use client";

import { useState } from "react";
import { Check, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SlidePanel } from "@/components/ui/SlidePanel";
import { cn } from "@/lib/cn";

const PRESETS = [100, 250, 500, 1000];

export function AddBalanceModal({
  open,
  onClose,
  currentBalance,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  currentBalance: number;
  onAdd?: (amount: number) => void;
}) {
  const [amount, setAmount] = useState(250);
  const [custom, setCustom] = useState("");

  const effective = custom.trim() ? Math.max(0, Number(custom) || 0) : amount;

  function confirm() {
    if (effective > 0) onAdd?.(effective);
    setCustom("");
    setAmount(250);
    onClose();
  }

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      title="Add balance"
      subtitle="Top up your account to keep your agents calling."
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="custom-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-emerald-600 bg-emerald-200 text-emerald-700">
                <Wallet className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-hint">
                  Current balance
                </p>
                <p className="text-xl font-bold tabular-nums text-ink">
                  ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-ink">Choose an amount</label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {PRESETS.map((p) => {
                const selected = !custom.trim() && amount === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setAmount(p);
                      setCustom("");
                    }}
                    className={cn(
                      "rounded-xl border-2 px-3 py-3 text-[15px] font-bold tabular-nums transition-all",
                      selected
                        ? "border-[#3c0382] bg-accent-soft text-[#3c0382] shadow-sm"
                        : "border-border bg-white text-ink-muted hover:border-[#3c0382]/40",
                    )}
                  >
                    ${p}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-ink">Or enter a custom amount</label>
            <div className="flex items-center rounded-xl border border-border bg-white px-3.5 shadow-sm focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
              <span className="text-[15px] font-semibold text-ink-hint">$</span>
              <input
                type="number"
                min={0}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent px-2 py-2.5 text-sm text-ink outline-none placeholder:text-ink-hint"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-subtle/60 p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-blue-600 bg-blue-200 text-blue-600">
                <CreditCard className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">Visa ending 4242</p>
                <p className="text-[11px] text-ink-hint">Default payment method</p>
              </div>
              <button type="button" className="text-[12px] font-semibold text-[#3c0382] hover:opacity-70">
                Change
              </button>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-surface-subtle p-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between text-[13px]">
            <span className="text-ink-muted">New balance after top-up</span>
            <span className="font-bold tabular-nums text-ink">
              ${(currentBalance + effective).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="grid grid-cols-[1fr_1.4fr] gap-3">
            <Button variant="secondary" className="w-full" onClick={onClose}>
              Cancel
            </Button>
            <Button color="brand" className="w-full gap-2" onClick={confirm}>
              <Check className="h-4 w-4" />
              Add ${effective.toLocaleString()}
            </Button>
          </div>
        </div>
      </div>
    </SlidePanel>
  );
}
