"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Publication } from "@/lib/types";
import { PublicationCard } from "./publication-card";

type SortKey = "year" | "citations";

export function PublicationsExplorer({
  publications,
}: {
  publications: Publication[];
}) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("year");

  const years = useMemo(
    () =>
      Array.from(
        new Set(publications.map((p) => p.year).filter(Boolean) as number[])
      ).sort((a, b) => b - a),
    [publications]
  );

  const filtered = useMemo(() => {
    let list = publications.filter((p) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        (p.venue || "").toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesYear = year === "all" || String(p.year) === year;
      const matchesType = type === "all" || p.type === type;
      return matchesQuery && matchesYear && matchesType;
    });
    list = [...list].sort((a, b) =>
      sort === "citations"
        ? b.citations - a.citations
        : (b.year || 0) - (a.year || 0)
    );
    return list;
  }, [publications, query, year, type, sort]);

  const selectClass =
    "rounded-lg border border-line-strong bg-graphite-800 px-3 py-2.5 font-mono text-xs text-fg focus:border-amber-500/60 focus:outline-none";

  return (
    <div>
      {/* Controls */}
      <div className="sticky top-16 z-30 rounded-xl border border-line bg-graphite-850/80 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-dim" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, author, journal or topic…"
              className="w-full rounded-lg border border-line-strong bg-graphite-800 py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-fg-dim focus:border-amber-500/60 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-fg-dim" />
            <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass} aria-label="Filter by year">
              <option value="all">all years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass} aria-label="Filter by type">
              <option value="all">all types</option>
              <option value="journal">journal</option>
              <option value="conference">conference</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass} aria-label="Sort">
              <option value="year">newest</option>
              <option value="citations">most cited</option>
            </select>
          </div>
        </div>
      </div>

      <p className="mt-5 font-mono text-xs text-fg-faint">
        showing <span className="text-amber-400">{filtered.length}</span> of{" "}
        {publications.length} publications
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {filtered.map((pub, i) => (
          <PublicationCard key={pub.id || pub.title} pub={pub} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 rounded-xl border border-dashed border-line-strong py-16 text-center font-mono text-sm text-fg-dim">
          No publications match your filters.
        </div>
      )}
    </div>
  );
}
