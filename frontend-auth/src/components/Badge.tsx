import React from "react";
import { Tone } from "../utils/statusTone";

const tones: Record<Tone, {pill: string;dot: string;}> = {
  success: { pill: "bg-sage-soft text-sage", dot: "bg-sage" },
  neutral: { pill: "bg-ink/10 text-ink/60", dot: "bg-ink/40" },
  danger: { pill: "bg-rust-soft text-rust", dot: "bg-rust" },
  warning: { pill: "bg-gold/15 text-gold-deep", dot: "bg-gold" },
  dark: { pill: "bg-ink text-paper", dot: "bg-paper" }
};

export function Badge({ tone, children }: {tone: Tone;children: React.ReactNode;}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${tones[tone].pill}`}>
      
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tones[tone].dot}`} />
      {children}
    </span>);

}