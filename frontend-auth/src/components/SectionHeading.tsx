import React from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  tone = "dark",
  id
}: SectionHeadingProps) {
  const centered = align === "center";
  const rule = tone === "dark" ? "bg-ink/25" : "bg-paper/30";
  const text = tone === "dark" ? "text-ink" : "text-paper";

  return (
    <div className={centered ? "text-center" : ""}>
      <div className={`h-px w-16 ${rule} ${centered ? "mx-auto" : ""}`} />
      <p className="mt-5 font-serif text-lg font-semibold uppercase tracking-[0.2em] text-gold">
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-2 font-display text-5xl uppercase leading-[0.95] tracking-tight md:text-6xl ${text}`}>
        
        {title}
      </h2>
    </div>);

}