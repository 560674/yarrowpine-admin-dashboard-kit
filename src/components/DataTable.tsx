import { useMemo, useState, type ReactNode } from 'react';
import { runQuery, toCsv, type SortDir } from '../lib/table';
import { Icon } from './Icon';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
  align?: 'right';
}
interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  filter?: { key: keyof T; label: string; options: string[] };
  pageSize?: number;
  csvName?: string;
  caption: string;
}

export function DataTable<T extends object>({ rows, columns, searchKeys, filter, pageSize = 10, csvName, caption }: Props<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | undefined>();
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterValue, setFilterValue] = useState('');
  const [page, setPage] = useState(1);
  const filters = useMemo(
    () => (filter && filterValue ? { [filter.key]: filterValue } : {}) as Partial<Record<keyof T, string>>,
    [filter, filterValue],
  );
  const result = runQuery(rows, { search, searchKeys, sortKey, sortDir, filters, page, pageSize });

  const sortBy = (k: keyof T) => {
    setPage(1);
    if (sortKey === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(k);
      setSortDir('asc');
    }
  };
  const exportCsv = () => {
    const all = runQuery(rows, { search, searchKeys, sortKey, sortDir, filters, page: 1, pageSize: rows.length || 1 });
    const blob = new Blob([toCsv(all.rows, columns.map((c) => c.key))], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = csvName ?? 'export.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="card table-card">
      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={16} />
          <input aria-label="Search" placeholder="Search…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </label>
        {filter && (
          <select aria-label={filter.label} value={filterValue}
            onChange={(e) => { setFilterValue(e.target.value); setPage(1); }}>
            <option value="">All {filter.label.toLowerCase()}</option>
            {filter.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        )}
        {csvName && (
          <button className="btn ghost" onClick={exportCsv}><Icon name="download" size={16} /> Export CSV</button>
        )}
      </div>
      <div className="scroll">
        <table>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={String(c.key)} className={c.align}
                  aria-sort={sortKey === c.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button onClick={() => sortBy(c.key)}>{c.label}{sortKey === c.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r, i) => (
              <tr key={i}>
                {columns.map((c) => <td key={String(c.key)} className={c.align}>{c.render ? c.render(r) : String(r[c.key])}</td>)}
              </tr>
            ))}
            {result.rows.length === 0 && (
              <tr><td colSpan={columns.length} className="empty">No results</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <span>{result.total} results · page {result.page} of {result.pages}</span>
        <button className="btn ghost" disabled={result.page <= 1} onClick={() => setPage(result.page - 1)}>Previous</button>
        <button className="btn ghost" disabled={result.page >= result.pages} onClick={() => setPage(result.page + 1)}>Next</button>
      </div>
    </div>
  );
}
