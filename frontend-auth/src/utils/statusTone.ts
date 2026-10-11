import { ClientStatus, EquipmentStatus, RentalStatus } from "../types/gym";

export type Tone = "success" | "neutral" | "danger" | "warning" | "dark";

export function equipmentTone(status: EquipmentStatus): Tone {
  if (status === "Available") return "success";
  if (status === "Maintenance") return "warning";
  return "neutral";
}

export function rentalTone(status: RentalStatus): Tone {
  if (status === "Active") return "success";
  if (status === "Overdue") return "danger";
  return "neutral";
}

export function clientTone(status: ClientStatus): Tone {
  if (status === "ACTIVE") return "success";
  if (status === "PENDING") return "warning";
  if (status === "REJECTED") return "danger";
  return "neutral";
}

export function membershipTone(status: "Active" | "Expiring Soon" | "Expired"): Tone {
  if (status === "Active") return "success";
  if (status === "Expiring Soon") return "warning";
  return "danger";
}

export function clientStatusLabel(status: ClientStatus): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}