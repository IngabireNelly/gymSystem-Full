import React, { useState } from "react";
import { FormField } from "./FormField";
import { SelectInput } from "./SelectInput";
import { PillButton } from "../PillButton";
import { membershipTypes } from "../../data/options";
import { Client, ClientUpdate, MembershipType } from "../../types/gym";
import { describedBy, fieldClass } from "../../utils/fieldStyles";
import { Errors, MemberEditValues, validateMemberEdit } from "../../utils/validation";

interface MemberEditFormProps {
  client: Client;
  onSubmit: (update: ClientUpdate) => void;
  onCancel: () => void;
}

export function MemberEditForm({ client, onSubmit, onCancel }: MemberEditFormProps) {
  const [values, setValues] = useState<MemberEditValues>({
    fullName: client.fullName,
    phone: client.phone,
    membershipType: client.membershipType
  });
  const [errors, setErrors] = useState<Errors<MemberEditValues>>({});

  function update(field: keyof MemberEditValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validateMemberEdit(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({
      fullName: values.fullName.trim(),
      phone: values.phone,
      membershipType: values.membershipType as MembershipType
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <FormField id="edit-name" label="Full Name" error={errors.fullName}>
        <input
          id="edit-name"
          type="text"
          value={values.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          aria-invalid={!!errors.fullName}
          aria-describedby={describedBy("edit-name", errors.fullName)}
          className={fieldClass(!!errors.fullName)} />
        
      </FormField>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField id="edit-phone" label="Phone Number" error={errors.phone} hint="Format: 07XXXXXXXX">
          <input
            id="edit-phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={values.phone}
            onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("edit-phone", errors.phone, "hint")}
            className={fieldClass(!!errors.phone)} />
          
        </FormField>
        <FormField id="edit-type" label="Membership Type" error={errors.membershipType}>
          <SelectInput
            id="edit-type"
            value={values.membershipType}
            onChange={(e) => update("membershipType", e.target.value)}
            hasError={!!errors.membershipType}>
            
            {membershipTypes.map((t) =>
            <option key={t} value={t} className="text-ink">
                {t}
              </option>
            )}
          </SelectInput>
        </FormField>
      </div>
      <p className="text-[13px] text-ink/50">Email: {client.email}</p>
      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <PillButton variant="outline-dark" onClick={onCancel}>
          Cancel
        </PillButton>
        <PillButton type="submit">Save Changes</PillButton>
      </div>
    </form>);

}