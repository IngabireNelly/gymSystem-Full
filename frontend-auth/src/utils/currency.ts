export function formatRWF(amount: number): string {
  return `RWF ${Math.round(amount).toLocaleString("en-US")}`;
}