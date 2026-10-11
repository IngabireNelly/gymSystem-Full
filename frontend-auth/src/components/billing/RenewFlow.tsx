import React, { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { PaymentForm } from "./PaymentForm";
import { PaymentSuccess } from "./PaymentSuccess";
import { PlanSelector } from "./PlanSelector";
import { FormField } from "../forms/FormField";
import { PillButton } from "../PillButton";
import { useGymData } from "../../contexts/GymDataContext";
import { Client, MembershipType, Payment, PaymentDetails } from "../../types/gym";
import { formatDate, todayISO } from "../../utils/date";
import { computeNewExpiry, formatUSD, planFor } from "../../utils/membership";

type Step = "plan" | "payment" | "success";

interface RenewFlowProps {
  client: Client;
  onBusyChange: (busy: boolean) => void;
  onDone: () => void;
}

const PROCESSING_MS = 1600;

export function RenewFlow({ client, onBusyChange, onDone }: RenewFlowProps) {
  const { renewMembership } = useGymData();
  const [step, setStep] = useState<Step>("plan");
  const [type, setType] = useState<MembershipType>(client.membershipType);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{expiry: string;payment: Payment;} | null>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const plan = planFor(type);
  const newExpiry = computeNewExpiry(client.membershipExpiry, type);
  const stacking = !!client.membershipExpiry && client.membershipExpiry >= todayISO();

  function handlePay(details: PaymentDetails) {
    setProcessing(true);
    onBusyChange(true);
    timer.current = window.setTimeout(async () => {
      const res = await renewMembership(client.id, type, details);
      setProcessing(false);
      onBusyChange(false);
      if (!res) {
        toast.error("Payment couldn't be completed. Please try again.");
        return;
      }
      setResult(res);
      setStep("success");
      toast.success("Payment successful", { description: `Membership active until ${formatDate(res.expiry)}` });
    }, PROCESSING_MS);
  }

  if (step === "success" && result) {
    return <PaymentSuccess payment={result.payment} expiry={result.expiry} planType={type} onDone={onDone} />;
  }

  if (step === "payment") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setStep("plan")}
          disabled={processing}
          className="mb-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60 transition-colors duration-150 hover:text-ink disabled:opacity-40">
          
          <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {type} plan · {formatUSD(plan.price)}
        </button>
        <PaymentForm amount={plan.price} defaultPhone={client.phone} processing={processing} onSubmit={handlePay} />
      </div>);

  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/70">Membership Type</p>
        <PlanSelector value={type} onChange={setType} currentType={client.membershipType} label="Membership type" />
      </div>

      <FormField id="renew-expiry" label="New Expiry Date">
        <output
          id="renew-expiry"
          aria-live="polite"
          className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-ink/15 bg-white px-4 py-3">
          
          <span className="text-[15px] font-medium text-ink">{formatDate(newExpiry)}</span>
          <span className="text-xs text-ink/55">
            {stacking && client.membershipExpiry ?
            `Added to your current expiry (${formatDate(client.membershipExpiry)})` :
            "Starts today"}
          </span>
        </output>
      </FormField>

      <section aria-label="Order summary" className="rounded-2xl bg-cream p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/60">Order Summary</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink/65">Plan</dt>
            <dd className="font-medium">{type} Membership</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink/65">Duration</dt>
            <dd>
              {plan.months} {plan.months === 1 ? "month" : "months"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink/65">New expiry</dt>
            <dd>{formatDate(newExpiry)}</dd>
          </div>
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-ink/15 pt-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/60">Total</span>
          <span className="font-display text-3xl">{formatUSD(plan.price)}</span>
        </div>
      </section>

      <PillButton fullWidth onClick={() => setStep("payment")}>
        Proceed to Payment
      </PillButton>
    </div>);

}