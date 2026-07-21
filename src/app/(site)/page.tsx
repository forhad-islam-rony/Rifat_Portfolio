import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Quote,
  TrendingUp,
  BookMarked,
  Award,
  Download,
  MapPin,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import {
  getProfile,
  getPublications,
  getResearchAreas,
  getPeerReviews,
  computeMetrics,
} from "@/lib/data";
import { CrystalLattice } from "@/components/site/crystal-lattice";
import { SocialLinks } from "@/components/site/social-links";
import { Avatar } from "@/components/site/avatar";
import { PublicationCard } from "@/components/site/publication-card";
import { SectionHeading } from "@/components/site/section-heading";
import { DynamicIcon } from "@/components/icon";
import { Reveal, Counter, Marquee, SpotlightCard } from "@/components/interactive";

export default async function HomePage() {
  const [profile, publications, areas, peerReviews] = await Promise.all([
    getProfile(),
    getPublications(),
    getResearchAreas(),
    getPeerReviews(),
  ]);

  const derived = computeMetrics(publications);
  const metrics = [
    { label: "Citations", value: profile.citations || derived.citations, icon: Quote, accent: "text-amber-400" },
    { label: "h-index", value: profile.h_index || derived.hIndex, icon: TrendingUp, accent: "text-cyan-400" },
    { label: "i10-index", value: profile.i10_index || derived.i10, icon: Award, accent: "text-amber-400" },
    { label: "Publications", value: profile.publications_count || derived.count, icon: BookMarked, accent: "text-cyan-400" },
    { label: "Journals Reviewed", value: peerReviews.length, icon: ShieldCheck, accent: "text-amber-400" },
  ];

  const featured = publications.filter((p) => p.featured).slice(0, 3);
  const featuredList = featured.length ? featured : publications.slice(0, 3);

  const venues = Array.from(
    new Set(publications.map((p) => p.venue).filter(Boolean) as string[])
  ).slice(0, 10);

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-line [background-size:46px_46px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-radial-fade" />
        <div className="pointer-events-none absolute -right-32 top-20 -z-10 h-[460px] w-[460px] opacity-40 animate-float">
          <CrystalLattice className="h-full w-full" />
        </div>

        <div className="container-page grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <div className="mono-label">
              <span className="text-fg-dim">01</span>
              <span className="text-fg-dim">/</span>
              Researcher
              <span className="ml-1 inline-flex h-1.5 w-1.5 animate-pulse-glow rounded-full bg-amber-500" />
            </div>

            <h1 className="display mt-5 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
              Rifat <span className="text-gradient">Rafiu</span>
            </h1>
            <p className="mt-4 font-mono text-sm text-cyan-300 sm:text-base">
              Density functional theory · Nanomaterials · Energy Materials · Photocatalyst · Computational Chemistry
            </p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted">
              {profile.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/publications" className="btn-primary">
                Explore Publications
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-ghost">
                Get in touch
              </Link>
              {profile.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  <Download className="h-4 w-4" />
                  CV
                </a>
              )}
            </div>

            <div className="mt-8">
              <SocialLinks profile={profile} />
            </div>
          </div>

          {/* Portrait */}
          <div className="animate-fade-up [animation-delay:150ms]">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-amber-500/20 via-transparent to-cyan-400/20 blur-2xl" />
              <div className="panel overflow-hidden rounded-2xl p-2.5">
                <div className="relative overflow-hidden rounded-xl">
                  <Avatar profile={profile} className="aspect-[4/5] w-full" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite-950/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                    <div>
                      <p className="font-display text-sm font-semibold text-white">
                        {profile.degree?.split(" in ")[0] || "B.Sc."} · MSE
                      </p>
                      <p className="flex items-center gap-1 font-mono text-[11px] text-fg-muted">
                        <MapPin className="h-3 w-3" /> {profile.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating credential badge */}
              <div className="absolute -left-6 top-8 hidden animate-float rounded-xl border border-line-strong bg-graphite-800/90 px-3.5 py-2.5 shadow-lift backdrop-blur sm:block [animation-delay:1s]">
                <p className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-300">
                  <BadgeCheck className="h-3.5 w-3.5" /> Research Enthusiast
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Venue marquee */}
        {venues.length > 0 && (
          <div className="relative border-y border-line bg-graphite-850/50 py-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-graphite-900 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-graphite-900 to-transparent" />
            <Marquee items={venues} />
          </div>
        )}
      </section>

      {/* ----------------------------------------------------------- METRICS */}
      <section className="container-page py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 70}>
              <SpotlightCard className="panel panel-hover rounded-xl">
                <div className="flex flex-col gap-2 p-5">
                  <m.icon className={`h-5 w-5 ${m.accent}`} />
                  <span className="font-display text-4xl font-semibold text-fg">
                    <Counter value={m.value} />
                  </span>
                  <span className="mono-dim">{m.label}</span>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- RESEARCH */}
      <section className="container-page py-16">
        <SectionHeading
          index="02"
          eyebrow="Research Focus"
          title="Engineering materials for energy and sustainability technologies"
          description="Exploring quantum-level design of materials for future energy and functional applications."
          align="center"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal key={area.title} delay={(i % 3) * 90}>
              <SpotlightCard className="panel panel-hover h-full rounded-xl">
                <div className="group flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-line-strong bg-graphite-750 text-amber-400 transition-colors group-hover:border-amber-500/40 group-hover:text-amber-300">
                      <DynamicIcon name={area.icon} className="h-6 w-6" />
                    </span>
                    <span className="font-mono text-xs text-fg-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="display mt-5 text-lg">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {area.description}
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/research" className="link-arrow">
            Explore full research profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* --------------------------------------------------- PEER REVIEW */}
      {peerReviews.length > 0 && (
        <section className="container-page py-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-line bg-graphite-850/60 p-8 sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-grid-line [background-size:40px_40px] opacity-40 [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)]" />
              <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <div className="mono-label">
                    <span className="text-fg-dim">03</span>
                    <span className="text-fg-dim">/</span>
                    Editorial Service
                  </div>
                  <h2 className="display mt-4 text-3xl sm:text-4xl">
                    Trusted peer reviewer for{" "}
                    <span className="text-gradient">Elsevier</span> journals
                  </h2>
                  <p className="mt-4 max-w-md leading-relaxed text-fg-muted">
                    Invited to evaluate manuscripts for leading international
                    journals in condensed matter, energy and surface science —
                    a mark of scholarly trust rarely held at undergraduate level.
                  </p>
                </div>
                <div className="grid gap-3">
                  {peerReviews.map((r, i) => (
                    <Reveal key={r.journal} delay={i * 90}>
                      <div className="flex items-center gap-4 rounded-xl border border-line bg-graphite-800/70 p-4 transition-colors hover:border-cyan-400/40">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/5 text-cyan-300">
                          <ShieldCheck className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-semibold text-fg">
                            {r.journal}
                          </p>
                          <p className="font-mono text-xs text-fg-faint">
                            {r.publisher}
                            {r.period ? ` · ${r.period}` : ""}
                          </p>
                        </div>
                        <span className="chip border-amber-500/30 text-amber-400">
                          {r.reviews} review{r.reviews === 1 ? "" : "s"}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* --------------------------------------------------- FEATURED PUBS */}
      <section className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            index="04"
            eyebrow="Selected Work"
            title="Featured publications"
            description="Peer-reviewed research in leading materials and chemistry journals."
          />
          <Reveal>
            <Link href="/publications" className="btn-ghost">
              All publications
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {featuredList.map((pub, i) => (
            <Reveal key={pub.title} delay={(i % 3) * 90}>
              <PublicationCard pub={pub} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- CTA */}
      <section className="container-page py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-graphite-800 to-graphite-900 px-8 py-14 text-center sm:px-16">
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 opacity-30">
              <CrystalLattice className="h-full w-full" />
            </div>
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 opacity-30">
              <CrystalLattice className="h-full w-full" />
            </div>
            <div className="relative">
              <div className="mono-label justify-center">Open to collaboration</div>
              <h2 className="display mx-auto mt-4 max-w-2xl text-3xl sm:text-4xl">
                Let&apos;s advance sustainable energy materials together
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-fg-muted">
                I welcome research collaborations, graduate opportunities, and
                discussions on computational materials design.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn-primary">
                  Contact me <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about" className="btn-ghost">
                  More about me
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
