import React from "react";
import { toast } from "sonner";
import { Badge } from "../../components/Badge";
import { EmptyState } from "../../components/dashboard/EmptyState";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { RowAction } from "../../components/dashboard/RowAction";
import { TableCard } from "../../components/dashboard/TableCard";
import { PillButton } from "../../components/PillButton";
import { useAuth } from "../../contexts/AuthContext";
import { useGymData } from "../../contexts/GymDataContext";
import { formatRWF } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { lateFee, LATE_FEE_MULTIPLIER, rentalStatus } from "../../utils/rentals";
import { rentalTone } from "../../utils/statusTone";
import { tdClass, thClass } from "../../utils/tableStyles";

const columns = ["Equipment", "Rented", "Due", "Status", "Total Cost", ""];

export function ClientRentals() {
  const { currentUser } = useAuth();
  const { rentals, equipment, returnRental } = useGymData();
  const mine = rentals.filter((r) => r.clientId === currentUser?.id);

  function handleReturn(id: string, name: string, fee: number) {
    returnRental(id);
    toast.success(`${name} returned`, {
      description: fee > 0 ? `A late fee of ${formatRWF(fee)} was applied.` : "Thanks for returning on time."
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow="History"
        title="My Rentals"
        description={`Late returns are charged at ${LATE_FEE_MULTIPLIER}× the daily rate for each day past the due date.`} />
      

      {mine.length === 0 ?
      <EmptyState
        title="No rentals yet"
        description="When you book equipment it will show up here."
        action={<PillButton size="sm" to="/client/equipment">Browse Equipment</PillButton>} /> :


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
              {mine.map((r) => {
              const status = rentalStatus(r);
              const fee = lateFee(r);
              const name = equipment.find((e) => e.id === r.equipmentId)?.name ?? "Removed equipment";
              return (
                <tr key={r.id} className={status === "Overdue" ? "bg-rust-soft/40" : undefined}>
                    <td className={`${tdClass} font-medium text-ink`}>{name}</td>
                    <td className={tdClass}>{formatDate(r.startDate)}</td>
                    <td className={`${tdClass} ${status === "Overdue" ? "font-medium text-rust" : ""}`}>
                      {formatDate(r.dueDate)}
                    </td>
                    <td className={tdClass}>
                      <Badge tone={rentalTone(status)}>{status}</Badge>
                    </td>
                    <td className={tdClass}>
                      <span className="font-medium text-ink">{formatRWF(r.totalCost)}</span>
                      {fee > 0 && <span className="block text-xs text-rust">+ {formatRWF(fee)} late fee</span>}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      {status !== "Returned" ?
                    <RowAction tone="primary" onClick={() => handleReturn(r.id, name, fee)}>
                          Return Equipment
                        </RowAction> :

                    <span className="text-xs text-ink/45">
                          Returned {r.returnedDate ? formatDate(r.returnedDate) : ""}
                        </span>
                    }
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        </TableCard>
      }
    </div>);

}