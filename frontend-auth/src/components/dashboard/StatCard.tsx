import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRightIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  hint: string;
  to: string;
  emphasis?: boolean;
}

export function StatCard({ label, value, hint, to, emphasis = false }: StatCardProps) {
  return (
    <Link
      to={to}
      className={`group flex h-full flex-col rounded-2xl border p-5 transition-[border-color,transform] duration-200 ease-snappy hover:-translate-y-0.5 ${
      emphasis ? "border-ink bg-ink text-paper" : "border-ink/10 bg-white text-ink hover:border-ink/30"}`
      }>
      
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[11px] font-medium uppercase tracking-[0.16em] ${emphasis ? "text-paper/70" : "text-ink/55"}`}>
          {label}
        </p>
        <ArrowUpRightIcon
          className={`h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
          emphasis ? "text-paper/60" : "text-ink/35"}`
          }
          aria-hidden="true" />
        
      </div>
      <p className="mt-4 font-display text-5xl leading-none">{value}</p>
      <p className={`mt-auto pt-3 text-xs ${emphasis ? "text-gold" : "text-ink/50"}`}>{hint}</p>
    </Link>);

}