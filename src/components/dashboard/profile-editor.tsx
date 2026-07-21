"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Upload, CheckCircle2, FileText, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { PageHeader, DashCard, Field, TextInput, TextArea, Spinner } from "./ui";

const sections: {
  heading: string;
  fields: { name: keyof Profile; label: string; type?: "text" | "textarea" | "number"; span?: boolean; hint?: string }[];
}[] = [
  {
    heading: "Identity",
    fields: [
      { name: "full_name", label: "Full name" },
      { name: "headline", label: "Headline / role" },
      { name: "tagline", label: "Hero tagline", type: "textarea", span: true },
      { name: "bio", label: "About / biography", type: "textarea", span: true, hint: "Use blank lines for paragraphs" },
    ],
  },
  {
    heading: "Affiliation",
    fields: [
      { name: "institution", label: "Institution" },
      { name: "department", label: "Department" },
      { name: "degree", label: "Degree" },
      { name: "cgpa", label: "CGPA" },
      { name: "location", label: "Location" },
      { name: "email", label: "Email" },
      { name: "phone", label: "Phone" },
    ],
  },
  {
    heading: "Citation metrics",
    fields: [
      { name: "citations", label: "Citations", type: "number" },
      { name: "h_index", label: "h-index", type: "number" },
      { name: "i10_index", label: "i10-index", type: "number" },
      { name: "publications_count", label: "Publications count", type: "number" },
    ],
  },
  {
    heading: "Links",
    fields: [
      { name: "google_scholar", label: "Google Scholar URL", span: true },
      { name: "researchgate", label: "ResearchGate URL", span: true },
      { name: "orcid", label: "ORCID URL", span: true },
      { name: "linkedin", label: "LinkedIn URL", span: true },
      { name: "facebook", label: "Facebook URL", span: true },
      { name: "github", label: "GitHub URL", span: true },
      { name: "twitter", label: "Twitter / X URL", span: true },
    ],
  },
];

export function ProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<"photo" | "cv" | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
    setProfile(data as Profile);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => (p ? { ...p, [key]: value } : p));
    setSaved(false);
  }

  async function upload(kind: "photo" | "cv", file: File) {
    if (!profile) return;
    setUploading(kind);
    setError("");
    try {
      const supabase = createClient();
      const bucket = kind === "photo" ? "avatars" : "documents";
      const ext = file.name.split(".").pop();
      const path = `${kind}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      set(kind === "photo" ? "photo_url" : "cv_url", data.publicUrl as any);
    } catch (err: any) {
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    if (!profile) return;
    setSaving(true);
    setError("");
    try {
      const supabase = createClient();
      const { id, updated_at, ...rest } = profile as any;
      const payload = { ...rest, updated_at: new Date().toISOString() };
      let result;
      if (id) {
        result = await supabase.from("profile").update(payload).eq("id", id);
      } else {
        result = await supabase.from("profile").insert(payload);
      }
      if (result.error) throw result.error;
      setSaved(true);
      await load();
    } catch (err: any) {
      setError(err?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;
  if (!profile)
    return (
      <div className="rounded-xl border border-dashed border-line-strong p-8 text-center text-fg-muted">
        No profile row found. Run <code className="font-mono">supabase/seed.sql</code> to
        create one, then refresh.
      </div>
    );

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your headline information, metrics, links, photo and CV."
        action={
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Saved
              </>
            ) : (
              "Save changes"
            )}
          </button>
        }
      />

      {/* Uploads */}
      <DashCard className="mb-6 p-6">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-amber-500">
          Media
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <UploadTile
            label="Profile photo"
            icon={<ImageIcon className="h-5 w-5" />}
            currentUrl={profile.photo_url}
            accept="image/*"
            busy={uploading === "photo"}
            onFile={(f) => upload("photo", f)}
            isImage
          />
          <UploadTile
            label="CV (PDF)"
            icon={<FileText className="h-5 w-5" />}
            currentUrl={profile.cv_url}
            accept="application/pdf"
            busy={uploading === "cv"}
            onFile={(f) => upload("cv", f)}
          />
        </div>
      </DashCard>

      <div className="space-y-6">
        {sections.map((section) => (
          <DashCard key={section.heading} className="p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-amber-500">
              {section.heading}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((f) => (
                <div key={String(f.name)} className={f.span ? "sm:col-span-2" : ""}>
                  <Field label={f.label} hint={f.hint}>
                    {f.type === "textarea" ? (
                      <TextArea
                        rows={f.name === "bio" ? 6 : 2}
                        value={(profile[f.name] as string) ?? ""}
                        onChange={(e) => set(f.name, e.target.value as any)}
                      />
                    ) : (
                      <TextInput
                        type={f.type === "number" ? "number" : "text"}
                        value={(profile[f.name] as any) ?? ""}
                        onChange={(e) =>
                          set(
                            f.name,
                            (f.type === "number"
                              ? Number(e.target.value)
                              : e.target.value) as any
                          )
                        }
                      />
                    )}
                  </Field>
                </div>
              ))}
            </div>
          </DashCard>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </>
  );
}

function UploadTile({
  label,
  icon,
  currentUrl,
  accept,
  busy,
  onFile,
  isImage = false,
}: {
  label: string;
  icon: React.ReactNode;
  currentUrl: string | null;
  accept: string;
  busy: boolean;
  onFile: (file: File) => void;
  isImage?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line-strong bg-graphite-900 p-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line-strong bg-graphite-800 text-amber-400">
        {isImage && currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          icon
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{label}</p>
        {currentUrl ? (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-xs text-amber-500 hover:underline"
          >
            View current
          </a>
        ) : (
          <p className="text-xs text-fg-dim">Not uploaded yet</p>
        )}
        <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line-strong bg-graphite-800 px-3 py-1.5 text-xs font-semibold text-fg hover:border-amber-500/50 hover:text-amber-400">
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}
