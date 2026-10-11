import React, { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../components/Badge";
import { EmptyState } from "../../components/dashboard/EmptyState";
import { FilterTabs } from "../../components/dashboard/FilterTabs";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { RowAction } from "../../components/dashboard/RowAction";
import { TableCard } from "../../components/dashboard/TableCard";
import { useGymData } from "../../contexts/GymDataContext";
import { RentalStatus } from "../../types/gym";
import { formatRWF } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { lateFee, LATE_FEE_MULTIPLIER, rentalStatus } from "../../utils/rentals";
import { rentalTone } from "../../utils/statusTone";
import { tdClass, thClass } from "../../utils/tableStyles";

type Filter = "All" | RentalStatus;
const columns = ["Member", "Equipment", "Rented", "Due", "Status", "Total", "Late Fee", ""];

export function StaffRentals() {
  const { rentals, clients, equipment, returnRental } = useGymData();
  const [filter, setFilter] = useState<Filter>("All");

  const count = (s: RentalStatus) => rentals.filter((r) => rentalStatus(r) === s).length;
  const visible = filter === "All" ? rentals : rentals.filter((r) => rentalStatus(r) === filter);
  const options: {value: Filter;label: string;count: number;}[] = [
  { value: "All", label: "All", count: rentals.length },
  { value: "Active", label: "Active", count: count("Active") },
  { value: "Overdue", label: "Overdue Only", count: count("Overdue") },
  { value: "Returned", label: "Returned", count: count("Returned") }];


  function markReturned(id: string, name: string, fee: number) {
    returnRental(id);
    toast.success(`${name} marked as returned`, {
      description: fee > 0 ? `Late fee due: ${formatRWF(fee)}` : "Returned on time."
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Rentals"
        description={`Every rental across all members. Late fees accrue at ${LATE_FEE_MULTIPLIER}× the daily rate per day overdue.`} />
      

      <div className="mb-5">
        <FilterTabs label="Filter rentals" options={options} value={filter} onChange={setFilter} />
      </div>

      {visible.length === 0 ?
      <EmptyState
        title={filter === "Overdue" ? "Nothing overdue" : "No rentals"}
        description={filter === "Overdue" ? "Every active rental is within its due date." : "Rentals will appear here once members book equipment."} /> :


      <TableCard>
          <table className="w-full min-w-[980px]">
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
              {visible.map((r) => {
              const status = rentalStatus(r);
              const fee = lateFee(r);
              const name = equipment.find((e) => e.id === r.equipmentId)?.name ?? "Removed equipment";
              return (
                <tr key={r.id} className={status === "Overdue" ? "bg-rust-soft/40" : undefined}>
                    <td className={`${tdClass} font-medium text-ink`}>
                      {clients.find((c) => c.id === r.clientId)?.fullName ?? "Unknown member"}
                    </td>
                    <td className={tdClass}>{name}</td>
                    <td className={tdClass}>{formatDate(r.startDate)}</td>
                    <td className={`${tdClass} ${status === "Overdue" ? "font-medium text-rust" : ""}`}>
                      {formatDate(r.dueDate)}
                    </td>
                    <td className={tdClass}>
                      <Badge tone={rentalTone(status)}>{status}</Badge>
                    </td>
                    <td className={`${tdClass} tabular-nums`}>{formatRWF(r.totalCost)}</td>
                    <td className={`${tdClass} tabular-nums ${fee > 0 ? "font-medium text-rust" : "text-ink/35"}`}>
                      {fee > 0 ? formatRWF(fee) : "—"}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      {status !== "Returned" ?
                    <RowAction tone="primary" onClick={() => markReturned(r.id, name, fee)}>
                          Mark Returned
                        </RowAction> :

                    <span className="whitespace-nowrap text-xs text-ink/45">
                          {r.returnedDate ? formatDate(r.returnedDate) : ""}
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