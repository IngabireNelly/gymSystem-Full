import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
      checked ? "bg-sage" : "bg-ink/20"}`
      }>
      
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-snappy ${
        checked ? "translate-x-[22px]" : "translate-x-0.5"}`
        } />
      
    </button>);

}