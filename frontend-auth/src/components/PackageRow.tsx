import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { PillButton } from "./PillButton";

interface PackageRowProps {
  name: string;
  price: string;
  summary: string;
  perks: string[];
  isOpen: boolean;
  onToggle: () => void;
  onChoose: () => void;
  index: number;
}

export function PackageRow({
  name,
  price,
  summary,
  perks,
  isOpen,
  onToggle,
  onChoose,
  index
}: PackageRowProps) {
  const panelId = `package-panel-${index}`;
  const buttonId = `package-button-${index}`;

  return (
    <li className="border-b border-ink/15">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-4 py-7 text-left transition-[padding] duration-200 ease-snappy hover:pl-2 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
          
          <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <span className="font-display text-2xl uppercase tracking-wide text-ink transition-colors duration-150 group-hover:text-gold md:text-3xl">
              {name}
            </span>
            <span className="font-serif text-lg italic text-ink/60">
              <span className="not-italic text-gold">//</span> {price} per month
            </span>
          </span>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-200 ${
            isOpen ?
            "border-ink bg-ink text-paper" :
            "border-ink/25 text-ink group-hover:border-ink"}`
            }>
            
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ease-snappy ${
              isOpen ? "rotate-180" : ""}`
              }
              aria-hidden="true" />
            
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen &&
        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden">
          
            <div className="pb-8">
              <p className="text-[15px] font-light text-ink/70">{summary}</p>
              <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {perks.map((perk) =>
              <li
                key={perk}
                className="flex items-start gap-2.5 text-sm text-ink/80">
                
                    <CheckIcon
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  aria-hidden="true" />
                
                    {perk}
                  </li>
              )}
              </ul>
              <div className="mt-7">
                <PillButton size="sm" onClick={onChoose}>
                  Choose {name.split(" ")[0]}
                </PillButton>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </li>);

}