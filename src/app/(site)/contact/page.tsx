import type { Metadata } from "next";
import { Mail, MapPin, GraduationCap, Building2 } from "lucide-react";
import { getProfile } from "@/lib/data";
import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/site/social-links";
import { Reveal } from "@/components/interactive";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Rifat Rafiu for research collaboration and opportunities.",
};

export default async function ContactPage() {
  const profile = await getProfile();

  const details = [
    profile.email && { icon: <Mail className="h-5 w-5" />, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: <MapPin className="h-5 w-5" />, label: "Location", value: profile.location },
    { icon: <Building2 className="h-5 w-5" />, label: "Department", value: profile.department },
    { icon: <GraduationCap className="h-5 w-5" />, label: "Institution", value: profile.institution },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string }[];

  return (
    <div className="container-page py-16">
      <Reveal className="max-w-2xl">
        <div className="mono-label">
          <span className="text-fg-dim">05</span>
          <span className="text-fg-dim">/</span> Contact
        </div>
        <h1 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
          Let&apos;s <span className="text-gradient">connect</span>
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Whether it&apos;s a research collaboration, a graduate opportunity, or a
          question about my work, I&apos;d be glad to hear from you.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="space-y-4">
            {details.map((d) => (
              <div key={d.label} className="panel flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-graphite-750 text-amber-400">
                  {d.icon}
                </span>
                <div>
                  <p className="mono-dim">{d.label}</p>
                  {d.href ? (
                    <a href={d.href} className="break-all font-medium text-fg hover:text-amber-400">
                      {d.value}
                    </a>
                  ) : (
                    <p className="font-medium text-fg">{d.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="panel p-5">
              <p className="mono-dim">Find me online</p>
              <SocialLinks profile={profile} className="mt-3" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ContactForm toEmail={profile.email} />
        </Reveal>
      </div>
    </div>
  );
}
