import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon } from "lucide-react";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Badge } from "../components/Badge";
import { FormField } from "../components/forms/FormField";
import { PasswordInput } from "../components/forms/PasswordInput";
import { SelectInput } from "../components/forms/SelectInput";
import { PillButton } from "../components/PillButton";
import { useGymData } from "../contexts/GymDataContext";
import { membershipTypes } from "../data/options";
import { Client, MembershipType } from "../types/gym";
import { describedBy, fieldClass } from "../utils/fieldStyles";
import { ApplicationValues, Errors, validateApplication } from "../utils/validation";

const empty: ApplicationValues = { fullName: "", phone: "", email: "", password: "", membershipType: "" };

export function Apply() {
  const { submitApplication } = useGymData();
  const [values, setValues] = useState<ApplicationValues>(empty);
  const [errors, setErrors] = useState<Errors<ApplicationValues>>({});
  const [submitted, setSubmitted] = useState<Client | null>(null);

  function update(field: keyof ApplicationValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validateApplication(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const result = await submitApplication({
      ...values,
      membershipType: values.membershipType as MembershipType
    });
    if (!result.ok) {
      setErrors({ email: result.error });
      return;
    }
    setSubmitted(result.client);
  }

  if (submitted) {
    return (
      <AuthLayout eyebrow="Thank You" title="Application Received">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
            <CheckIcon className="h-6 w-6" aria-hidden="true" />
          </div>
          <p role="status" className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-ink/75">
            Your membership application has been submitted and is pending staff approval.
          </p>
        </div>
        <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          {[
          { label: "Name", value: submitted.fullName },
          { label: "Email", value: submitted.email },
          { label: "Membership", value: submitted.membershipType }].
          map((row) =>
          <div key={row.label} className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">{row.label}</dt>
              <dd className="truncate text-sm font-medium text-ink">{row.value}</dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">Status</dt>
            <dd>
              <Badge tone="warning">Pending</Badge>
            </dd>
          </div>
        </dl>
        <p className="mt-5 text-center text-[13px] text-ink/55">
          You'll be able to log in and book equipment once a staff member approves you.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PillButton variant="outline-dark" to="/" fullWidth>
            Back to Home
          </PillButton>
          <PillButton to="/login" fullWidth>
            Log In
          </PillButton>
        </div>
      </AuthLayout>);

  }

  return (
    <AuthLayout
      wide
      eyebrow="Join GymRental"
      title="Apply for Membership"
      description="Tell us a little about yourself. Our staff review every application, usually within a day.">
      
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        <FormField id="app-name" label="Full Name" error={errors.fullName}>
          <input
            id="app-name"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="e.g. Aline Uwase"
            aria-invalid={!!errors.fullName}
            aria-describedby={describedBy("app-name", errors.fullName)}
            className={fieldClass(!!errors.fullName)} />
          
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField id="app-phone" label="Phone Number" error={errors.phone} hint="Format: 07XXXXXXXX">
            <input
              id="app-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={values.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
              placeholder="0781234567"
              aria-invalid={!!errors.phone}
              aria-describedby={describedBy("app-phone", errors.phone, "hint")}
              className={fieldClass(!!errors.phone)} />
            
          </FormField>
          <FormField id="app-email" label="Email" error={errors.email}>
            <input
              id="app-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.rw"
              aria-invalid={!!errors.email}
              aria-describedby={describedBy("app-email", errors.email)}
              className={fieldClass(!!errors.email)} />
            
          </FormField>
        </div>

        <FormField id="app-password" label="Password" error={errors.password} hint="At least 8 characters">
          <PasswordInput
            id="app-password"
            value={values.password}
            onChange={(v) => update("password", v)}
            autoComplete="new-password"
            hasError={!!errors.password}
            describedBy={describedBy("app-password", errors.password, "hint")} />
          
        </FormField>

        <FormField id="app-type" label="Preferred Membership Type" error={errors.membershipType}>
          <SelectInput
            id="app-type"
            value={values.membershipType}
            onChange={(e) => update("membershipType", e.target.value)}
            hasError={!!errors.membershipType}
            aria-invalid={!!errors.membershipType}
            aria-describedby={describedBy("app-type", errors.membershipType)}>
            
            <option value="" disabled>
              Select type
            </option>
            {membershipTypes.map((t) =>
            <option key={t} value={t} className="text-ink">
                {t}
              </option>
            )}
          </SelectInput>
        </FormField>

        <div className="pt-3">
          <PillButton type="submit" fullWidth>
            Submit Application
          </PillButton>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-ink/60">
        Already a member?{" "}
        <Link to="/login" className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          Log In
        </Link>
      </p>
    </AuthLayout>);

}