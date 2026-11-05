export const money = (n: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
export const num = (n: number) => new Intl.NumberFormat('en-US').format(n);
export const pct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
export function change(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}
