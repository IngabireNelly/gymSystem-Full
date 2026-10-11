import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}

export function AuthLayout({ eyebrow, title, description, children, footer, wide = false }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-cream text-ink">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[24vw] uppercase leading-none text-ink/[0.04]">
        
        GymRental
      </span>

      <header className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link to="/" className="font-display text-2xl uppercase tracking-wide">
          GymRental
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/60 transition-colors duration-150 hover:text-ink">
          
          <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Back to site
        </Link>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-5 py-10">
        <div className={`w-full ${wide ? "max-w-lg" : "max-w-md"}`}>
          <div className="mb-8 text-center">
            <div className="mx-auto h-px w-16 bg-ink/25" />
            <p className="mt-5 font-serif text-lg font-semibold uppercase tracking-[0.2em] text-gold-deep">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-display text-5xl uppercase leading-[0.95] md:text-6xl">{title}</h1>
            {description &&
            <p className="mx-auto mt-4 max-w-sm text-[15px] font-light leading-relaxed text-ink/65">
                {description}
              </p>
            }
          </div>
          <div className="rounded-3xl border border-ink/10 bg-paper p-6 shadow-sm sm:p-10">{children}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </main>
    </div>);

}