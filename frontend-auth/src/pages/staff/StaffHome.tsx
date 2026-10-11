import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { StatCard } from "../../components/dashboard/StatCard";
import { useAuth } from "../../contexts/AuthContext";
import { useGymData } from "../../contexts/GymDataContext";
import { formatRWF } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { lateDays, lateFee, rentalStatus } from "../../utils/rentals";

export function StaffHome() {
  const { currentUser } = useAuth();
  const { equipment, clients, rentals } = useGymData();

  const rentedOut = equipment.filter((e) => e.status === "Rented").length;
  const activeMembers = clients.filter((c) => c.status === "ACTIVE").length;
  const pending = clients.filter((c) => c.status === "PENDING");
  const overdue = rentals.filter((r) => rentalStatus(r) === "Overdue");

  return (
    <div>
      <PageHeader
        eyebrow="Staff Dashboard"
        title={`Hello, ${currentUser?.fullName.split(" ")[0] ?? "there"}`}
        description="Here's what needs your attention today." />
      

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pending Applications"
          value={pending.length}
          hint={pending.length > 0 ? "Awaiting your review" : "All caught up"}
          to="/staff/applications"
          emphasis={pending.length > 0} />
        
        <StatCard label="Total Equipment" value={equipment.length} hint="Across all categories" to="/staff/equipment" />
        <StatCard label="Rented Out" value={rentedOut} hint={`${equipment.length - rentedOut} not rented`} to="/staff/rentals" />
        <StatCard label="Active Members" value={activeMembers} hint="Approved & active" to="/staff/members" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-ink/10 bg-white p-6" aria-labelledby="overdue-panel">
          <div className="flex items-center justify-between gap-4">
            <h2 id="overdue-panel" className="font-display text-2xl uppercase">
              Overdue Rentals
              {overdue.length > 0 &&
              <span className="ml-2 rounded-full bg-rust px-2 py-0.5 align-middle font-sans text-xs font-semibold text-paper">
                  {overdue.length}
                </span>
              }
            </h2>
            <Link to="/staff/rentals" className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60 hover:text-ink">
              View all <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          {overdue.length === 0 ?
          <p className="mt-6 text-sm text-ink/55">No overdue rentals. Everything is on schedule.</p> :

          <ul className="mt-4 divide-y divide-ink/10">
              {overdue.map((r) =>
            <li key={r.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {equipment.find((e) => e.id === r.equipmentId)?.name ?? "Removed equipment"}
                    </p>
                    <p className="text-xs text-ink/55">
                      {clients.find((c) => c.id === r.clientId)?.fullName ?? "Unknown"} · due {formatDate(r.dueDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-rust">{lateDays(r)}d late</p>
                    <p className="text-xs text-ink/55">{formatRWF(lateFee(r))}</p>
                  </div>
                </li>
            )}
            </ul>
          }
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-6" aria-labelledby="pending-panel">
          <div className="flex items-center justify-between gap-4">
            <h2 id="pending-panel" className="font-display text-2xl uppercase">
              New Applications
            </h2>
            <Link to="/staff/applications" className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60 hover:text-ink">
              Review <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          {pending.length === 0 ?
          <p className="mt-6 text-sm text-ink/55">No applications waiting for review.</p> :

          <ul className="mt-4 divide-y divide-ink/10">
              {pending.slice(0, 5).map((c) =>
            <li key={c.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.fullName}</p>
                    <p className="text-xs text-ink/55">Applied {formatDate(c.appliedDate)}</p>
                  </div>
                  <span className="rounded-full border border-ink/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/70">
                    {c.membershipType}
                  </span>
                </li>
            )}
            </ul>
          }
        </section>
      </div>
    </div>);

}