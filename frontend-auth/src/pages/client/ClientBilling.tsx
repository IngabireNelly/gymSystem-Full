import React, { useState } from "react";
import { BillingHistory } from "../../components/billing/BillingHistory";
import { ChangePlanForm } from "../../components/billing/ChangePlanForm";
import { MembershipOverview } from "../../components/billing/MembershipOverview";
import { RenewFlow } from "../../components/billing/RenewFlow";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { Modal } from "../../components/Modal";
import { useAuth } from "../../contexts/AuthContext";
import { useGymData } from "../../contexts/GymDataContext";

type Flow = "renew" | "change" | null;

export function ClientBilling() {
  const { currentUser } = useAuth();
  const { clients, payments } = useGymData();
  const [flow, setFlow] = useState<Flow>(null);
  const [busy, setBusy] = useState(false);
  const client = clients.find((c) => c.id === currentUser?.id);
  if (!client) return null;

  const mine = payments.filter((p) => p.clientId === client.id);
  const close = () => {
    if (!busy) setFlow(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Membership & Billing"
        description="Manage your plan, renew your membership, and review past payments." />
      

      <MembershipOverview client={client} onRenew={() => setFlow("renew")} onChangePlan={() => setFlow("change")} />

      <section aria-labelledby="billing-history" className="mt-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="billing-history" className="font-display text-3xl uppercase">
            Billing History
          </h2>
          <span className="text-xs text-ink/50">
            {mine.length} {mine.length === 1 ? "payment" : "payments"}
          </span>
        </div>
        <BillingHistory payments={mine} />
      </section>

      <Modal
        open={flow !== null}
        onClose={close}
        eyebrow={flow === "change" ? "Membership" : "Renewal"}
        title={flow === "change" ? "Change Your Plan" : "Renew Membership"}>
        
        {flow === "renew" && <RenewFlow client={client} onBusyChange={setBusy} onDone={() => setFlow(null)} />}
        {flow === "change" && <ChangePlanForm client={client} onDone={() => setFlow(null)} />}
      </Modal>
    </div>);

}