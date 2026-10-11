import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { fieldClass } from "../../utils/fieldStyles";

type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export function SelectInput({
  hasError = false,
  className = "",
  children,
  value,
  ...props
}: SelectInputProps) {
  const isEmpty = value === "" || value === undefined;
  return (
    <div className="relative">
      <select
        {...props}
        value={value}
        className={`${fieldClass(hasError)} cursor-pointer appearance-none pr-11 ${
        isEmpty ? "text-ink/40" : ""} ${
        className}`}>
        
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
      
    </div>);

}