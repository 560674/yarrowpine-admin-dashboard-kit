import { BarList, LineChart } from '../components/Charts';
import { StatCard } from '../components/StatCard';
import { StatusPill } from '../components/StatusPill';
import { channels, makeOrders, months, revenue } from '../data/demo';
import { change, money, num } from '../lib/format';

export function Dashboard() {
  const orders = makeOrders();
  const last = revenue.at(-1)!;
  const prev = revenue.at(-2)!;
  return (
    <div className="stack">
      <div className="stats">
        <StatCard label="Revenue" value={money(last)} delta={change(last, prev)} />
        <StatCard label="Orders" value={num(orders.length * 21)} delta={4.2} />
        <StatCard label="Active users" value={num(3184)} delta={2.9} />
        <StatCard label="Refund rate" value="1.8%" delta={-0.4} />
      </div>
      <div className="split">
        <section className="card">
          <h2>Revenue</h2>
          <LineChart values={revenue} labels={months} />
        </section>
        <section className="card">
          <h2>Traffic sources</h2>
          <BarList items={channels} />
        </section>
      </div>
      <section className="card">
        <h2>Recent orders</h2>
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th className="right">Total</th></tr></thead>
          <tbody>
            {orders.slice(0, 5).map((o) => (
              <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td><StatusPill value={o.status} /></td><td className="right">{money(o.total)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
