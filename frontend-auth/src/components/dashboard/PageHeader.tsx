import React from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-serif text-base font-semibold uppercase tracking-[0.2em] text-gold-deep">{eyebrow}</p>
        <h1 className="mt-1 font-display text-4xl uppercase leading-none md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-xl text-sm text-ink/60">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>);

}