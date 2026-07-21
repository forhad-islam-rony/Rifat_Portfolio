"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  User,
  BookMarked,
  FlaskConical,
  GraduationCap,
  Briefcase,
  Wrench,
  Award,
  Inbox,
  LogOut,
  Hexagon,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ScrollText,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/publications", label: "Publications", icon: BookMarked },
  { href: "/dashboard/research", label: "Research Areas", icon: FlaskConical },
  { href: "/dashboard/peer-reviews", label: "Peer Reviews", icon: ShieldCheck },
  { href: "/dashboard/certifications", label: "Certifications", icon: ScrollText },
  { href: "/dashboard/education", label: "Education", icon: GraduationCap },
  { href: "/dashboard/experience", label: "Experience", icon: Briefcase },
  { href: "/dashboard/skills", label: "Skills", icon: Wrench },
  { href: "/dashboard/awards", label: "Awards", icon: Award },
  { href: "/dashboard/messages", label: "Messages", icon: Inbox },
];

export function DashboardShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href) && href !== "/dashboard";

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {links.map((l) => {
        const active =
          l.exact ? pathname === l.href : isActive(l.href, l.exact);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-amber-500 text-graphite-950"
                : "text-fg-muted hover:bg-graphite-800 hover:text-fg"
            }`}
          >
            <l.icon className="h-[18px] w-[18px]" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-graphite-900 lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-graphite-950 p-4 lg:flex">
        <Link href="/dashboard" className="mb-6 flex items-center gap-2.5 px-2 pt-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-graphite-800 text-amber-500">
            <Hexagon className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="leading-none">
            <p className="font-display text-base font-semibold text-fg">Dashboard</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-500">
              Rifat Rafiu
            </p>
          </div>
        </Link>
        {nav}
        <SidebarFooter userEmail={userEmail} onSignOut={signOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-graphite-950 px-4 py-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 text-fg">
          <Hexagon className="h-5 w-5 text-amber-500" strokeWidth={2.2} />
          <span className="font-display font-semibold">Dashboard</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-graphite-800 text-fg"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-1 border-b border-line bg-graphite-950 p-4 lg:hidden">
          {nav}
          <SidebarFooter userEmail={userEmail} onSignOut={signOut} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

function SidebarFooter({
  userEmail,
  onSignOut,
}: {
  userEmail?: string;
  onSignOut: () => void;
}) {
  return (
    <div className="mt-4 space-y-1 border-t border-line pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted hover:bg-graphite-800 hover:text-fg"
      >
        <ExternalLink className="h-[18px] w-[18px]" />
        View site
      </Link>
      <button
        onClick={onSignOut}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Sign out
      </button>
      {userEmail && (
        <p className="truncate px-3 pt-2 font-mono text-[11px] text-fg-dim">{userEmail}</p>
      )}
    </div>
  );
}
