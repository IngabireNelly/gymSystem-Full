import React from "react";
import { SectionHeading } from "./SectionHeading";
import { steps } from "../data/content";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="w-full scroll-mt-16 bg-white py-24 md:scroll-mt-20 md:py-32">
      
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="how-heading"
          eyebrow="Our Process"
          title="How It Works"
          align="center" />
        

        <ol className="mt-16 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-3 md:gap-0 md:divide-x md:divide-ink/10">
          {steps.map((item) =>
          <li key={item.step} className="text-center md:px-10">
              <p className="font-serif text-lg font-semibold uppercase tracking-[0.2em] text-gold">
                {item.step}
              </p>
              <h3 className="mt-3 font-display text-3xl uppercase tracking-wide text-ink">
                {item.title}
              </h3>
              <p className="mx-auto mt-4 max-w-xs text-[15px] font-light leading-relaxed text-ink/65">
                {item.description}
              </p>
            </li>
          )}
        </ol>
      </div>
    </section>);

}