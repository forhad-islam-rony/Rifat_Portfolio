import { ArrowUpRight, Quote } from "lucide-react";
import type { Publication } from "@/lib/types";
import { SpotlightCard } from "@/components/interactive";

function highlightAuthors(authors: string) {
  const parts = authors.split(/(R\.\s?Rafiu|Rafiu,?\s?R\.?|Rifat Rafiu)/g);
  return parts.map((part, i) =>
    /rafiu/i.test(part) ? (
      <strong key={i} className="font-semibold text-amber-400">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function PublicationCard({
  pub,
  index,
}: {
  pub: Publication;
  index?: number;
}) {
  const Wrapper: any = pub.url ? "a" : "div";
  const wrapperProps = pub.url
    ? { href: pub.url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <SpotlightCard className="panel panel-hover h-full rounded-xl">
      <Wrapper
        {...wrapperProps}
        className="group flex h-full flex-col gap-3.5 p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip border-cyan-400/20 text-cyan-300">
              {pub.type === "conference" ? "conference" : "journal"}
            </span>
            {pub.year && <span className="chip">{pub.year}</span>}
            {pub.featured && (
              <span className="chip border-amber-500/30 text-amber-400">
                ★ featured
              </span>
            )}
          </div>
          {typeof index === "number" && (
            <span className="font-mono text-xs text-fg-dim">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug text-fg transition-colors group-hover:text-amber-300">
          {pub.title}
        </h3>

        <p className="text-sm leading-relaxed text-fg-muted">
          {highlightAuthors(pub.authors)}
        </p>

        {pub.venue && (
          <p className="text-sm text-cyan-300/90">
            {pub.venue}
            {pub.volume ? (
              <span className="text-fg-faint">, {pub.volume}</span>
            ) : (
              ""
            )}
          </p>
        )}

        {pub.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {pub.tags.map((t) => (
              <span
                key={t}
                className="rounded border border-line bg-graphite-750/60 px-2 py-0.5 font-mono text-[10px] text-fg-faint"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-line pt-3.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-fg-muted">
            <Quote className="h-3.5 w-3.5 text-amber-500" />
            {pub.citations} cited
          </span>
          {pub.url && (
            <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-amber-400 transition-transform group-hover:translate-x-0.5">
              {pub.doi ? "DOI" : "link"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </Wrapper>
    </SpotlightCard>
  );
}
