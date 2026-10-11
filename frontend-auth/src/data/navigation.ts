import {
  ClipboardListIcon,
  CreditCardIcon,
  DumbbellIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LucideIcon,
  ReceiptTextIcon,
  UserIcon,
  UsersIcon } from
"lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  badgeKey?: "pending" | "overdue" | "membership";
}

export const clientNav: NavItem[] = [
{ label: "Dashboard", to: "/client", icon: LayoutDashboardIcon, end: true },
{ label: "Browse Equipment", to: "/client/equipment", icon: DumbbellIcon },
{ label: "My Rentals", to: "/client/rentals", icon: ReceiptTextIcon, badgeKey: "overdue" },
{ label: "My Profile", to: "/client/profile", icon: UserIcon },
{ label: "Membership & Billing", to: "/client/billing", icon: CreditCardIcon, badgeKey: "membership" }];


export const staffNav: NavItem[] = [
{ label: "Dashboard", to: "/staff", icon: LayoutDashboardIcon, end: true },
{ label: "Equipment", to: "/staff/equipment", icon: DumbbellIcon },
{ label: "Members", to: "/staff/members", icon: UsersIcon },
{ label: "Rentals", to: "/staff/rentals", icon: ClipboardListIcon, badgeKey: "overdue" },
{ label: "Pending Applications", to: "/staff/applications", icon: InboxIcon, badgeKey: "pending" }];