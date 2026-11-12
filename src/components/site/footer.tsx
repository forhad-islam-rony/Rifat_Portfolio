import Link from "next/link";
import { Hexagon } from "lucide-react";
import type { Profile } from "@/lib/types";
import { SocialLinks } from "./social-links";

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-28 border-t border-line bg-graphite-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-graphite-800 text-amber-500">
              <Hexagon className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="font-display text-lg font-semibold text-fg">
              {profile.full_name}
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            {profile.headline}. {profile.department}, {profile.institution}.
          </p>
          <SocialLinks profile={profile} size="sm" className="mt-5" />
        </div>

        <div>
          <h4 className="mono-dim">Navigate</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: "/about", label: "About" },
              { href: "/research", label: "Research" },
              { href: "/publications", label: "Publications" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-fg-muted transition-colors hover:text-amber-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mono-dim">Contact</h4>
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 block break-all text-sm text-fg-muted transition-colors hover:text-amber-400"
            >
              {profile.email}
            </a>
          )}
          {profile.location && (
            <p className="mt-2 text-sm text-fg-faint">{profile.location}</p>
          )}
          <Link
            href="/login"
            className="mt-4 inline-block font-mono text-xs text-fg-dim transition-colors hover:text-fg-muted"
          >
            ↳ admin
          </Link>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 font-mono text-xs text-fg-dim sm:flex-row">
          <p>© {year} {profile.full_name} — all rights reserved</p>
          <p>Built with Next.js · MongoDB · Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
