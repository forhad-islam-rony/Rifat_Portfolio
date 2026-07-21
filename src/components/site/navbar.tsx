"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Hexagon } from "lucide-react";
import { ScrollProgress } from "@/components/interactive";

const nav = [
  { href: "/", label: "Home", idx: "01" },
  { href: "/about", label: "About", idx: "02" },
  { href: "/research", label: "Research", idx: "03" },
  { href: "/publications", label: "Publications", idx: "04" },
  { href: "/contact", label: "Contact", idx: "05" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <ScrollProgress />
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-line bg-graphite-900/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-graphite-800 text-amber-500 transition-colors group-hover:border-amber-500/50">
              <Hexagon className="h-5 w-5" strokeWidth={2.2} />
              <span className="absolute inset-0 rounded-lg bg-amber-500/0 transition-colors group-hover:bg-amber-500/5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-semibold text-fg">
                Rifat Rafiu
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-500">
                MSE · Researcher
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-fg"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                <span className="mr-1.5 font-mono text-[10px] text-fg-dim group-hover:text-amber-500">
                  {item.idx}
                </span>
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-amber-500 to-cyan-400" />
                )}
              </Link>
            ))}
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong bg-graphite-800 text-fg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-line bg-graphite-900 md:hidden">
            <div className="container-page flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-graphite-800 text-fg"
                      : "text-fg-muted"
                  }`}
                >
                  <span className="font-mono text-xs text-amber-500">
                    {item.idx}
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
