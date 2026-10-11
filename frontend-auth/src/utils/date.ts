import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function tomorrowISO(): string {
  return format(addDays(new Date(), 1), "yyyy-MM-dd");
}

export function daysUntil(iso: string): number {
  return differenceInCalendarDays(parseISO(iso), new Date());
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), "d MMM yyyy");
}