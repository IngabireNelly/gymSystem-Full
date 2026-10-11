export type EquipmentCategory = "Cardio" | "Strength" | "Yoga" | "Recovery";
export type EquipmentStatus = "Available" | "Rented" | "Maintenance";
export type MembershipType = "Monthly" | "Quarterly" | "Annual";
export type Role = "STAFF" | "CLIENT";
export type ClientStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
export type RentalStatus = "Active" | "Overdue" | "Returned";

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  dailyRate: number;
  purchaseDate: string;
  status: EquipmentStatus;
}

export interface Client {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  membershipType: MembershipType;
  appliedDate: string;
  joinDate: string | null;
  membershipExpiry: string | null;
  status: ClientStatus;
}

export type PaymentMethod = "Mobile Money" | "Card";
export type MobileNetwork = "MTN MoMo" | "Airtel Money";

export interface Plan {
  type: MembershipType;
  price: number;
  months: number;
  period: string;
  billing: string;
}

export interface Payment {
  id: string;
  clientId: string;
  date: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  methodDetail: string;
  status: "Paid";
}

export interface PaymentDetails {
  method: PaymentMethod;
  methodDetail: string;
}

export interface StaffAccount {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface Rental {
  id: string;
  equipmentId: string;
  clientId: string;
  startDate: string;
  dueDate: string;
  days: number;
  dailyRate: number;
  totalCost: number;
  returnedDate: string | null;
}

export type NewEquipment = Omit<Equipment, "id" | "status">;
export type EquipmentUpdate = Partial<Omit<Equipment, "id">>;

export interface Application {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  membershipType: MembershipType;
}

export interface ClientUpdate {
  fullName: string;
  phone: string;
  membershipType: MembershipType;
}

export interface NewRental {
  equipmentId: string;
  clientId: string;
  dueDate: string;
}

export interface Session {
  role: Role;
  userId: string;
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}