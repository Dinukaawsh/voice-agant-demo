"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  FileAudio,
  Check,
  Mic,
  Trash2,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/cn";

export function UploadRecordingModal({
  nodeLabel,
  onClose,
  onUpload,
}: {
  nodeLabel: string;
  onClose: () => void;
  onUpload: (fileName: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [playing, setPlaying] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(name: string) {
    const size = `${(Math.random() * 2 + 0.3).toFixed(1)} MB`;
    setFile({ name, size });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#d0d5e4] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#d0d5e4] px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Mic className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-semibold text-[#0A2353]">
              Upload recording
            </h2>
            <p className="text-[11px] text-[#7b89a8]">
              {nodeLabel}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#7b89a8] hover:bg-[#f0f2f8] hover:text-[#0A2353]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f.name);
              }}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all",
                dragOver
                  ? "border-[#5B58EB] bg-[#5B58EB]/5"
                  : "border-[#d0d5e4] bg-[#f0f2f8]/40 hover:border-[#5B58EB]/40 hover:bg-[#5B58EB]/5",
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5B58EB]/10">
                <Upload className="h-5 w-5 text-[#5B58EB]" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-medium text-[#0A2353]">
                  Drop your audio file here
                </p>
                <p className="mt-1 text-[11px] text-[#7b89a8]">
                  or click to browse — WAV, MP3, M4A up to 10MB
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".wav,.mp3,.m4a"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f.name);
                }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* File card */}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <FileAudio className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-[#0A2353]">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-[#7b89a8]">{file.size}</p>
                </div>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors hover:bg-emerald-200"
                >
                  {playing ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => setFile(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#7b89a8] transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Fake waveform */}
              {playing && (
                <div className="flex h-10 items-end justify-center gap-[3px] rounded-lg bg-[#f0f2f8] px-4">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-emerald-400"
                      style={{
                        height: `${Math.random() * 24 + 8}px`,
                        animation: `pulse 0.5s ease-in-out ${i * 0.05}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[11px] font-medium text-emerald-700">
                  Audio file ready for upload
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#d0d5e4] px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-[12px] font-medium text-[#7b89a8] hover:bg-[#f0f2f8] hover:text-[#0A2353]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (file) {
                onUpload(file.name);
                onClose();
              }
            }}
            disabled={!file}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-5 py-2 text-[12px] font-semibold shadow-sm transition-all",
              file
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "cursor-not-allowed bg-[#d0d5e4] text-[#7b89a8]",
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload recording
          </button>
        </div>
      </div>
    </div>
  );
}
