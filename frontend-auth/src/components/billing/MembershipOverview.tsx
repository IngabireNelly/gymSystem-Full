import React from "react";
import { CircleAlertIcon } from "lucide-react";
import { Badge } from "../Badge";
import { PillButton } from "../PillButton";
import { Client } from "../../types/gym";
import { daysUntil, formatDate } from "../../utils/date";
import { formatUSD, membershipStatus, planFor } from "../../utils/membership";
import { membershipTone } from "../../utils/statusTone";

interface MembershipOverviewProps {
  client: Client;
  onRenew: () => void;
  onChangePlan: () => void;
}

export function MembershipOverview({ client, onRenew, onChangePlan }: MembershipOverviewProps) {
  const status = membershipStatus(client.membershipExpiry);
  const plan = planFor(client.membershipType);
  const daysLeft = client.membershipExpiry ? daysUntil(client.membershipExpiry) : 0;
  const needsRenewal = status === "Expired" || status === "Expiring Soon";

  return (
    <section aria-labelledby="plan-heading" className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
      {needsRenewal && client.membershipExpiry &&
      <div
        role="alert"
        className={`flex items-center gap-2.5 px-6 py-3 text-sm md:px-8 ${
        status === "Expired" ? "bg-rust-soft text-rust" : "bg-gold/15 text-gold-deep"}`
        }>
        
          <CircleAlertIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {status === "Expired" ?
        `Your membership expired on ${formatDate(client.membershipExpiry)}. Renew to keep renting equipment.` :
        daysLeft === 0 ?
        "Your membership expires today. Renew now to avoid interruption." :
        `Your membership expires in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}. Renew now to avoid interruption.`}
        </div>
      }

      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-serif text-base font-semibold uppercase tracking-[0.2em] text-gold-deep">Current Plan</p>
            {status && <Badge tone={membershipTone(status)}>{status}</Badge>}
          </div>
          <h2 id="plan-heading" className="mt-2 font-display text-6xl uppercase leading-none">
            {client.membershipType}
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            {formatUSD(plan.price)}
            {plan.period} · {plan.billing}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ink/10 pt-6 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/55">Start Date</dt>
              <dd className="mt-1 text-[15px] font-medium">{client.joinDate ? formatDate(client.joinDate) : "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/55">Expiry Date</dt>
              <dd
                className={`mt-1 text-[15px] font-medium ${
                status === "Expired" ? "text-rust" : status === "Expiring Soon" ? "text-gold-deep" : ""}`
                }>
                
                {client.membershipExpiry ? formatDate(client.membershipExpiry) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/55">Days Remaining</dt>
              <dd className="mt-1 text-[15px] font-medium">{Math.max(0, daysLeft)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
          <PillButton
            variant={status === "Expired" ? "danger" : status === "Expiring Soon" ? "warning" : "dark"}
            onClick={onRenew}>
            
            {needsRenewal ? "Renew Now" : "Renew Early"}
          </PillButton>
          <PillButton variant="outline-dark" onClick={onChangePlan}>
            Change Plan
          </PillButton>
        </div>
      </div>
    </section>);

}