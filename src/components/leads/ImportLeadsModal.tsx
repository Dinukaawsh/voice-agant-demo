"use client";

import { useState } from "react";
import { FileSpreadsheet, FolderPlus, UploadCloud } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export type NewLeadList = {
  name: string;
  total: number;
};

const inputClass =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink-hint focus:border-[#3c0382] focus:ring-4 focus:ring-[#3c0382]/10";

export function ImportLeadsModal({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport?: (list: NewLeadList) => void;
}) {
  const [name, setName] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [detected, setDetected] = useState(0);

  function handleImport() {
    onImport?.({ name: name.trim() || "Untitled list", total: detected });
    setName("");
    setFileName(null);
    setDetected(0);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Upload leads"
      subtitle="Import a CSV as a new lead list. Each list is dialed as its own batch."
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="brand"
            className="w-full gap-2"
            disabled={!fileName}
            onClick={handleImport}
          >
            <FolderPlus className="h-4 w-4" />
            Create list
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-[13px] font-semibold text-ink">List name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Health FR - September"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[13px] font-semibold text-ink">Lead file</label>
          {!fileName ? (
            <button
              type="button"
              onClick={() => {
                // Mock file pick
                setFileName("health_fr_september.csv");
                setDetected(3200);
              }}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cyan-300/80 bg-cyan-50/40 px-4 py-8 text-center transition-colors hover:border-cyan-500 hover:bg-cyan-50"
            >
              <UploadCloud className="h-7 w-7 text-cyan-600" />
              <span className="text-[13px] font-semibold text-ink">
                Drop a CSV here or click to browse
              </span>
              <span className="text-[12px] text-ink-hint">
                Columns: name, phone (E.164). Max 50,000 rows.
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-subtle px-4 py-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{fileName}</p>
                <p className="text-[12px] text-ink-muted">
                  {detected.toLocaleString()} valid leads detected
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileName(null);
                  setDetected(0);
                }}
                className="shrink-0 text-[12px] font-semibold text-ink-hint hover:text-red-600"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-cyan-200/70 bg-cyan-50/50 p-4">
          <UploadCloud className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
          <p className="text-[12.5px] leading-relaxed text-ink-muted">
            After upload, the list appears below. Assign employees to a campaign that
            uses it, and every lead starts as{" "}
            <span className="font-semibold text-ink">Not called</span> until an
            employee dials it.
          </p>
        </div>
      </div>
    </Modal>
  );
}
