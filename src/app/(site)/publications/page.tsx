import type { Metadata } from "next";
import { Quote, TrendingUp, Award, BookMarked, ExternalLink } from "lucide-react";
import { getProfile, getPublications, computeMetrics } from "@/lib/data";
import { PublicationsExplorer } from "@/components/site/publications-explorer";
import { Reveal, Counter } from "@/components/interactive";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Complete list of peer-reviewed journal and conference publications by Rifat Rafiu.",
};

export default async function PublicationsPage() {
  const [profile, publications] = await Promise.all([
    getProfile(),
    getPublications(),
  ]);
  const derived = computeMetrics(publications);

  const stats = [
    { label: "Publications", value: profile.publications_count || derived.count, icon: BookMarked },
    { label: "Citations", value: profile.citations || derived.citations, icon: Quote },
    { label: "h-index", value: profile.h_index || derived.hIndex, icon: TrendingUp },
    { label: "i10-index", value: profile.i10_index || derived.i10, icon: Award },
  ];

  return (
    <div className="container-page py-16">
      <Reveal className="max-w-3xl">
        <div className="mono-label">
          <span className="text-fg-dim">04</span>
          <span className="text-fg-dim">/</span> Publications
        </div>
        <h1 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
          Peer-reviewed <span className="text-gradient">research</span>
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          A complete, continually updated record of published work in materials
          science, computational chemistry and photovoltaics.
        </p>
        {profile.google_scholar && (
          <a
            href={profile.google_scholar}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow mt-4 text-sm"
          >
            View on Google Scholar <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </Reveal>

      {/* Stats */}
      <Reveal delay={80} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel flex flex-col gap-1.5 p-5">
            <s.icon className="h-5 w-5 text-amber-400" />
            <span className="font-display text-3xl font-semibold text-fg">
              <Counter value={s.value} />
            </span>
            <span className="mono-dim">{s.label}</span>
          </div>
        ))}
      </Reveal>

      <div className="mt-12">
        <PublicationsExplorer publications={publications} />
      </div>
    </div>
  );
}
