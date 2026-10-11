import React from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { PillButton } from "../PillButton";
import { MembershipType, Payment } from "../../types/gym";
import { formatDate } from "../../utils/date";
import { formatUSD } from "../../utils/membership";

interface PaymentSuccessProps {
  payment: Payment;
  expiry: string;
  planType: MembershipType;
  onDone: () => void;
}

export function PaymentSuccess({ payment, expiry, planType, onDone }: PaymentSuccessProps) {
  const rows = [
  { label: "Plan", value: `${planType} Membership` },
  { label: "Amount Paid", value: formatUSD(payment.amount) },
  { label: "Paid With", value: payment.methodDetail },
  { label: "Date", value: formatDate(payment.date) }];


  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
      
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage text-paper">
          
          <CheckIcon className="h-7 w-7" aria-hidden="true" />
        </motion.div>
        <h3 className="mt-5 font-display text-4xl uppercase">Payment Successful</h3>
        <p className="mt-2 text-sm text-ink/60">Your membership is now active until</p>
        <p className="mt-1 font-display text-2xl uppercase">{formatDate(expiry)}</p>
      </div>

      <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {rows.map((row) =>
        <div key={row.label} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">{row.label}</dt>
            <dd className="text-right text-sm font-medium">{row.value}</dd>
          </div>
        )}
      </dl>

      <div className="mt-8">
        <PillButton fullWidth onClick={onDone}>
          Back to Dashboard
        </PillButton>
      </div>
    </motion.div>);

}