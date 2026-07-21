import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical, Cpu, Microscope, Atom } from "lucide-react";
import { getProfile, getResearchAreas, getExperience } from "@/lib/data";
import { DynamicIcon } from "@/components/icon";
import { CrystalLattice } from "@/components/site/crystal-lattice";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal, SpotlightCard } from "@/components/interactive";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research areas and current projects of Rifat Rafiu: DFT, lead-free perovskites, computational materials science and photocatalysis.",
};

const approach = [
  { icon: <Atom className="h-5 w-5" />, title: "First-Principles Modeling", text: "DFT calculations (CASTEP) predict electronic band structure, optical absorption, elastic and phonon properties before any material is made." },
  { icon: <Cpu className="h-5 w-5" />, title: "Device-Level Simulation", text: "SCAPS-1D modeling translates material properties into realistic solar-cell efficiency, guiding which candidates are worth pursuing." },
  { icon: <FlaskConical className="h-5 w-5" />, title: "Synthesis", text: "Hydrothermal and co-precipitation routes realize nanostructured materials such as Co3O4 for photocatalysis." },
  { icon: <Microscope className="h-5 w-5" />, title: "Characterization", text: "XRD, FTIR and SEM connect structure, morphology and measured performance back to the theory." },
];

export default async function ResearchPage() {
  const [profile, areas, experience] = await Promise.all([
    getProfile(),
    getResearchAreas(),
    getExperience(),
  ]);

  const currentProject = experience.find((e) => e.category === "research");

  return (
    <div className="py-16">
      {/* Intro */}
      <div className="container-page relative">
        <div className="pointer-events-none absolute -right-20 -top-10 -z-10 h-80 w-80 opacity-30 animate-float">
          <CrystalLattice className="h-full w-full" />
        </div>
        <Reveal className="max-w-3xl">
          <div className="mono-label">
            <span className="text-fg-dim">03</span>
            <span className="text-fg-dim">/</span> Research
          </div>
          <h1 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
            Designing sustainable energy materials,{" "}
            <span className="text-gradient">atom by atom</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            My research combines quantum-mechanical theory with device
            engineering to accelerate the discovery of lead-free perovskites and
            related materials for high-efficiency, environmentally responsible
            solar energy and optoelectronics.
          </p>
        </Reveal>
      </div>

      {/* Research areas */}
      <section className="container-page mt-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal key={area.title} delay={(i % 3) * 90}>
              <SpotlightCard className="panel panel-hover h-full rounded-xl">
                <div className="group flex h-full flex-col p-7">
                  <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-line-strong bg-graphite-750 text-amber-400 transition-colors group-hover:border-amber-500/40">
                    <DynamicIcon name={area.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="display mt-5 text-xl">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {area.description}
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className="mt-24 border-y border-line bg-graphite-850/40 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Methodology"
            title="A theory-to-device research pipeline"
            align="center"
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {approach.map((step, i) => (
              <Reveal key={step.title} delay={(i % 4) * 80}>
                <div className="relative h-full rounded-xl border border-line bg-graphite-800/70 p-6">
                  <div className="absolute right-5 top-5 font-mono text-xs text-fg-dim">
                    0{i + 1}
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-line-strong bg-graphite-750 text-cyan-300">
                    {step.icon}
                  </span>
                  <h3 className="display mt-4 text-base">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {step.text}
                  </p>
                  {i < approach.length - 1 && (
                    <ArrowRight className="absolute -right-5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-line-strong lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Current project */}
      {currentProject && (
        <section className="container-page mt-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-line bg-graphite-850/60 p-8 sm:p-12">
              <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-30">
                <CrystalLattice className="h-full w-full" />
              </div>
              <div className="relative">
                <div className="mono-label text-cyan-400">Current Project</div>
                <h2 className="display mt-4 max-w-2xl text-2xl sm:text-3xl">
                  {currentProject.description?.split("\n")[0] || currentProject.role}
                </h2>
                <p className="mt-2 font-mono text-xs text-fg-faint">
                  {currentProject.organization} · {currentProject.start_date} –{" "}
                  {currentProject.end_date}
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {currentProject.description
                    ?.split("\n")
                    .filter(Boolean)
                    .slice(1)
                    .map((line, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-fg-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        {line}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* CTA */}
      <section className="container-page mt-16 text-center">
        <Reveal>
          <p className="text-fg-muted">
            {profile.publications_count}+ peer-reviewed papers put these ideas
            into practice.
          </p>
          <Link href="/publications" className="btn-primary mt-5">
            Browse all publications <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
