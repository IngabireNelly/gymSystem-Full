import React from "react";
import { Badge } from "../../components/Badge";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useGymData } from "../../contexts/GymDataContext";
import { initials } from "../../utils/auth";
import { formatDate } from "../../utils/date";
import { clientStatusLabel, clientTone } from "../../utils/statusTone";

export function ClientProfile() {
  const { currentUser } = useAuth();
  const { clients } = useGymData();
  const client = clients.find((c) => c.id === currentUser?.id);
  if (!client) return null;

  const rows = [
  { label: "Full Name", value: client.fullName },
  { label: "Phone", value: client.phone },
  { label: "Email", value: client.email },
  { label: "Membership Type", value: client.membershipType },
  { label: "Join Date", value: client.joinDate ? formatDate(client.joinDate) : "—" }];


  return (
    <div>
      <PageHeader eyebrow="Account" title="My Profile" description="Need to change something? Contact our staff at the front desk." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center rounded-2xl bg-cream p-8 text-center">
          <div
            aria-hidden="true"
            className="flex h-24 w-24 items-center justify-center rounded-full bg-ink font-display text-3xl text-paper">
            
            {initials(client.fullName)}
          </div>
          <p className="mt-5 font-display text-2xl uppercase leading-tight">{client.fullName}</p>
          <div className="mt-3">
            <Badge tone={clientTone(client.status)}>{clientStatusLabel(client.status)}</Badge>
          </div>
        </div>

        <dl className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white px-6">
          {rows.map((row) =>
          <div key={row.label} className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[200px_1fr] sm:items-center">
              <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/55">{row.label}</dt>
              <dd className="text-[15px] text-ink">{row.value}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>);

}