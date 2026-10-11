import React from "react";
import { Badge } from "../Badge";
import { EmptyState } from "../dashboard/EmptyState";
import { TableCard } from "../dashboard/TableCard";
import { Payment } from "../../types/gym";
import { formatDate } from "../../utils/date";
import { formatUSD } from "../../utils/membership";
import { tdClass, thClass } from "../../utils/tableStyles";

const columns = ["Date", "Description", "Amount", "Payment Method", "Status"];

export function BillingHistory({ payments }: {payments: Payment[];}) {
  if (payments.length === 0) {
    return <EmptyState title="No payments yet" description="Your membership payments will appear here." />;
  }

  return (
    <TableCard>
      <table className="w-full min-w-[720px]">
        <thead className="border-b border-ink/10 bg-cream/50">
          <tr>
            {columns.map((c) =>
            <th key={c} scope="col" className={thClass}>
                {c}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {payments.map((p) =>
          <tr key={p.id}>
              <td className={`${tdClass} whitespace-nowrap`}>{formatDate(p.date)}</td>
              <td className={`${tdClass} font-medium text-ink`}>{p.description}</td>
              <td className={`${tdClass} tabular-nums text-ink`}>{formatUSD(p.amount)}</td>
              <td className={tdClass}>
                <p>{p.method}</p>
                <p className="text-xs text-ink/50">{p.methodDetail}</p>
              </td>
              <td className={tdClass}>
                <Badge tone="success">{p.status}</Badge>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableCard>);

}