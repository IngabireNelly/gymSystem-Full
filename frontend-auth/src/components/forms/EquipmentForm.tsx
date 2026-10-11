import React, { useState } from "react";
import { FormField } from "./FormField";
import { SelectInput } from "./SelectInput";
import { PillButton } from "../PillButton";
import { equipmentCategories } from "../../data/options";
import { Equipment, EquipmentCategory, EquipmentStatus, NewEquipment } from "../../types/gym";
import { todayISO } from "../../utils/date";
import { describedBy, fieldClass } from "../../utils/fieldStyles";
import { Errors, EquipmentValues, validateEquipment } from "../../utils/validation";

export type EquipmentFormData = NewEquipment & {status?: EquipmentStatus;};

interface EquipmentFormProps {
  initial?: Equipment;
  onSubmit: (data: EquipmentFormData) => void;
  onCancel: () => void;
}

export function EquipmentForm({ initial, onSubmit, onCancel }: EquipmentFormProps) {
  const [values, setValues] = useState<EquipmentValues>({
    name: initial?.name ?? "",
    category: initial?.category ?? "",
    dailyRate: initial ? String(initial.dailyRate) : "",
    purchaseDate: initial?.purchaseDate ?? ""
  });
  const [status, setStatus] = useState<EquipmentStatus>(initial?.status ?? "Available");
  const [errors, setErrors] = useState<Errors<EquipmentValues>>({});
  const isRented = initial?.status === "Rented";

  function update(field: keyof EquipmentValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validateEquipment(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({
      name: values.name.trim(),
      category: values.category as EquipmentCategory,
      dailyRate: Number(values.dailyRate),
      purchaseDate: values.purchaseDate,
      ...(initial && !isRented ? { status } : {})
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <FormField id="eq-name" label="Equipment Name" error={errors.name}>
        <input
          id="eq-name"
          type="text"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Spin Bike"
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("eq-name", errors.name)}
          className={fieldClass(!!errors.name)} />
        
      </FormField>

      <FormField id="eq-category" label="Category" error={errors.category}>
        <SelectInput
          id="eq-category"
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          hasError={!!errors.category}
          aria-invalid={!!errors.category}
          aria-describedby={describedBy("eq-category", errors.category)}>
          
          <option value="" disabled>
            Select a category
          </option>
          {equipmentCategories.map((c) =>
          <option key={c} value={c} className="text-ink">
              {c}
            </option>
          )}
        </SelectInput>
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField id="eq-rate" label="Daily Rental Rate" error={errors.dailyRate}>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-ink/50">
              RWF
            </span>
            <input
              id="eq-rate"
              type="number"
              inputMode="numeric"
              min={1}
              value={values.dailyRate}
              onChange={(e) => update("dailyRate", e.target.value)}
              placeholder="5000"
              aria-invalid={!!errors.dailyRate}
              aria-describedby={describedBy("eq-rate", errors.dailyRate)}
              className={`${fieldClass(!!errors.dailyRate)} pl-14`} />
            
          </div>
        </FormField>
        <FormField id="eq-date" label="Purchase Date" error={errors.purchaseDate}>
          <input
            id="eq-date"
            type="date"
            max={todayISO()}
            value={values.purchaseDate}
            onChange={(e) => update("purchaseDate", e.target.value)}
            aria-invalid={!!errors.purchaseDate}
            aria-describedby={describedBy("eq-date", errors.purchaseDate)}
            className={fieldClass(!!errors.purchaseDate)} />
          
        </FormField>
      </div>

      {initial &&
      <FormField
        id="eq-status"
        label="Status"
        hint={isRented ? "Rented items become available automatically when returned." : undefined}>
        
          <SelectInput
          id="eq-status"
          value={isRented ? "Rented" : status}
          disabled={isRented}
          onChange={(e) => setStatus(e.target.value as EquipmentStatus)}
          aria-describedby={isRented ? "eq-status-hint" : undefined}
          className="disabled:cursor-not-allowed disabled:bg-ink/5">
          
            {isRented && <option value="Rented">Rented</option>}
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
          </SelectInput>
        </FormField>
      }

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <PillButton variant="outline-dark" onClick={onCancel}>
          Cancel
        </PillButton>
        <PillButton type="submit">{initial ? "Save Changes" : "Register Equipment"}</PillButton>
      </div>
    </form>);

}