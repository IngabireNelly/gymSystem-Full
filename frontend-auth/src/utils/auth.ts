import { Role } from "../types/gym";

export function homeFor(role: Role): string {
  return role === "STAFF" ? "/staff" : "/client";
}

export function initials(name: string): string {
  return name.
  split(" ").
  filter(Boolean).
  slice(0, 2).
  map((part) => part[0]?.toUpperCase()).
  join("");
}