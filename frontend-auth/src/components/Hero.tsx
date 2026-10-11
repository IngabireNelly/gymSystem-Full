import React from "react";
import { PillButton } from "./PillButton";
import { images } from "../data/images";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100vh-4rem)] scroll-mt-16 md:scroll-mt-20 w-full items-end overflow-hidden bg-ink md:min-h-[calc(100vh-5rem)]">
      
      <img
        src={images.hero}
        alt="Athlete lifting a barbell overhead in a bright, minimal gym"
        className="absolute inset-0 h-full w-full object-cover object-[30%_center]" />
      
      <div className="absolute inset-0 bg-ink/35" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent"
        aria-hidden="true" />
      

      <div className="relative mx-auto w-full max-w-5xl px-5 pb-20 text-center md:pb-28">
        <p className="font-serif text-lg font-semibold uppercase tracking-[0.28em] text-cream md:text-xl">
          Equipment Rental, Made Simple
        </p>
        <h1
          id="hero-heading"
          className="mx-auto mt-4 max-w-4xl font-display text-6xl uppercase leading-[0.92] text-paper sm:text-7xl md:text-8xl lg:text-[8.5rem]">
          
          Rent Gym Equipment On Your Terms
        </h1>
        <div className="mt-10">
          <PillButton variant="outline-light" to="/client/equipment">
            Browse Equipment
          </PillButton>
        </div>
      </div>
    </section>);

}