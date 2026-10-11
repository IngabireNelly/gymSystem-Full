import React, { useState } from "react";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "../../components/dashboard/EmptyState";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { RowAction } from "../../components/dashboard/RowAction";
import { TableCard } from "../../components/dashboard/TableCard";
import { Toggle } from "../../components/dashboard/Toggle";
import { MemberEditForm } from "../../components/forms/MemberEditForm";
import { Modal } from "../../components/Modal";
import { useGymData } from "../../contexts/GymDataContext";
import { Client, ClientUpdate } from "../../types/gym";
import { Badge } from "../../components/Badge";
import { formatDate } from "../../utils/date";
import { membershipStatus } from "../../utils/membership";
import { membershipTone } from "../../utils/statusTone";
import { tdClass, thClass } from "../../utils/tableStyles";

const columns = ["Member", "Phone", "Membership", "Joined", "Expires", "Renewal", "Active", ""];

export function StaffMembers() {
  const { clients, updateClient, setClientActive } = useGymData();
  const [editing, setEditing] = useState<Client | null>(null);
  const members = clients.filter((c) => c.status === "ACTIVE" || c.status === "INACTIVE");
  const activeCount = members.filter((c) => c.status === "ACTIVE").length;

  function toggle(client: Client, active: boolean) {
    setClientActive(client.id, active);
    toast.success(`${client.fullName} ${active ? "activated" : "deactivated"}`, {
      description: active ? "They can log in and rent again." : "They can no longer log in or rent equipment."
    });
  }

  function handleEdit(update: ClientUpdate) {
    if (!editing) return;
    updateClient(editing.id, update);
    toast.success(`${update.fullName} updated`);
    setEditing(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Community"
        title="Members"
        description={`${members.length} approved members · ${activeCount} active`} />
      

      {members.length === 0 ?
      <EmptyState title="No members yet" description="Approved applications will appear here." /> :

      <TableCard>
          <table className="w-full min-w-[1040px]">
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
              {members.map((m) => {
              const active = m.status === "ACTIVE";
              return (
                <tr key={m.id} className={active ? undefined : "bg-ink/[0.02]"}>
                    <td className={tdClass}>
                      <p className={`font-medium ${active ? "text-ink" : "text-ink/45"}`}>{m.fullName}</p>
                      <p className="text-xs text-ink/50">{m.email}</p>
                    </td>
                    <td className={`${tdClass} tabular-nums`}>{m.phone}</td>
                    <td className={tdClass}>
                      <span className="rounded-full border border-ink/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/70">
                        {m.membershipType}
                      </span>
                    </td>
                    <td className={`${tdClass} whitespace-nowrap`}>{m.joinDate ? formatDate(m.joinDate) : "—"}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {m.membershipExpiry ? formatDate(m.membershipExpiry) : "—"}
                    </td>
                    <td className={tdClass}>
                      {(() => {
                      const ms = membershipStatus(m.membershipExpiry);
                      return ms ? <Badge tone={membershipTone(ms)}>{ms}</Badge> : <span className="text-ink/35">—</span>;
                    })()}
                    </td>
                    <td className={tdClass}>
                      <Toggle checked={active} onChange={(v) => toggle(m, v)} label={`${m.fullName} active`} />
                    </td>
                    <td className={tdClass}>
                      <div className="flex justify-end gap-2">
                        <RowAction onClick={() => setEditing(m)} ariaLabel={`Edit ${m.fullName}`}>
                          <PencilIcon className="h-3 w-3" aria-hidden="true" /> Edit
                        </RowAction>
                        <RowAction tone={active ? "danger" : "default"} onClick={() => toggle(m, !active)}>
                          {active ? "Deactivate" : "Activate"}
                        </RowAction>
                      </div>
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        </TableCard>
      }

      <Modal open={editing !== null} onClose={() => setEditing(null)} eyebrow="Community" title="Edit Member">
        {editing &&
        <MemberEditForm key={editing.id} client={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        }
      </Modal>
    </div>);

}