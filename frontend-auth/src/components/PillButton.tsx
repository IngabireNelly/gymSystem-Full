import React from "react";
import { Link } from "react-router-dom";

type Variant = "dark" | "cream" | "outline-light" | "outline-dark" | "danger" | "warning";
type Size = "md" | "sm";

interface PillButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variants: Record<Variant, string> = {
  dark: "bg-ink text-paper border-ink hover:bg-transparent hover:text-ink",
  cream: "bg-cream text-ink border-cream hover:bg-transparent hover:text-cream",
  "outline-light": "bg-transparent text-paper border-paper/80 hover:bg-paper hover:text-ink",
  "outline-dark": "bg-transparent text-ink border-ink/40 hover:border-ink hover:bg-ink hover:text-paper",
  danger: "bg-rust text-paper border-rust hover:bg-transparent hover:text-rust",
  warning: "bg-gold text-ink border-gold hover:bg-transparent hover:text-gold-deep"
};

const sizes: Record<Size, string> = {
  md: "px-7 py-3 text-[11px] tracking-[0.22em]",
  sm: "px-5 py-2.5 text-[10px] tracking-[0.2em]"
};

export function PillButton({
  children,
  variant = "dark",
  size = "md",
  to,
  href,
  onClick,
  type,
  disabled = false,
  fullWidth = false,
  className = ""
}: PillButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border font-medium uppercase transition-[background-color,color,border-color,transform] duration-200 ease-snappy hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.96] active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 ${
  fullWidth ? "w-full" : ""} ${
  sizes[size]} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {children}
      </Link>);

  }

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
      </a>);

  }

  return (
    <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>);

}