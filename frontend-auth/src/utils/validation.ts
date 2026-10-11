import { PaymentMethod } from "../types/gym";
import { todayISO } from "./date";

export interface EquipmentValues {
  name: string;
  category: string;
  dailyRate: string;
  purchaseDate: string;
}

export interface ApplicationValues {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  membershipType: string;
}

export interface MemberEditValues {
  fullName: string;
  phone: string;
  membershipType: string;
}

export type Errors<T> = Partial<Record<keyof T, string>>;

export const PHONE_PATTERN = /^07\d{8}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function phoneError(phone: string): string | undefined {
  if (!phone.trim()) return "Phone number is required.";
  if (!PHONE_PATTERN.test(phone)) return "Use the format 07XXXXXXXX (10 digits).";
  return undefined;
}

function clean<T>(errors: Errors<T>): Errors<T> {
  const out: Errors<T> = {};
  (Object.keys(errors) as (keyof T)[]).forEach((k) => {
    if (errors[k]) out[k] = errors[k];
  });
  return out;
}

export function validateEquipment(v: EquipmentValues): Errors<EquipmentValues> {
  const errors: Errors<EquipmentValues> = {};
  if (!v.name.trim()) errors.name = "Equipment name is required.";
  if (!v.category) errors.category = "Select a category.";
  if (!v.dailyRate.trim()) {
    errors.dailyRate = "Daily rental rate is required.";
  } else {
    const rate = Number(v.dailyRate);
    if (!Number.isFinite(rate) || rate <= 0) errors.dailyRate = "Rate must be a positive number.";
  }
  if (!v.purchaseDate) errors.purchaseDate = "Purchase date is required.";else
  if (v.purchaseDate > todayISO()) errors.purchaseDate = "Purchase date can't be in the future.";
  return errors;
}

export function validateApplication(v: ApplicationValues): Errors<ApplicationValues> {
  return clean<ApplicationValues>({
    fullName: v.fullName.trim() ? undefined : "Full name is required.",
    phone: phoneError(v.phone),
    email: !v.email.trim() ?
    "Email is required." :
    EMAIL_PATTERN.test(v.email.trim()) ?
    undefined :
    "Enter a valid email address.",
    password: !v.password ?
    "Password is required." :
    v.password.length < 8 ?
    "Password must be at least 8 characters." :
    undefined,
    membershipType: v.membershipType ? undefined : "Select a membership type."
  });
}

export interface PaymentValues {
  phone: string;
  network: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

function cardExpiryError(expiry: string): string | undefined {
  if (!expiry) return "Expiry is required.";
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return "Use the format MM/YY.";
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return "Enter a valid month (01–12).";
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear || year === currentYear && month < currentMonth) return "This card has expired.";
  return undefined;
}

export function validatePayment(method: PaymentMethod, v: PaymentValues): Errors<PaymentValues> {
  if (method === "Mobile Money") {
    return clean<PaymentValues>({
      phone: phoneError(v.phone),
      network: v.network ? undefined : "Select a network."
    });
  }
  const digits = v.cardNumber.replace(/\D/g, "");
  return clean<PaymentValues>({
    cardNumber: !digits ?
    "Card number is required." :
    digits.length !== 16 ?
    "Card number must be 16 digits." :
    undefined,
    expiry: cardExpiryError(v.expiry),
    cvv: !v.cvv ? "CVV is required." : /^\d{3}$/.test(v.cvv) ? undefined : "CVV must be 3 digits.",
    cardName: v.cardName.trim() ? undefined : "Cardholder name is required."
  });
}

export function validateMemberEdit(v: MemberEditValues): Errors<MemberEditValues> {
  return clean<MemberEditValues>({
    fullName: v.fullName.trim() ? undefined : "Full name is required.",
    phone: phoneError(v.phone),
    membershipType: v.membershipType ? undefined : "Select a membership type."
  });
}