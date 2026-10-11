import { Client, Equipment, Payment, Rental, StaffAccount } from "../types/gym";

export const staffAccounts: StaffAccount[] = [
{
  id: "staff-1",
  username: "staff",
  email: "staff@gymrental.rw",
  password: "staff123",
  fullName: "Grace Ingabire"
}];


export const seedEquipment: Equipment[] = [
{ id: "eq-1", name: "Commercial Treadmill", category: "Cardio", dailyRate: 15000, purchaseDate: "2025-11-04", status: "Rented" },
{ id: "eq-2", name: "Adjustable Dumbbell Set", category: "Strength", dailyRate: 5000, purchaseDate: "2026-01-18", status: "Available" },
{ id: "eq-3", name: "Air Rowing Machine", category: "Cardio", dailyRate: 12000, purchaseDate: "2025-08-22", status: "Rented" },
{ id: "eq-4", name: "Cork Yoga Mat & Blocks", category: "Yoga", dailyRate: 1500, purchaseDate: "2026-03-09", status: "Available" },
{ id: "eq-5", name: "Percussion Massage Gun", category: "Recovery", dailyRate: 3000, purchaseDate: "2026-05-27", status: "Rented" },
{ id: "eq-6", name: "Kettlebell 16kg", category: "Strength", dailyRate: 2000, purchaseDate: "2025-12-02", status: "Available" },
{ id: "eq-7", name: "Spin Bike", category: "Cardio", dailyRate: 10000, purchaseDate: "2025-06-14", status: "Maintenance" },
{ id: "eq-8", name: "Foam Roller Kit", category: "Recovery", dailyRate: 1000, purchaseDate: "2026-02-20", status: "Available" },
{ id: "eq-9", name: "Olympic Barbell & Plates", category: "Strength", dailyRate: 8000, purchaseDate: "2025-10-01", status: "Available" }];


export const seedClients: Client[] = [
{
  id: "cl-1",
  fullName: "Aline Uwase",
  phone: "0781234567",
  email: "aline@example.rw",
  username: "client",
  password: "client123",
  membershipType: "Monthly",
  appliedDate: "2026-07-28",
  joinDate: "2026-07-30",
  membershipExpiry: "2026-09-30",
  status: "ACTIVE"
},
{
  id: "cl-2",
  fullName: "Jean Claude Habimana",
  phone: "0729876543",
  email: "jeanclaude@example.rw",
  username: "jeanclaude",
  password: "password123",
  membershipType: "Annual",
  appliedDate: "2026-05-30",
  joinDate: "2026-06-02",
  membershipExpiry: "2027-06-02",
  status: "ACTIVE"
},
{
  id: "cl-3",
  fullName: "Patrick Mugisha",
  phone: "0735550192",
  email: "patrick@example.rw",
  username: "patrick",
  password: "password123",
  membershipType: "Quarterly",
  appliedDate: "2026-03-02",
  joinDate: "2026-03-04",
  membershipExpiry: "2026-06-04",
  status: "INACTIVE"
},
{
  id: "cl-4",
  fullName: "Diane Mukamana",
  phone: "0788112233",
  email: "diane@example.rw",
  username: "diane@example.rw",
  password: "password123",
  membershipType: "Quarterly",
  appliedDate: "2026-09-24",
  joinDate: null,
  membershipExpiry: null,
  status: "PENDING"
},
{
  id: "cl-5",
  fullName: "Eric Niyonzima",
  phone: "0791445566",
  email: "eric@example.rw",
  username: "eric@example.rw",
  password: "password123",
  membershipType: "Monthly",
  appliedDate: "2026-09-25",
  joinDate: null,
  membershipExpiry: null,
  status: "PENDING"
}];


export const seedRentals: Rental[] = [
{
  id: "rent-4",
  equipmentId: "eq-1",
  clientId: "cl-1",
  startDate: "2026-09-24",
  dueDate: "2026-10-01",
  days: 7,
  dailyRate: 15000,
  totalCost: 105000,
  returnedDate: null
},
{
  id: "rent-3",
  equipmentId: "eq-3",
  clientId: "cl-2",
  startDate: "2026-09-20",
  dueDate: "2026-09-30",
  days: 10,
  dailyRate: 12000,
  totalCost: 120000,
  returnedDate: null
},
{
  id: "rent-2",
  equipmentId: "eq-5",
  clientId: "cl-1",
  startDate: "2026-09-15",
  dueDate: "2026-09-22",
  days: 7,
  dailyRate: 3000,
  totalCost: 21000,
  returnedDate: null
},
{
  id: "rent-1",
  equipmentId: "eq-4",
  clientId: "cl-1",
  startDate: "2026-08-30",
  dueDate: "2026-09-05",
  days: 6,
  dailyRate: 1500,
  totalCost: 9000,
  returnedDate: "2026-09-04"
}];


export const seedPayments: Payment[] = [
{
  id: "pay-4",
  clientId: "cl-1",
  date: "2026-08-30",
  description: "Monthly Membership Renewal",
  amount: 19,
  method: "Mobile Money",
  methodDetail: "MTN MoMo · 078•••4567",
  status: "Paid"
},
{
  id: "pay-3",
  clientId: "cl-1",
  date: "2026-07-30",
  description: "Monthly Membership — New Member",
  amount: 19,
  method: "Mobile Money",
  methodDetail: "MTN MoMo · 078•••4567",
  status: "Paid"
},
{
  id: "pay-2",
  clientId: "cl-2",
  date: "2026-06-02",
  description: "Annual Membership — New Member",
  amount: 180,
  method: "Card",
  methodDetail: "Card •••• 4242",
  status: "Paid"
},
{
  id: "pay-1",
  clientId: "cl-3",
  date: "2026-03-04",
  description: "Quarterly Membership — New Member",
  amount: 49,
  method: "Mobile Money",
  methodDetail: "Airtel Money · 073•••0192",
  status: "Paid"
}];