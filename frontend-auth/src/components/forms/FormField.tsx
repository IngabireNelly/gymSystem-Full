import React from "react";
import { CircleAlertIcon } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function FormField({ id, label, error, hint, action, children }: FormFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/70">
          
          {label}
        </label>
        {action}
      </div>
      {children}
      {error ?
      <p
        id={`${id}-error`}
        role="alert"
        className="mt-2 flex items-center gap-1.5 text-[13px] text-rust">
        
          <CircleAlertIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p> :
      hint ?
      <p id={`${id}-hint`} className="mt-2 text-[13px] text-ink/50">
          {hint}
        </p> :
      null}
    </div>);

}