import React from "react";

export function TableCard({ children }: {children: React.ReactNode;}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <div className="overflow-x-auto">{children}</div>
    </div>);

}