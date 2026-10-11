import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { PillButton } from "../PillButton";
import { useAuth } from "../../contexts/AuthContext";
import { useGymData } from "../../contexts/GymDataContext";
import { clientNav, NavItem, staffNav } from "../../data/navigation";
import { Role } from "../../types/gym";
import { initials } from "../../utils/auth";
import { membershipStatus } from "../../utils/membership";
import { rentalStatus } from "../../utils/rentals";

export function DashboardLayout({ role }: {role: Role;}) {
  const { currentUser, logout } = useAuth();
  const { clients, rentals } = useGymData();
  const navigate = useNavigate();
  const nav = role === "STAFF" ? staffNav : clientNav;

  const scoped = role === "STAFF" ? rentals : rentals.filter((r) => r.clientId === currentUser?.id);
  const ownExpiry = clients.find((c) => c.id === currentUser?.id)?.membershipExpiry ?? null;
  const badges: Record<NonNullable<NavItem["badgeKey"]>, number> = {
    pending: clients.filter((c) => c.status === "PENDING").length,
    overdue: scoped.filter((r) => rentalStatus(r) === "Overdue").length,
    membership: role === "CLIENT" && membershipStatus(ownExpiry) !== "Active" && ownExpiry ? 1 : 0
  };

  function handleLogout() {
    logout();
    navigate("/");
    toast("You've been logged out.");
  }

  function badgeFor(item: NavItem, active: boolean) {
    if (!item.badgeKey) return null;
    const count = badges[item.badgeKey];
    if (count === 0) return null;
    const color = active ?
    "bg-paper text-ink" :
    item.badgeKey === "overdue" ?
    "bg-rust text-paper" :
    "bg-gold text-ink";
    const isMembership = item.badgeKey === "membership";
    return (
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}
        aria-label={isMembership ? "Renewal needed" : `${count} ${item.badgeKey}`}>
        
        {isMembership ? "!" : count}
      </span>);

  }

  return (
    <div className="min-h-screen w-full bg-paper text-ink">
      <header className="sticky top-0 z-40 h-16 border-b border-ink/10 bg-paper/95 backdrop-blur-md">
        <div className="flex h-full items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-xl uppercase tracking-wide">
              GymRental
            </Link>
            <span className="hidden rounded-full border border-ink/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink/60 sm:inline">
              {role === "STAFF" ? "Staff" : "Member"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                
                {initials(currentUser?.fullName ?? "")}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-medium">{currentUser?.fullName}</p>
                <p className="text-xs text-ink/50">{currentUser?.email}</p>
              </div>
            </div>
            <PillButton size="sm" variant="outline-dark" onClick={handleLogout}>
              <LogOutIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Log Out
            </PillButton>
          </div>
        </div>
      </header>

      <div className="lg:flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-ink/10 px-4 py-6 lg:flex">
          <nav aria-label="Dashboard">
            <ul className="space-y-1">
              {nav.map((item) =>
              <li key={item.to}>
                  <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150 ${
                  isActive ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5 hover:text-ink"}`

                  }>
                  
                    {({ isActive }) =>
                  <>
                        <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="flex-1">{item.label}</span>
                        {badgeFor(item, isActive)}
                      </>
                  }
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/60 transition-colors duration-150 hover:bg-ink/5 hover:text-ink">
            
            <LogOutIcon className="h-4 w-4" aria-hidden="true" />
            Log Out
          </button>
        </aside>

        <nav aria-label="Dashboard" className="sticky top-16 z-30 overflow-x-auto border-b border-ink/10 bg-paper lg:hidden">
          <ul className="flex gap-1 px-4 py-2">
            {nav.map((item) =>
            <li key={item.to}>
                <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors duration-150 ${
                isActive ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5"}`

                }>
                
                  {({ isActive }) =>
                <>
                      {item.label}
                      {badgeFor(item, isActive)}
                    </>
                }
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>);

}