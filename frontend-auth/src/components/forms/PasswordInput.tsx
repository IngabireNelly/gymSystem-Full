import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { fieldClass } from "../../utils/fieldStyles";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  describedBy?: string;
  autoComplete?: string;
  placeholder?: string;
}

export function PasswordInput({
  id,
  value,
  onChange,
  hasError = false,
  describedBy,
  autoComplete = "current-password",
  placeholder
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={`${fieldClass(hasError)} pr-12`} />
      
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 transition-colors duration-150 hover:text-ink">
        
        {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
      </button>
    </div>);

}