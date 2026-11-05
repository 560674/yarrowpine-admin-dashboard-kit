import { pct } from '../lib/format';
import { Icon } from './Icon';

export function StatCard({ label, value, delta }: { label: string; value: string; delta: number }) {
  const up = delta >= 0;
  return (
    <section className="card stat">
      <h3>{label}</h3>
      <p className="value">{value}</p>
      <p className={up ? 'delta up' : 'delta down'}>
        <Icon name={up ? 'up' : 'down'} size={14} /> {pct(delta)} <span>vs last month</span>
      </p>
    </section>
  );
}
