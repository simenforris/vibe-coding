export function formatNumber(n: number | undefined | null): string {
  if (typeof n !== 'number') return '-';
  return n.toLocaleString();
}

