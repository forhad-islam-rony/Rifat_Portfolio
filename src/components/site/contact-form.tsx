"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ toEmail }: { toEmail: string | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "", website: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const openMail = () => {
      const mail = `mailto:${toEmail || ""}?subject=${encodeURIComponent(
        form.subject || "Portfolio enquiry"
      )}&body=${encodeURIComponent(`${form.body}\n\n— ${form.name} (${form.email})`)}`;
      window.location.href = mail;
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503 && data.error === "db_unavailable") {
        // Database not reachable — fall back to the visitor's email app so the
        // message is never lost.
        openMail();
        setStatus("success");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", body: "", website: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="panel flex flex-col items-center gap-4 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-amber-400" />
        <h3 className="display text-xl">Message sent</h3>
        <p className="max-w-sm text-sm text-fg-muted">
          Thank you for reaching out. Your message has been received and I&apos;ll
          get back to you as soon as possible.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-2">
          Send another
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-line-strong bg-graphite-800 px-4 py-3 text-sm text-fg placeholder:text-fg-dim focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/15";

  return (
    <form onSubmit={handleSubmit} className="panel space-y-4 p-6 sm:p-8">
      {/* Honeypot field for spam bots — hidden from humans */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={update("website")}
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-fg-muted">Name</label>
          <input required value={form.name} onChange={update("name")} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-fg-muted">Email</label>
          <input required type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-fg-muted">Subject</label>
        <input value={form.subject} onChange={update("subject")} placeholder="Research collaboration, opportunity, question…" className={inputClass} />
      </div>
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-fg-muted">Message</label>
        <textarea required value={form.body} onChange={update("body")} rows={5} placeholder="Write your message…" className={`${inputClass} resize-y`} />
      </div>

      {status === "error" && (
        <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4" /> {errorMsg}
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
        {status === "loading" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          <>Send message <Send className="h-4 w-4" /></>
        )}
      </button>
    </form>
  );
}
