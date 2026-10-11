import React, { useState } from "react";
import { SectionHeading } from "./SectionHeading";
import { PackageRow } from "./PackageRow";
import { packages } from "../data/content";
import { useNavigate } from "react-router-dom";
import { images } from "../data/images";

export function Pricing() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);
  const navigate = useNavigate();

  return (
    <section
      id="membership"
      aria-labelledby="pricing-heading"
      className="w-full scroll-mt-16 bg-cream py-24 md:scroll-mt-20 md:py-32">
      
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-t-full">
          <img
            src={images.groupClass}
            alt="Group fitness class doing lunges with dumbbells"
            className="h-full w-full object-cover" />
          
        </div>

        <div>
          <SectionHeading
            id="pricing-heading"
            eyebrow="Pricing Options"
            title="Packages & Rates" />
          
          <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-ink/70">
            Every membership includes access to the full catalog. Higher tiers
            unlock more concurrent rentals, lower daily rates, and added
            protection.
          </p>

          <ul className="mt-10 border-t border-ink/15">
            {packages.map((pkg, i) =>
            <PackageRow
              key={pkg.name}
              index={i}
              {...pkg}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              onChoose={() => navigate("/apply")} />

            )}
          </ul>
        </div>
      </div>
    </section>);

}