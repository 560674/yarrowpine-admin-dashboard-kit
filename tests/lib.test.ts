import { describe, expect, it } from 'vitest';
import { makeOrders, makeUsers } from '../src/data/demo';
import { change, money, pct } from '../src/lib/format';
import { parseHash } from '../src/lib/router';
import { filterRows, paginate, runQuery, sortRows, toCsv } from '../src/lib/table';

const rows = [
  { name: 'Cleo', n: 3, s: 'A' },
  { name: 'ava', n: 10, s: 'B' },
  { name: 'Ben', n: 2, s: 'A' },
];

describe('table helpers', () => {
  it('filters by search and exact filter', () => {
    expect(filterRows(rows, { search: 'BE', searchKeys: ['name'], filters: {} })).toHaveLength(1);
    expect(filterRows(rows, { search: '', searchKeys: ['name'], filters: { s: 'A' } })).toHaveLength(2);
  });
  it('sorts numbers numerically and strings by locale', () => {
    expect(sortRows(rows, 'n', 'asc').map((r) => r.n)).toEqual([2, 3, 10]);
    expect(sortRows(rows, 'name', 'desc').map((r) => r.name)).toEqual(['Cleo', 'Ben', 'ava']);
    expect(sortRows(rows, undefined, 'asc')).toBe(rows);
  });
  it('paginates and clamps the page', () => {
    const p = paginate([1, 2, 3, 4, 5], 9, 2);
    expect(p).toEqual({ rows: [5], page: 3, pages: 3, total: 5 });
    expect(paginate([], 1, 10).pages).toBe(1);
  });
  it('runs a full query', () => {
    const r = runQuery(rows, { search: '', searchKeys: ['name'], filters: { s: 'A' }, sortKey: 'n', sortDir: 'desc', page: 1, pageSize: 1 });
    expect(r.rows[0].name).toBe('Cleo');
    expect(r.pages).toBe(2);
  });
  it('escapes CSV', () => {
    expect(toCsv([{ a: 'x,y', b: 'say "hi"' }], ['a', 'b'])).toBe('a,b\n"x,y","say ""hi"""');
  });
});

describe('format', () => {
  it('formats money, percent and change', () => {
    expect(money(1234)).toBe('$1,234');
    expect(pct(4.25)).toBe('+4.3%');
    expect(change(110, 100)).toBeCloseTo(10);
    expect(change(5, 0)).toBe(100);
    expect(change(0, 0)).toBe(0);
  });
});

describe('router and demo data', () => {
  it('parses hashes', () => {
    expect(parseHash('')).toBe('dashboard');
    expect(parseHash('#/users')).toBe('users');
    expect(parseHash('#/orders')).toBe('not-found');
    expect(parseHash('#/nope')).toBe('not-found');
  });
  it('demo data is deterministic and uses example.com', () => {
    expect(makeUsers()).toEqual(makeUsers());
    expect(makeUsers().every((u) => u.email.endsWith('@example.com'))).toBe(true);
    expect(makeOrders()).toHaveLength(60);
  });
});
