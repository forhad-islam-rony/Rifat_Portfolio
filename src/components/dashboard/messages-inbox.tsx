"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, Reply } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/types";
import { PageHeader, EmptyState, Spinner } from "./ui";

export function MessagesInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages((data as Message[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(m: Message) {
    const supabase = createClient();
    await supabase
      .from("messages")
      .update({ is_read: !m.is_read })
      .eq("id", m.id!);
    load();
  }

  async function remove(m: Message) {
    if (!confirm("Delete this message?")) return;
    const supabase = createClient();
    await supabase.from("messages").delete().eq("id", m.id!);
    load();
  }

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <>
      <PageHeader
        title="Messages"
        description={
          messages.length
            ? `${messages.length} message${messages.length === 1 ? "" : "s"} · ${unread} unread`
            : "Enquiries submitted through your contact form."
        }
      />

      {loading ? (
        <Spinner />
      ) : messages.length === 0 ? (
        <EmptyState message="No messages yet. Submissions from your contact form will appear here." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border bg-graphite-800/70 p-5 transition-colors ${
                m.is_read ? "border-line" : "border-amber-500/40 bg-amber-500/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-fg">{m.name}</p>
                    {!m.is_read && (
                      <span className="rounded-full bg-amber-500 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-graphite-950">
                        New
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-cyan-300 hover:underline"
                  >
                    {m.email}
                  </a>
                </div>
                <span className="shrink-0 font-mono text-xs text-fg-dim">
                  {m.created_at
                    ? new Date(m.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>

              {m.subject && (
                <p className="mt-3 text-sm font-medium text-fg">{m.subject}</p>
              )}
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-fg-muted">
                {m.body}
              </p>

              <div className="mt-4 flex gap-2 border-t border-line pt-3">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent(
                    "Re: " + (m.subject || "Your message")
                  )}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-graphite-700"
                >
                  <Reply className="h-3.5 w-3.5" /> Reply
                </a>
                <button
                  onClick={() => toggleRead(m)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-fg-muted hover:bg-graphite-700"
                >
                  {m.is_read ? (
                    <>
                      <Mail className="h-3.5 w-3.5" /> Mark unread
                    </>
                  ) : (
                    <>
                      <MailOpen className="h-3.5 w-3.5" /> Mark read
                    </>
                  )}
                </button>
                <button
                  onClick={() => remove(m)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
