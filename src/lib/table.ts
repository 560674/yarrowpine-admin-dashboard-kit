export type SortDir = 'asc' | 'desc';
export interface Query<T> {
  search: string;
  searchKeys: (keyof T)[];
  sortKey?: keyof T;
  sortDir: SortDir;
  filters: Partial<Record<keyof T, string>>;
  page: number;
  pageSize: number;
}

export function filterRows<T>(rows: T[], q: Pick<Query<T>, 'search' | 'searchKeys' | 'filters'>): T[] {
  const s = q.search.trim().toLowerCase();
  return rows.filter((r) => {
    for (const [k, v] of Object.entries(q.filters) as [keyof T, string][]) {
      if (v && String(r[k]) !== v) return false;
    }
    if (!s) return true;
    return q.searchKeys.some((k) => String(r[k]).toLowerCase().includes(s));
  });
}

export function sortRows<T>(rows: T[], key: keyof T | undefined, dir: SortDir): T[] {
  if (!key) return rows;
  const m = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * m;
    return String(x).localeCompare(String(y)) * m;
  });
}

export function paginate<T>(rows: T[], page: number, pageSize: number) {
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  return { rows: rows.slice((p - 1) * pageSize, p * pageSize), page: p, pages, total: rows.length };
}

export function runQuery<T>(rows: T[], q: Query<T>) {
  return paginate(sortRows(filterRows(rows, q), q.sortKey, q.sortDir), q.page, q.pageSize);
}

export function toCsv<T extends object>(rows: T[], cols: (keyof T)[]): string {
  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.map(esc).join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}
