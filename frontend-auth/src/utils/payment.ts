export function formatCardNumber(raw: string): string {
  return raw.
  replace(/\D/g, "").
  slice(0, 16).
  replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatCardExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function maskPhone(phone: string): string {
  return `${phone.slice(0, 3)}•••${phone.slice(-4)}`;
}