import React, { useState } from "react";
import { CreditCardIcon, LoaderCircleIcon, SmartphoneIcon } from "lucide-react";
import { FormField } from "../forms/FormField";
import { SelectInput } from "../forms/SelectInput";
import { PillButton } from "../PillButton";
import { mobileNetworks } from "../../data/plans";
import { PaymentDetails, PaymentMethod } from "../../types/gym";
import { describedBy, fieldClass } from "../../utils/fieldStyles";
import { formatUSD } from "../../utils/membership";
import { formatCardExpiry, formatCardNumber, maskPhone } from "../../utils/payment";
import { Errors, PaymentValues, validatePayment } from "../../utils/validation";

interface PaymentFormProps {
  amount: number;
  defaultPhone: string;
  processing: boolean;
  onSubmit: (details: PaymentDetails) => void;
}

const methods: {value: PaymentMethod;icon: typeof SmartphoneIcon;}[] = [
{ value: "Mobile Money", icon: SmartphoneIcon },
{ value: "Card", icon: CreditCardIcon }];


export function PaymentForm({ amount, defaultPhone, processing, onSubmit }: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentMethod>("Mobile Money");
  const [values, setValues] = useState<PaymentValues>({
    phone: defaultPhone,
    network: "MTN MoMo",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: ""
  });
  const [errors, setErrors] = useState<Errors<PaymentValues>>({});

  function update(field: keyof PaymentValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validatePayment(method, values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit(
      method === "Mobile Money" ?
      { method, methodDetail: `${values.network} · ${maskPhone(values.phone)}` } :
      { method, methodDetail: `Card •••• ${values.cardNumber.replace(/\D/g, "").slice(-4)}` }
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <fieldset disabled={processing} className="space-y-5">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/70">Payment Method</p>
          <div role="radiogroup" aria-label="Payment method" className="grid grid-cols-2 gap-1 rounded-full bg-cream p-1">
            {methods.map(({ value, icon: Icon }) => {
              const active = method === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setMethod(value);
                    setErrors({});
                  }}
                  className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-[background-color,color] duration-150 ${
                  active ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"}`
                  }>
                  
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {value}
                </button>);

            })}
          </div>
        </div>

        {method === "Mobile Money" ?
        <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField id="pay-phone" label="Phone Number" error={errors.phone} hint="Format: 07XXXXXXXX">
                <input
                id="pay-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={values.phone}
                onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
                aria-invalid={!!errors.phone}
                aria-describedby={describedBy("pay-phone", errors.phone, "hint")}
                className={fieldClass(!!errors.phone)} />
              
              </FormField>
              <FormField id="pay-network" label="Network" error={errors.network}>
                <SelectInput
                id="pay-network"
                value={values.network}
                onChange={(e) => update("network", e.target.value)}
                hasError={!!errors.network}>
                
                  {mobileNetworks.map((n) =>
                <option key={n} value={n} className="text-ink">
                      {n}
                    </option>
                )}
                </SelectInput>
              </FormField>
            </div>
            <p className="text-[13px] text-ink/55">You'll get a prompt on your phone to approve this payment.</p>
          </> :

        <>
            <FormField id="pay-card" label="Card Number" error={errors.cardNumber}>
              <input
              id="pay-card"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="XXXX XXXX XXXX XXXX"
              value={values.cardNumber}
              onChange={(e) => update("cardNumber", formatCardNumber(e.target.value))}
              aria-invalid={!!errors.cardNumber}
              aria-describedby={describedBy("pay-card", errors.cardNumber)}
              className={`${fieldClass(!!errors.cardNumber)} font-mono tracking-wider`} />
            
            </FormField>
            <div className="grid grid-cols-2 gap-5">
              <FormField id="pay-expiry" label="Expiry" error={errors.expiry}>
                <input
                id="pay-expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={values.expiry}
                onChange={(e) => update("expiry", formatCardExpiry(e.target.value))}
                aria-invalid={!!errors.expiry}
                aria-describedby={describedBy("pay-expiry", errors.expiry)}
                className={`${fieldClass(!!errors.expiry)} font-mono`} />
              
              </FormField>
              <FormField id="pay-cvv" label="CVV" error={errors.cvv}>
                <input
                id="pay-cvv"
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="•••"
                maxLength={3}
                value={values.cvv}
                onChange={(e) => update("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))}
                aria-invalid={!!errors.cvv}
                aria-describedby={describedBy("pay-cvv", errors.cvv)}
                className={`${fieldClass(!!errors.cvv)} font-mono`} />
              
              </FormField>
            </div>
            <FormField id="pay-name" label="Cardholder Name" error={errors.cardName}>
              <input
              id="pay-name"
              type="text"
              autoComplete="cc-name"
              value={values.cardName}
              onChange={(e) => update("cardName", e.target.value)}
              aria-invalid={!!errors.cardName}
              aria-describedby={describedBy("pay-name", errors.cardName)}
              className={fieldClass(!!errors.cardName)} />
            
            </FormField>
          </>
        }

        <div className="flex items-center justify-between rounded-2xl bg-ink px-5 py-5 text-paper">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/70">Total Due</span>
          <span className="font-display text-4xl">{formatUSD(amount)}</span>
        </div>

        <PillButton type="submit" fullWidth disabled={processing}>
          {processing ?
          <>
              <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
              Processing…
            </> :

          "Confirm Payment"
          }
        </PillButton>
        {processing &&
        <p role="status" className="text-center text-[13px] text-ink/55">
            Confirming with {method === "Mobile Money" ? values.network : "your bank"}…
          </p>
        }
      </fieldset>
    </form>);

}