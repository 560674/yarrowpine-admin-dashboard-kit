export function LineChart({ values, labels, height = 220 }: { values: number[]; labels: string[]; height?: number }) {
  const w = 640;
  const pad = 28;
  const max = Math.max(...values) * 1.1;
  const x = (i: number) => pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1);
  const y = (v: number) => height - pad - (v / max) * (height - pad * 2);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="chart" role="img" aria-label="Revenue by month">
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={y(max * t / 1.1)} y2={y(max * t / 1.1)} className="grid" />
      ))}
      <path d={`${d} L${x(values.length - 1)},${height - pad} L${x(0)},${height - pad} Z`} className="area" />
      <path d={d} className="line" />
      {labels.map((l, i) => (
        <text key={l} x={x(i)} y={height - 8} textAnchor="middle" className="axis">{l}</text>
      ))}
    </svg>
  );
}

export function BarList({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <ul className="barlist">
      {items.map((i) => (
        <li key={i.label}>
          <span>{i.label}</span>
          <span className="bar" aria-hidden="true"><span style={{ width: `${(i.value / max) * 100}%` }} /></span>
          <strong>{i.value}%</strong>
        </li>
      ))}
    </ul>
  );
}
