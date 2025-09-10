export function formatNumber(n: unknown) {
  if (typeof n === 'number') return n.toLocaleString();
  const parsed = typeof n === 'string' ? Number(n) : NaN;
  return Number.isFinite(parsed) ? parsed.toLocaleString() : '—';
}

export function formatCompact(n: unknown) {
  const num = typeof n === 'number' ? n : typeof n === 'string' ? Number(n) : NaN;
  if (!Number.isFinite(num)) return '—';
  try {
    return new Intl.NumberFormat(undefined, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  } catch {
    return num.toLocaleString();
  }
}
