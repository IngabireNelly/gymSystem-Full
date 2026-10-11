export function fieldClass(hasError: boolean): string {
  return `block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 ${
  hasError ?
  "border-rust focus:border-rust focus:ring-rust/20" :
  "border-ink/15 focus:border-gold focus:ring-gold/25"}`;

}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}