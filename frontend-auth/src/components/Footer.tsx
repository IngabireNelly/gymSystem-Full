import React from "react";

export function Footer() {
  return (
    <footer
      id="contact"
      className="w-full scroll-mt-16 border-t border-ink/10 bg-paper py-10 md:scroll-mt-20">
      
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center md:flex-row md:px-8 md:text-left">
        <span className="font-display text-xl uppercase tracking-wide">GymRental</span>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/55">
          <a href="mailto:hello@gymrental.com" className="transition-colors duration-150 hover:text-ink">
            hello@gymrental.com
          </a>{" "}
          · © 2026 GymRental
        </p>
      </div>
    </footer>);

}