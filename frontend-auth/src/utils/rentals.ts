import { differenceInCalendarDays, parseISO } from "date-fns";
import { Rental, RentalStatus } from "../types/gym";
import { todayISO } from "./date";

export const LATE_FEE_MULTIPLIER = 1.5;

export function rentalStatus(rental: Rental): RentalStatus {
  if (rental.returnedDate) return "Returned";
  return rental.dueDate < todayISO() ? "Overdue" : "Active";
}

export function lateDays(rental: Rental): number {
  const end = rental.returnedDate ?? todayISO();
  return Math.max(0, differenceInCalendarDays(parseISO(end), parseISO(rental.dueDate)));
}

export function lateFee(rental: Rental): number {
  return Math.round(lateDays(rental) * rental.dailyRate * LATE_FEE_MULTIPLIER);
}