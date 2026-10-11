import React from "react";

interface RowActionProps {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "default" | "danger" | "primary";
  disabled?: boolean;
  ariaLabel?: string;
  describedBy?: string;
}

const tones = {
  default: "border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  danger: "border-rust/30 text-rust hover:border-rust hover:bg-rust hover:text-paper",
  primary: "border-ink bg-ink text-paper hover:bg-transparent hover:text-ink"
};

export function RowAction({ children, onClick, tone = "default", disabled = false, ariaLabel, describedBy }: RowActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={describedBy}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-[background-color,color,border-color,transform] duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-35 ${tones[tone]}`}>
      
      {children}
    </button>);

}