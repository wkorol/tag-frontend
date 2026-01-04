export function formatEur(pln: number, rate: number | null) {
  if (!rate || !Number.isFinite(pln)) {
    return null;
  }
  const eur = Math.round(pln * rate);
  return `~${eur}EUR`;
}
