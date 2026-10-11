import React from "react";
import { DumbbellIcon, HeartPulseIcon, PersonStandingIcon, WavesIcon, BoxIcon } from "lucide-react";
import { EquipmentCategory } from "../../types/gym";
const icons: Record<EquipmentCategory, BoxIcon> = {
  Cardio: HeartPulseIcon,
  Strength: DumbbellIcon,
  Yoga: PersonStandingIcon,
  Recovery: WavesIcon
};
interface EquipmentPlaceholderProps {
  category: EquipmentCategory;
  size?: "lg" | "sm";
}
export function EquipmentPlaceholder({
  category,
  size = "lg"
}: EquipmentPlaceholderProps) {
  const Icon = icons[category];
  if (size === "sm") {
    return <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream text-ink/50">
        <Icon className="h-6 w-6" />
      </div>;
  }
  return <div aria-hidden="true" className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl bg-cream">
      <span className="absolute -bottom-3 left-3 select-none font-display text-6xl uppercase leading-none text-ink/[0.06]">
        {category}
      </span>
      <Icon className="relative h-10 w-10 text-ink/40" strokeWidth={1.5} />
    </div>;
}