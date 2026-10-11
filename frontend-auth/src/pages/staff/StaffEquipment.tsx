import React, { useState } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../../components/Badge";
import { EmptyState } from "../../components/dashboard/EmptyState";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { RowAction } from "../../components/dashboard/RowAction";
import { TableCard } from "../../components/dashboard/TableCard";
import { EquipmentForm, EquipmentFormData } from "../../components/forms/EquipmentForm";
import { Modal } from "../../components/Modal";
import { PillButton } from "../../components/PillButton";
import { useGymData } from "../../contexts/GymDataContext";
import { Equipment } from "../../types/gym";
import { formatRWF } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { equipmentTone } from "../../utils/statusTone";
import { tdClass, thClass } from "../../utils/tableStyles";

type FormState = {mode: "add";} | {mode: "edit";item: Equipment;} | null;

const columns = ["Name", "Category", "Daily Rate", "Purchased", "Status", ""];

export function StaffEquipment() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useGymData();
  const [form, setForm] = useState<FormState>(null);
  const [toDelete, setToDelete] = useState<Equipment | null>(null);

  async function handleSubmit(data: EquipmentFormData) {
    if (form?.mode === "edit") {
      const ok = await updateEquipment(form.item.id, data);
      if (!ok) return;
      toast.success(`${data.name} updated`);
    } else {
      const item = await addEquipment(data);
      if (!item) return;
      toast.success(`${item.name} registered`, { description: `${formatRWF(item.dailyRate)} per day · now available` });
    }
    setForm(null);
  }

  function confirmDelete() {
    if (!toDelete) return;
    deleteEquipment(toDelete.id);
    toast.success(`${toDelete.name} deleted`);
    setToDelete(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Inventory"
        title="Equipment"
        description={`${equipment.length} items · ${equipment.filter((e) => e.status === "Available").length} available`}
        actions={
        <PillButton onClick={() => setForm({ mode: "add" })}>
            <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Add New Equipment
          </PillButton>
        } />
      

      {equipment.length === 0 ?
      <EmptyState title="No equipment" description="Add your first item to start renting." /> :

      <TableCard>
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-ink/10 bg-cream/50">
              <tr>
                {columns.map((c, i) =>
              <th key={i} scope="col" className={thClass}>
                    {c}
                  </th>
              )}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {equipment.map((item) => {
              const rented = item.status === "Rented";
              return (
                <tr key={item.id}>
                    <td className={`${tdClass} font-medium text-ink`}>{item.name}</td>
                    <td className={tdClass}>{item.category}</td>
                    <td className={`${tdClass} tabular-nums`}>{formatRWF(item.dailyRate)}</td>
                    <td className={tdClass}>{formatDate(item.purchaseDate)}</td>
                    <td className={tdClass}>
                      <Badge tone={equipmentTone(item.status)}>{item.status}</Badge>
                    </td>
                    <td className={tdClass}>
                      <div className="flex justify-end gap-2">
                        <RowAction onClick={() => setForm({ mode: "edit", item })} ariaLabel={`Edit ${item.name}`}>
                          <PencilIcon className="h-3 w-3" aria-hidden="true" /> Edit
                        </RowAction>
                        <span className="group relative inline-flex">
                          <RowAction
                          tone="danger"
                          disabled={rented}
                          onClick={() => setToDelete(item)}
                          ariaLabel={`Delete ${item.name}`}
                          describedBy={rented ? `tip-${item.id}` : undefined}>
                          
                            <Trash2Icon className="h-3 w-3" aria-hidden="true" /> Delete
                          </RowAction>
                          {rented &&
                        <span
                          id={`tip-${item.id}`}
                          role="tooltip"
                          className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 w-52 rounded-lg bg-ink px-3 py-2 text-xs normal-case text-paper opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          
                              Can't delete while rented out. Mark it returned first.
                            </span>
                        }
                        </span>
                      </div>
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        </TableCard>
      }

      <Modal
        open={form !== null}
        onClose={() => setForm(null)}
        eyebrow="Inventory"
        title={form?.mode === "edit" ? "Edit Equipment" : "Add Equipment"}>
        
        {form &&
        <EquipmentForm
          key={form.mode === "edit" ? form.item.id : "new"}
          initial={form.mode === "edit" ? form.item : undefined}
          onSubmit={handleSubmit}
          onCancel={() => setForm(null)} />

        }
      </Modal>

      <Modal open={toDelete !== null} onClose={() => setToDelete(null)} eyebrow="Inventory" title="Delete Equipment?">
        {toDelete &&
        <div>
            <p className="text-[15px] text-ink/75">
              <span className="font-medium text-ink">{toDelete.name}</span> will be removed from the catalog. Past
              rental records will keep their history. This can't be undone.
            </p>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <PillButton variant="outline-dark" onClick={() => setToDelete(null)}>
                Cancel
              </PillButton>
              <PillButton variant="danger" onClick={confirmDelete}>
                Delete
              </PillButton>
            </div>
          </div>
        }
      </Modal>
    </div>);

}