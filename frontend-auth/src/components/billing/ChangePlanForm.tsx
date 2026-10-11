import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { PlanSelector } from "./PlanSelector";
import { PillButton } from "../PillButton";
import { useGymData } from "../../contexts/GymDataContext";
import { Client, MembershipType } from "../../types/gym";
import { formatDate } from "../../utils/date";
import { formatUSD, planFor, renewalBase } from "../../utils/membership";

interface ChangePlanFormProps {
  client: Client;
  onDone: () => void;
}

export function ChangePlanForm({ client, onDone }: ChangePlanFormProps) {
  const { changePlan } = useGymData();
  const [type, setType] = useState<MembershipType>(client.membershipType);
  const billingDate = renewalBase(client.membershipExpiry);
  const unchanged = type === client.membershipType;

  function confirm() {
    changePlan(client.id, type);
    const plan = planFor(type);
    toast.success(`Plan changed to ${type}`, {
      description: `${formatUSD(plan.price)}${plan.period} starting ${formatDate(billingDate)}`
    });
    onDone();
  }

  return (
    <div className="space-y-6">
      <PlanSelector value={type} onChange={setType} currentType={client.membershipType} label="Choose a new plan" />

      <div className="flex gap-3 rounded-xl bg-cream px-4 py-4 text-sm text-ink/80">
        <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
        <p>
          Your new plan starts at your next billing date:{" "}
          <span className="font-medium text-ink">{formatDate(billingDate)}</span>
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        {unchanged && <p className="text-xs text-ink/50 sm:mr-auto">Select a different plan to continue.</p>}
        <PillButton variant="outline-dark" onClick={onDone}>
          Cancel
        </PillButton>
        <PillButton onClick={confirm} disabled={unchanged}>
          Confirm Plan Change
        </PillButton>
      </div>
    </div>);

}