import React from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "../../components/dashboard/EmptyState";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { RowAction } from "../../components/dashboard/RowAction";
import { TableCard } from "../../components/dashboard/TableCard";
import { useGymData } from "../../contexts/GymDataContext";
import { Client } from "../../types/gym";
import { formatDate } from "../../utils/date";
import { tdClass, thClass } from "../../utils/tableStyles";

const columns = ["Applicant", "Phone", "Requested Type", "Applied", ""];

export function StaffApplications() {
  const { clients, approveClient, rejectClient } = useGymData();
  const pending = clients.filter((c) => c.status === "PENDING");

  function approve(c: Client) {
    approveClient(c.id);
    toast.success(`${c.fullName} approved`, { description: "They've been added to Members and can now log in." });
  }

  function reject(c: Client) {
    rejectClient(c.id);
    toast(`${c.fullName}'s application was rejected`);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Review"
        title="Pending Applications"
        description="Approved applicants move to Members and can log in to book equipment right away." />
      

      {pending.length === 0 ?
      <EmptyState title="All caught up" description="There are no membership applications waiting for review." /> :

      <TableCard>
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-ink/10 bg-cream/50">
              <tr>
                {columns.map((c, i) =>
              <th key={i} scope="col" className={thClass}>
                    {c}
                  </th>
              )}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {pending.map((c) =>
            <tr key={c.id}>
                  <td className={tdClass}>
                    <p className="font-medium text-ink">{c.fullName}</p>
                    <p className="text-xs text-ink/50">{c.email}</p>
                  </td>
                  <td className={`${tdClass} tabular-nums`}>{c.phone}</td>
                  <td className={tdClass}>
                    <span className="rounded-full border border-ink/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/70">
                      {c.membershipType}
                    </span>
                  </td>
                  <td className={tdClass}>{formatDate(c.appliedDate)}</td>
                  <td className={tdClass}>
                    <div className="flex justify-end gap-2">
                      <RowAction tone="primary" onClick={() => approve(c)} ariaLabel={`Approve ${c.fullName}`}>
                        <CheckIcon className="h-3 w-3" aria-hidden="true" /> Approve
                      </RowAction>
                      <RowAction tone="danger" onClick={() => reject(c)} ariaLabel={`Reject ${c.fullName}`}>
                        <XIcon className="h-3 w-3" aria-hidden="true" /> Reject
                      </RowAction>
                    </div>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </TableCard>
      }
    </div>);

}