import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, CircleAlertIcon } from "lucide-react";
import { Badge } from "../../components/Badge";
import { EquipmentPlaceholder } from "../../components/client/EquipmentPlaceholder";
import { EmptyState } from "../../components/dashboard/EmptyState";
import { PillButton } from "../../components/PillButton";
import { useAuth } from "../../contexts/AuthContext";
import { useGymData } from "../../contexts/GymDataContext";
import { formatRWF } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { lateDays, lateFee, rentalStatus } from "../../utils/rentals";
import { clientStatusLabel, clientTone, rentalTone } from "../../utils/statusTone";

export function ClientHome() {
  const { currentUser } = useAuth();
  const { clients, rentals, equipment } = useGymData();
  const client = clients.find((c) => c.id === currentUser?.id);
  if (!client) return null;

  const mine = rentals.filter((r) => r.clientId === client.id);
  const current = mine.filter((r) => rentalStatus(r) !== "Returned");
  const overdue = current.filter((r) => rentalStatus(r) === "Overdue");
  const itemFor = (id: string) => equipment.find((e) => e.id === id);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-base font-semibold uppercase tracking-[0.2em] text-gold-deep">Member Dashboard</p>
          <h1 className="mt-1 font-display text-5xl uppercase leading-none md:text-6xl">
            Welcome back, {client.fullName.split(" ")[0]}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink/60">{client.membershipType} membership</span>
          <Badge tone={clientTone(client.status)}>{clientStatusLabel(client.status)}</Badge>
        </div>
      </section>

      {overdue.length > 0 &&
      <section
        role="alert"
        className="rounded-2xl border border-rust/30 bg-rust-soft p-5 md:p-6"
        aria-labelledby="overdue-heading">
        
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <CircleAlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-rust" aria-hidden="true" />
              <div>
                <h2 id="overdue-heading" className="font-display text-2xl uppercase text-rust">
                  {overdue.length} overdue {overdue.length === 1 ? "item" : "items"}
                </h2>
                <ul className="mt-2 space-y-1 text-sm text-rust">
                  {overdue.map((r) =>
                <li key={r.id}>
                      <span className="font-medium">{itemFor(r.equipmentId)?.name ?? "Equipment"}</span> — due{" "}
                      {formatDate(r.dueDate)}, {lateDays(r)} {lateDays(r) === 1 ? "day" : "days"} late · late fee{" "}
                      {formatRWF(lateFee(r))}
                    </li>
                )}
                </ul>
              </div>
            </div>
            <PillButton size="sm" variant="danger" to="/client/rentals">
              Return Now
            </PillButton>
          </div>
        </section>
      }

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-ink/10 bg-white p-6 lg:col-span-2" aria-labelledby="current-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="current-heading" className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/55">
                Currently Renting
              </h2>
              <p className="mt-2 font-display text-6xl leading-none">{current.length}</p>
            </div>
            <Link
              to="/client/rentals"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60 transition-colors duration-150 hover:text-ink">
              
              All rentals <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6">
            {current.length === 0 ?
            <EmptyState
              title="Nothing rented"
              description="Browse the catalog and book equipment for your next training block."
              action={<PillButton size="sm" to="/client/equipment">Browse Equipment</PillButton>} /> :


            <ul className="divide-y divide-ink/10 border-t border-ink/10">
                {current.map((r) => {
                const item = itemFor(r.equipmentId);
                const status = rentalStatus(r);
                return (
                  <li key={r.id} className="flex items-center gap-4 py-4">
                      {item && <EquipmentPlaceholder category={item.category} size="sm" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item?.name ?? "Equipment"}</p>
                        <p className={`text-xs ${status === "Overdue" ? "text-rust" : "text-ink/55"}`}>
                          Due {formatDate(r.dueDate)}
                        </p>
                      </div>
                      <Badge tone={rentalTone(status)}>{status}</Badge>
                    </li>);

              })}
              </ul>
            }
          </div>
        </section>

        <aside className="flex flex-col rounded-2xl bg-ink p-6 text-paper" aria-label="Membership">
          <p className="font-serif text-base font-semibold uppercase tracking-[0.2em] text-gold">Your Membership</p>
          <p className="mt-3 font-display text-4xl uppercase leading-none">{client.membershipType}</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-paper/60">Member since</dt>
              <dd>{client.joinDate ? formatDate(client.joinDate) : "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-paper/60">Expires</dt>
              <dd>
                <Link
                  to="/client/billing"
                  className="underline decoration-paper/30 underline-offset-4 transition-colors duration-150 hover:decoration-paper">
                  
                  {client.membershipExpiry ? formatDate(client.membershipExpiry) : "—"}
                </Link>
              </dd>
            </div>
          </dl>
          <div className="mt-auto pt-8">
            <PillButton variant="cream" to="/client/equipment" fullWidth>
              Browse Equipment
            </PillButton>
          </div>
        </aside>
      </div>
    </div>);

}