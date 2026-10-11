import React, { useState } from "react";
import { EquipmentPlaceholder } from "../../components/client/EquipmentPlaceholder";
import { EmptyState } from "../../components/dashboard/EmptyState";
import { FilterTabs } from "../../components/dashboard/FilterTabs";
import { PageHeader } from "../../components/dashboard/PageHeader";
import { BookingForm } from "../../components/forms/BookingForm";
import { Modal } from "../../components/Modal";
import { PillButton } from "../../components/PillButton";
import { useAuth } from "../../contexts/AuthContext";
import { useGymData } from "../../contexts/GymDataContext";
import { equipmentCategories } from "../../data/options";
import { Equipment, EquipmentCategory } from "../../types/gym";
import { formatRWF } from "../../utils/currency";

type CategoryFilter = "All" | EquipmentCategory;

export function ClientBrowse() {
  const { currentUser } = useAuth();
  const { equipment } = useGymData();
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [booking, setBooking] = useState<Equipment | null>(null);

  const available = equipment.filter((e) => e.status === "Available");
  const visible = category === "All" ? available : available.filter((e) => e.category === category);
  const options = [
  { value: "All" as CategoryFilter, label: "All", count: available.length },
  ...equipmentCategories.map((c) => ({
    value: c as CategoryFilter,
    label: c,
    count: available.filter((e) => e.category === c).length
  }))];


  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Browse Equipment"
        description="Everything listed here is available to rent today. Pick a due date and you're set." />
      

      <FilterTabs label="Filter by category" options={options} value={category} onChange={setCategory} />

      {visible.length === 0 ?
      <div className="mt-8">
          <EmptyState
          title="Nothing available"
          description="Every item in this category is currently rented or being serviced. Check back soon." />
        
        </div> :

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) =>
        <li key={item.id}>
              <article className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-4">
                <EquipmentPlaceholder category={item.category} />
                <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
                  <p className="font-serif text-sm font-semibold uppercase tracking-[0.18em] text-gold-deep">
                    {item.category}
                  </p>
                  <h2 className="mt-1 font-display text-2xl uppercase leading-tight">{item.name}</h2>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <p>
                      <span className="font-display text-xl">{formatRWF(item.dailyRate)}</span>
                      <span className="ml-1 text-xs text-ink/50">/ day</span>
                    </p>
                    <PillButton size="sm" onClick={() => setBooking(item)}>
                      Rent This
                    </PillButton>
                  </div>
                </div>
              </article>
            </li>
        )}
        </ul>
      }

      <Modal open={booking !== null} onClose={() => setBooking(null)} eyebrow="Book Equipment" title="New Rental">
        {booking && currentUser &&
        <BookingForm
          key={booking.id}
          equipment={booking}
          clientId={currentUser.id}
          clientName={currentUser.fullName}
          onClose={() => setBooking(null)} />

        }
      </Modal>
    </div>);

}