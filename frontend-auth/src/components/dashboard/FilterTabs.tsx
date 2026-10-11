import React from "react";

interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FilterTabsProps<T extends string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

export function FilterTabs<T extends string>({ options, value, onChange, label }: FilterTabsProps<T>) {
  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label={label}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-[background-color,color,transform] duration-150 active:scale-[0.97] ${
            active ? "bg-ink text-paper" : "text-ink/60 hover:bg-ink/5 hover:text-ink"}`
            }>
            
            {o.label}
            {o.count !== undefined &&
            <span className={`ml-1.5 ${active ? "text-paper/60" : "text-ink/40"}`}>{o.count}</span>
            }
          </button>);

      })}
    </div>);

}