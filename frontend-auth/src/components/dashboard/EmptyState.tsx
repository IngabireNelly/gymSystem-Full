import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/20 px-6 py-16 text-center">
      <p className="font-display text-2xl uppercase text-ink/45">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink/55">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>);

}