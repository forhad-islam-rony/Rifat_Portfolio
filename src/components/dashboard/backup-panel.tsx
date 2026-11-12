"use client";

import { useRef, useState } from "react";
import { Download, Upload, Loader2, DatabaseBackup } from "lucide-react";
import { api } from "@/lib/api-client";

/** Download a full JSON backup, or restore one. Shown on the dashboard overview. */
export function BackupPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function restore(file: File) {
    if (
      !confirm(
        "Restore this backup? Every section included in the file will be REPLACED with the backup's contents. Download a fresh backup first if you're unsure."
      )
    )
      return;
    setBusy(true);
    setMsg(null);
    try {
      const json = JSON.parse(await file.text());
      const { summary } = await api<{ summary: Record<string, number> }>("/api/admin/restore", {
        method: "POST",
        json,
      });
      const parts = Object.entries(summary).map(([k, v]) => `${k}: ${v}`).join(", ");
      setMsg({ ok: true, text: `Restored — ${parts}. Refresh to see the changes.` });
    } catch (err: any) {
      setMsg({ ok: false, text: err?.message || "Restore failed." });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mt-10 rounded-xl border border-line bg-graphite-800/70 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-graphite-750 text-amber-400">
            <DatabaseBackup className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-fg">Backup &amp; restore</p>
            <p className="text-sm text-fg-muted">
              Download everything (content, messages, photo &amp; CV) as one file. Keep a copy after
              big edits so your data can never be lost.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-3">
          <a href="/api/admin/backup" className="btn-primary">
            <Download className="h-4 w-4" /> Download backup
          </a>
          <button onClick={() => fileRef.current?.click()} disabled={busy} className="btn-ghost disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Restore
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && restore(e.target.files[0])}
          />
        </div>
      </div>
      {msg && (
        <p
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            msg.ok
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
