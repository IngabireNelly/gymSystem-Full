import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { SplitFeature } from "../components/SplitFeature";
import { HowItWorks } from "../components/HowItWorks";
import { WhatsIncluded } from "../components/WhatsIncluded";
import { Pricing } from "../components/Pricing";
import { Footer } from "../components/Footer";

export function Landing() {
  return (
    <div className="min-h-screen w-full bg-paper font-sans text-ink">
      <Navbar />
      <main>
        <Hero />
        <SplitFeature />
        <HowItWorks />
        <WhatsIncluded />
        <Pricing />
      </main>
      <Footer />
    </div>);

}