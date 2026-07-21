import type { Metadata } from "next";
import {
  GraduationCap,
  Briefcase,
  Award,
  Wrench,
  MapPin,
  Mail,
  BadgeCheck,
  ShieldCheck,
  ScrollText,
  Mic,
  Factory,
  Users,
} from "lucide-react";
import {
  getProfile,
  getEducation,
  getExperience,
  getSkills,
  getAwards,
  getCertifications,
  getPeerReviews,
} from "@/lib/data";
import { Avatar } from "@/components/site/avatar";
import { SocialLinks } from "@/components/site/social-links";
import { Reveal } from "@/components/interactive";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, education, research experience, skills, certifications and honors of Rifat Rafiu.",
};

const categoryLabel: Record<string, string> = {
  research: "research",
  training: "training",
  activity: "activity",
  teaching: "teaching",
};

const certIcon: Record<string, React.ReactNode> = {
  conference: <Mic className="h-5 w-5" />,
  course: <ScrollText className="h-5 w-5" />,
  training: <Factory className="h-5 w-5" />,
  recognition: <Users className="h-5 w-5" />,
};

export default async function AboutPage() {
  const [profile, education, experience, skills, awards, certifications, peerReviews] =
    await Promise.all([
      getProfile(),
      getEducation(),
      getExperience(),
      getSkills(),
      getAwards(),
      getCertifications(),
      getPeerReviews(),
    ]);

  return (
    <div className="container-page py-16">
      {/* Header */}
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <Reveal>
          <div className="relative mx-auto max-w-xs">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-amber-500/20 to-cyan-400/20 blur-2xl" />
            <div className="panel overflow-hidden rounded-2xl p-2.5">
              <Avatar profile={profile} className="aspect-[4/5] w-full rounded-xl" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="mono-label">
            <span className="text-fg-dim">/</span> About
          </div>
          <h1 className="display mt-4 text-4xl sm:text-5xl">
            {profile.full_name}
          </h1>
          <p className="mt-2 font-mono text-sm text-cyan-300">
            {profile.headline}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-amber-500" /> {profile.location}
            </span>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 hover:text-amber-400"
              >
                <Mail className="h-4 w-4 text-amber-500" /> {profile.email}
              </a>
            )}
          </div>
          <div className="mt-6 space-y-4 leading-relaxed text-fg-muted">
            {(profile.bio || "").split("\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <SocialLinks profile={profile} className="mt-6" />
        </Reveal>
      </div>

      {/* Education */}
      <Section index="01" title="Education" icon={<GraduationCap className="h-5 w-5" />}>
        <div className="space-y-4">
          {education.map((ed) => (
            <div key={ed.degree} className="panel rounded-xl p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="display text-lg">{ed.degree}</h3>
                <span className="font-mono text-xs text-amber-400">
                  {ed.start_date} – {ed.end_date}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-cyan-300">
                {ed.institution}
              </p>
              {ed.grade && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-1 font-mono text-xs text-amber-400">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {ed.grade}
                </p>
              )}
              {ed.description && (
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {ed.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Peer review */}
      {peerReviews.length > 0 && (
        <Section index="02" title="Peer Review Service" icon={<ShieldCheck className="h-5 w-5" />}>
          <div className="grid gap-4 sm:grid-cols-3">
            {peerReviews.map((r) => (
              <div
                key={r.journal}
                className="panel rounded-xl p-5 transition-colors hover:border-cyan-400/40"
              >
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                <h3 className="display mt-3 text-base leading-snug">
                  {r.journal}
                </h3>
                <p className="mt-1 font-mono text-xs text-fg-faint">
                  {r.publisher}
                  {r.period ? ` · ${r.period}` : ""}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Experience */}
      <Section index="03" title="Experience & Activities" icon={<Briefcase className="h-5 w-5" />}>
        <ol className="relative space-y-8 border-l border-line-strong pl-8">
          {experience.map((exp) => (
            <li key={exp.role + exp.organization} className="relative">
              <span className="absolute -left-[37px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-graphite-900 bg-amber-500" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="display text-lg">{exp.role}</h3>
                <span className="font-mono text-xs text-amber-400">
                  {exp.start_date} – {exp.end_date}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-cyan-300">
                {exp.organization}
                {exp.location ? ` · ${exp.location}` : ""}
                <span className="ml-2 chip">{categoryLabel[exp.category] || exp.category}</span>
              </p>
              {exp.description && (
                <ul className="mt-3 space-y-1.5">
                  {exp.description.split("\n").filter(Boolean).map((line, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section index="04" title="Certifications & Presentations" icon={<ScrollText className="h-5 w-5" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            {certifications.map((c) => (
              <div key={c.title} className="panel panel-hover rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-graphite-750 text-cyan-300">
                    {certIcon[c.category] || <ScrollText className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0">
                    <h3 className="display text-base leading-snug">{c.title}</h3>
                    <p className="mt-1 font-mono text-xs text-fg-faint">
                      {c.issuer}
                      {c.date ? ` · ${c.date}` : ""}
                    </p>
                    {c.description && (
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                        {c.description}
                      </p>
                    )}
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-arrow mt-2 text-xs"
                      >
                        View credential →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills */}
      <Section index="05" title="Technical Skills" icon={<Wrench className="h-5 w-5" />}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.category} className="panel rounded-xl p-6">
              <h3 className="mono-dim text-amber-500">{group.category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-line-strong bg-graphite-750 px-3 py-1.5 text-sm text-fg"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Awards */}
      {awards.length > 0 && (
        <Section index="06" title="Awards & Honors" icon={<Award className="h-5 w-5" />}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {awards.map((a) => (
              <div key={a.title} className="panel flex gap-4 rounded-xl p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400">
                  <Award className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-fg">
                    {a.title}
                  </h3>
                  {a.issuer && <p className="mt-0.5 text-sm text-fg-faint">{a.issuer}</p>}
                  {a.description && (
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                      {a.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  index,
  title,
  icon,
  children,
}: {
  index: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20">
      <Reveal className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong bg-graphite-800 text-amber-500">
          {icon}
        </span>
        <div>
          <span className="font-mono text-xs text-fg-dim">{index} /</span>
          <h2 className="display text-2xl sm:text-3xl">{title}</h2>
        </div>
      </Reveal>
      <Reveal delay={80}>{children}</Reveal>
    </section>
  );
}
