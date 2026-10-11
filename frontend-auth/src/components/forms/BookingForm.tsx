import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormField } from "./FormField";
import { RentalConfirmation } from "./RentalConfirmation";
import { EquipmentPlaceholder } from "../client/EquipmentPlaceholder";
import { PillButton } from "../PillButton";
import { useGymData } from "../../contexts/GymDataContext";
import { Equipment, Rental } from "../../types/gym";
import { formatRWF } from "../../utils/currency";
import { daysUntil, formatDate, tomorrowISO } from "../../utils/date";
import { describedBy, fieldClass } from "../../utils/fieldStyles";

interface BookingFormProps {
  equipment: Equipment;
  clientId: string;
  clientName: string;
  onClose: () => void;
}

export function BookingForm({ equipment, clientId, clientName, onClose }: BookingFormProps) {
  const { createRental } = useGymData();
  const navigate = useNavigate();
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string>();
  const [confirmation, setConfirmation] = useState<Rental | null>(null);

  const days = dueDate ? daysUntil(dueDate) : 0;
  const total = days > 0 ? days * equipment.dailyRate : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dueDate) return setError("Due date is required.");
    if (days <= 0) return setError("Due date must be in the future.");
    const rental = await createRental({ equipmentId: equipment.id, clientId, dueDate });
    if (!rental) return setError("Sorry — this item could not be booked.");
    toast.success(`${equipment.name} booked`, {
      description: `Due ${formatDate(rental.dueDate)} · ${formatRWF(rental.totalCost)}`
    });
    setConfirmation(rental);
  }

  if (confirmation) {
    return (
      <RentalConfirmation
        rental={confirmation}
        equipmentName={equipment.name}
        memberName={clientName}
        actions={
        <>
            <PillButton
            variant="outline-dark"
            fullWidth
            onClick={() => {
              onClose();
              navigate("/client/rentals");
            }}>
            
              View My Rentals
            </PillButton>
            <PillButton fullWidth onClick={onClose}>
              Done
            </PillButton>
          </>
        } />);


  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4">
        <EquipmentPlaceholder category={equipment.category} size="sm" />
        <div className="min-w-0">
          <p className="font-serif text-sm font-semibold uppercase tracking-[0.18em] text-gold-deep">
            {equipment.category}
          </p>
          <p className="truncate font-display text-xl uppercase leading-tight">{equipment.name}</p>
          <p className="text-xs text-ink/55">{formatRWF(equipment.dailyRate)} per day</p>
        </div>
      </div>

      <FormField id="book-due" label="Due Date" error={error}>
        <input
          id="book-due"
          type="date"
          min={tomorrowISO()}
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            setError(undefined);
          }}
          aria-invalid={!!error}
          aria-describedby={describedBy("book-due", error)}
          className={fieldClass(!!error)} />
        
      </FormField>

      <FormField id="book-total" label="Estimated Total Cost">
        <output
          id="book-total"
          aria-live="polite"
          className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-ink/10 bg-cream px-4 py-4">
          
          <span className={`font-display text-3xl ${total ? "text-ink" : "text-ink/35"}`}>
            {total ? formatRWF(total) : "RWF —"}
          </span>
          <span className="text-xs text-ink/55">
            {total ?
            `${days} ${days === 1 ? "day" : "days"} × ${formatRWF(equipment.dailyRate)}` :
            "Pick a due date to see your total"}
          </span>
        </output>
      </FormField>

      <PillButton type="submit" fullWidth>
        Confirm Rental
      </PillButton>
    </form>);

}