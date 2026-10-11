import React from "react";
import { CheckIcon } from "lucide-react";
import { plans } from "../../data/plans";
import { MembershipType } from "../../types/gym";
import { formatUSD } from "../../utils/membership";

interface PlanSelectorProps {
  value: MembershipType;
  onChange: (type: MembershipType) => void;
  currentType: MembershipType;
  label: string;
}

export function PlanSelector({ value, onChange, currentType, label }: PlanSelectorProps) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {plans.map((plan) => {
        const selected = value === plan.type;
        const perMonth = plan.price / plan.months;
        return (
          <button
            key={plan.type}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(plan.type)}
            className={`flex h-full flex-col rounded-2xl border p-4 text-left transition-[border-color,background-color,color,transform] duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
            selected ? "border-ink bg-ink text-paper" : "border-ink/15 bg-white text-ink hover:border-ink/40"}`
            }>
            
            <div className="flex items-start justify-between gap-2">
              <span className="font-display text-xl uppercase leading-none">{plan.type}</span>
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                selected ? "border-paper bg-paper text-ink" : "border-ink/25"}`
                }>
                
                {selected && <CheckIcon className="h-3 w-3" />}
              </span>
            </div>
            <p className="mt-4">
              <span className="font-display text-3xl">{formatUSD(plan.price)}</span>
              <span className={`ml-0.5 text-xs ${selected ? "text-paper/60" : "text-ink/50"}`}>{plan.period}</span>
            </p>
            <p className={`mt-1 text-xs ${selected ? "text-paper/60" : "text-ink/50"}`}>
              {plan.months > 1 ? `${formatUSD(Math.round(perMonth * 100) / 100)}/mo · ` : ""}
              {plan.billing}
            </p>
            <div className="mt-auto pt-3">
              {currentType === plan.type &&
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${
                selected ? "bg-paper/15 text-paper" : "bg-cream text-ink/70"}`
                }>
                
                  Current plan
                </span>
              }
            </div>
          </button>);

      })}
    </div>);

}