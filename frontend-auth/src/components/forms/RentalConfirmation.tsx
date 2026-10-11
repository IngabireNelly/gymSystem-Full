import React from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { Rental } from "../../types/gym";
import { formatRWF } from "../../utils/currency";
import { formatDate } from "../../utils/date";

interface RentalConfirmationProps {
  rental: Rental;
  equipmentName: string;
  memberName: string;
  actions: React.ReactNode;
}

export function RentalConfirmation({ rental, equipmentName, memberName, actions }: RentalConfirmationProps) {
  const rows = [
  { label: "Equipment", value: equipmentName },
  { label: "Member", value: memberName },
  { label: "Start Date", value: formatDate(rental.startDate) },
  { label: "Due Date", value: formatDate(rental.dueDate) },
  { label: "Duration", value: `${rental.days} ${rental.days === 1 ? "day" : "days"}` }];


  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      role="status">
      
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
          <CheckIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-3xl uppercase text-ink">Rental Confirmed</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
          Please return {equipmentName} by {formatDate(rental.dueDate)} to avoid late fees.
        </p>
      </div>

      <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {rows.map((row) =>
        <div key={row.label} className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">{row.label}</dt>
            <dd className="text-right text-[15px] font-medium text-ink">{row.value}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-ink px-5 py-5 text-paper">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/70">Total Cost</span>
        <span className="font-display text-3xl">{formatRWF(rental.totalCost)}</span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">{actions}</div>
    </motion.div>);

}