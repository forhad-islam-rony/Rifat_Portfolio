import { GraduationCap, Linkedin, Github, Twitter, Mail, Facebook } from "lucide-react";
import type { Profile } from "@/lib/types";

function ResearchGateIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.586 0H4.414A4.414 4.414 0 0 0 0 4.414v15.172A4.414 4.414 0 0 0 4.414 24h15.172A4.414 4.414 0 0 0 24 19.586V4.414A4.414 4.414 0 0 0 19.586 0zM8.706 15.616H7.32V8.53c.68-.03 1.44-.05 2.29-.05 1.2 0 2.02.2 2.57.63.5.4.78 1 .78 1.77 0 .84-.5 1.57-1.4 1.9v.03c.63.22.98.79 1.2 1.66.26 1.05.44 1.75.6 2.03h-1.43c-.13-.2-.3-.8-.52-1.78-.22-.98-.6-1.3-1.45-1.32h-.85v3.1zm.02-4.12h.9c1.02 0 1.66-.5 1.66-1.28 0-.8-.6-1.24-1.6-1.24-.42 0-.72.03-.9.06v2.46h-.06z" />
    </svg>
  );
}

function OrcidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
  );
}

export function SocialLinks({
  profile,
  size = "md",
  className = "",
}: {
  profile: Profile;
  size?: "sm" | "md";
  className?: string;
}) {
  const iconClass = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";
  const links = [
    { href: profile.google_scholar, label: "Google Scholar", icon: <GraduationCap className={iconClass} /> },
    { href: profile.researchgate, label: "ResearchGate", icon: <ResearchGateIcon className={iconClass} /> },
    { href: profile.orcid, label: "ORCID", icon: <OrcidIcon className={iconClass} /> },
    { href: profile.linkedin, label: "LinkedIn", icon: <Linkedin className={iconClass} /> },
    { href: profile.facebook, label: "Facebook", icon: <Facebook className={iconClass} /> },
    { href: profile.github, label: "GitHub", icon: <Github className={iconClass} /> },
    { href: profile.twitter, label: "Twitter / X", icon: <Twitter className={iconClass} /> },
    { href: profile.email ? `mailto:${profile.email}` : null, label: "Email", icon: <Mail className={iconClass} /> },
  ].filter((l) => l.href);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href as string}
          target={l.href?.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={l.label}
          title={l.label}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong bg-graphite-800 text-fg-muted transition-all hover:-translate-y-0.5 hover:border-amber-500/50 hover:text-amber-400 hover:shadow-glow"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}
