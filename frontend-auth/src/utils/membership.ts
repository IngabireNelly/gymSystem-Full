import { addMonths, format, parseISO } from "date-fns";
import { plans } from "../data/plans";
import { MembershipType, Plan } from "../types/gym";
import { daysUntil, todayISO } from "./date";

export type MembershipStatus = "Active" | "Expiring Soon" | "Expired";

export const EXPIRING_WINDOW_DAYS = 7;

export function planFor(type: MembershipType): Plan {
  return plans.find((p) => p.type === type) ?? plans[0];
}

export function membershipStatus(expiry: string | null): MembershipStatus | null {
  if (!expiry) return null;
  const days = daysUntil(expiry);
  if (days < 0) return "Expired";
  if (days <= EXPIRING_WINDOW_DAYS) return "Expiring Soon";
  return "Active";
}

/** Renewals stack on the current expiry if it's still valid, otherwise start today. */
export function renewalBase(expiry: string | null): string {
  const today = todayISO();
  return expiry && expiry >= today ? expiry : today;
}

export function computeNewExpiry(expiry: string | null, type: MembershipType): string {
  return format(addMonths(parseISO(renewalBase(expiry)), planFor(type).months), "yyyy-MM-dd");
}

export function formatUSD(amount: number): string {
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}