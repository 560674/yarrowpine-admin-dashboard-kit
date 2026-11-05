const tone: Record<string, string> = {
  Active: 'ok', Paid: 'ok', Invited: 'info', Pending: 'warn', Suspended: 'bad', Refunded: 'bad',
  Admin: 'info', Editor: 'muted', Viewer: 'muted',
};
export function StatusPill({ value }: { value: string }) {
  return <span className={`pill ${tone[value] ?? 'muted'}`}>{value}</span>;
}
