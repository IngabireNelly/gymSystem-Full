import React from "react";
import { PillButton } from "./PillButton";
import { images } from "../data/images";

export function SplitFeature() {
  return (
    <section
      id="plans"
      aria-labelledby="split-heading"
      className="relative w-full overflow-hidden bg-cream">
      
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[22vw] uppercase leading-none text-ink/[0.05]">
        
        Equipment
      </span>

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr]">
        <div className="aspect-[4/3] md:aspect-auto md:min-h-[640px]">
          <img
            src={images.splitLeft}
            alt="Hands gripping dumbbells on a rack"
            className="h-full w-full object-cover" />
          
        </div>

        <div className="flex flex-col items-center justify-center px-8 py-20 text-center md:px-12 lg:px-16">
          <div className="h-px w-16 bg-ink/25" />
          <p className="mt-5 font-serif text-lg font-semibold uppercase tracking-[0.2em] text-gold">
            Flexible Rental Plans
          </p>
          <h2
            id="split-heading"
            className="mt-3 font-display text-5xl uppercase leading-[0.95] text-ink lg:text-6xl">
            
            Custom Equipment & Membership Plans
          </h2>
          <p className="mt-6 max-w-sm text-[15px] font-light leading-relaxed text-ink/70">
            Rent exactly what you need, for as long as you need it. Pair a
            daily-rate rental with a membership that fits your training rhythm —
            from a single kettlebell to a full home gym.
          </p>
          <div className="mt-9">
            <PillButton to="/apply">Get Started</PillButton>
          </div>
        </div>

        <div className="hidden md:block md:min-h-[640px]">
          <img
            src={images.splitRight}
            alt="Woman stretching beside a kettlebell and resistance bands"
            className="h-full w-full object-cover" />
          
        </div>
      </div>
    </section>);

}