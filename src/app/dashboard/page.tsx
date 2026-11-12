import Link from "next/link";
import {
  BookMarked,
  FlaskConical,
  GraduationCap,
  Briefcase,
  Inbox,
  Quote,
  ArrowRight,
  User,
  ExternalLink,
  ShieldCheck,
  ScrollText,
} from "lucide-react";
import { getDb, pingDb } from "@/lib/server/mongodb";
import { friendlyDbError } from "@/lib/server/session";
import { BackupPanel } from "@/components/dashboard/backup-panel";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const health = await pingDb();

  let pubs = 0,
    reviews = 0,
    unread = 0;
  type ProfileSummary = { full_name?: string; citations?: number; h_index?: number };
  let profile = null as ProfileSummary | null;

  if (health.ok) {
    const db = await getDb();
    [pubs, reviews, unread, profile] = await Promise.all([
      db.collection("publications").countDocuments(),
      db.collection("peer_reviews").countDocuments(),
      db.collection("messages").countDocuments({ is_read: false }),
      db.collection("profile").findOne({}, { sort: { _id: 1 }, projection: { full_name: 1, citations: 1, h_index: 1 } }) as Promise<ProfileSummary | null>,
    ]);
  }

  const stats = [
    { label: "Publications", value: pubs, href: "/dashboard/publications", icon: BookMarked },
    { label: "Citations", value: profile?.citations ?? 0, href: "/dashboard/profile", icon: Quote },
    { label: "Journals Reviewed", value: reviews, href: "/dashboard/peer-reviews", icon: ShieldCheck },
    { label: "Unread Messages", value: unread, href: "/dashboard/messages", icon: Inbox, highlight: unread > 0 },
  ];

  const quickLinks = [
    { label: "Edit Profile & Metrics", href: "/dashboard/profile", icon: User, desc: "Bio, photo, CV, citation metrics and links" },
    { label: "Manage Publications", href: "/dashboard/publications", icon: BookMarked, desc: "Add or update journal & conference papers" },
    { label: "Peer Reviews", href: "/dashboard/peer-reviews", icon: ShieldCheck, desc: "Journals you have reviewed for" },
    { label: "Certifications", href: "/dashboard/certifications", icon: ScrollText, desc: "Courses, training and presentations" },
    { label: "Research Areas", href: "/dashboard/research", icon: FlaskConical, desc: "Curate your featured research focus areas" },
    { label: "Experience", href: "/dashboard/experience", icon: Briefcase, desc: "Research, training and activities" },
    { label: "Education", href: "/dashboard/education", icon: GraduationCap, desc: "Academic qualifications" },
    { label: "Messages", href: "/dashboard/messages", icon: Inbox, desc: "Read enquiries from your contact form" },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="mono-label">Welcome back</p>
        <h1 className="display mt-2 text-2xl sm:text-3xl">
          {profile?.full_name || "Dashboard"} Overview
        </h1>
        <p className="mt-1.5 text-sm text-fg-muted">
          Everything on your public portfolio can be managed here — no code required.
        </p>
      </div>

      {!health.ok && (
        <div className="mb-8 rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-200">
          <p className="font-semibold text-red-300">Database not connected</p>
          <p className="mt-1 leading-relaxed">
            {friendlyDbError(health.error)} Your public site is showing the built-in default
            content until this is fixed. Changes can&apos;t be saved right now.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group rounded-xl border bg-graphite-800/70 p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow ${
              s.highlight ? "border-amber-500/50" : "border-line hover:border-amber-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-amber-400" />
              <ArrowRight className="h-4 w-4 text-fg-dim transition-colors group-hover:text-amber-400" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold text-fg">{s.value}</p>
            <p className="mono-dim">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="display mb-4 mt-10 text-lg">Manage content</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="group flex items-start gap-4 rounded-xl border border-line bg-graphite-800/70 p-5 transition-all hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-glow"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-graphite-750 text-amber-400 transition-colors group-hover:border-amber-500/40">
              <q.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-semibold text-fg">{q.label}</p>
              <p className="mt-0.5 text-sm text-fg-muted">{q.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Backup / restore */}
      <BackupPanel />

      {/* View site */}
      <div className="mt-10 flex items-center justify-between rounded-xl border border-line bg-gradient-to-br from-graphite-800 to-graphite-900 p-6">
        <div>
          <p className="font-display text-lg font-semibold text-fg">Your live portfolio</p>
          <p className="text-sm text-fg-muted">See how visitors experience your published site.</p>
        </div>
        <Link href="/" target="_blank" className="btn-primary shrink-0">
          Open site <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
