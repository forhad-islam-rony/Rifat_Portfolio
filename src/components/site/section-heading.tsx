import { Reveal } from "@/components/interactive";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <div
        className={`mono-label ${align === "center" ? "justify-center" : ""}`}
      >
        {index && <span className="text-fg-dim">{index}</span>}
        {index && <span className="text-fg-dim">/</span>}
        {eyebrow}
      </div>
      <h2 className="display mt-4 text-3xl sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 leading-relaxed text-fg-muted">{description}</p>
      )}
    </Reveal>
  );
}
