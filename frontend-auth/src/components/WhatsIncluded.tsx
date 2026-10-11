import React from "react";
import { ChevronRightIcon } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PillButton } from "./PillButton";
import { includedFeatures } from "../data/content";
import { images } from "../data/images";

export function WhatsIncluded() {
  return (
    <section
      id="included"
      aria-labelledby="included-heading"
      className="w-full scroll-mt-16 bg-ink text-paper md:scroll-mt-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col justify-center px-5 py-24 md:px-12 lg:px-20 lg:py-32">
          <SectionHeading
            id="included-heading"
            eyebrow="What You Get"
            title="What's Included"
            tone="light" />
          

          <ul className="mt-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {includedFeatures.map((feature) =>
            <li
              key={feature}
              className="flex items-center gap-3 border-b border-paper/10 py-4 text-[15px] text-paper/85">
              
                <ChevronRightIcon
                className="h-4 w-4 shrink-0 text-gold"
                aria-hidden="true" />
              
                {feature}
              </li>
            )}
          </ul>

          <div className="mt-12">
            <PillButton variant="cream" to="/client/equipment">
              Book Now
            </PillButton>
          </div>
        </div>

        <div className="h-[420px] sm:h-[560px] lg:h-auto lg:min-h-[760px]">
          <img
            src={images.included}
            alt="Athlete running on a treadmill in a dimly lit gym"
            className="h-full w-full object-cover" />
          
        </div>
      </div>
    </section>);

}