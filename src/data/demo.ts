// Fictional demo data. Names are invented; emails use the reserved example.com domain.
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Invited' | 'Suspended';
  joined: string;
}
export interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'Paid' | 'Pending' | 'Refunded';
  date: string;
}

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
const first = ['Ava', 'Ben', 'Cleo', 'Dev', 'Elif', 'Finn', 'Gia', 'Hugo', 'Iris', 'Jun', 'Kai', 'Lena', 'Milo', 'Nora', 'Omar', 'Pia'];
const last = ['Archer', 'Brook', 'Castell', 'Dunmore', 'Ellery', 'Fairlie', 'Gale', 'Hollis', 'Ivers', 'Juniper'];
const pick = <T,>(r: () => number, a: readonly T[]) => a[Math.floor(r() * a.length)];
const day = (r: () => number) => {
  const d = new Date(Date.UTC(2026, 0, 1) + Math.floor(r() * 300) * 86400000);
  return d.toISOString().slice(0, 10);
};

export function makeUsers(n = 48, seed = 7): User[] {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const f = pick(r, first);
    const l = pick(r, last);
    return {
      id: i + 1,
      name: `${f} ${l}`,
      email: `${f}.${l}${i + 1}@example.com`.toLowerCase(),
      role: pick(r, ['Admin', 'Editor', 'Viewer', 'Viewer'] as const),
      status: pick(r, ['Active', 'Active', 'Active', 'Invited', 'Suspended'] as const),
      joined: day(r),
    };
  });
}

export function makeOrders(n = 60, seed = 11): Order[] {
  const r = rng(seed);
  const users = makeUsers();
  return Array.from({ length: n }, (_, i) => ({
    id: `YB-${String(1001 + i)}`,
    customer: pick(r, users).name,
    total: Math.round(20 + r() * 480),
    status: pick(r, ['Paid', 'Paid', 'Paid', 'Pending', 'Refunded'] as const),
    date: day(r),
  }));
}

export const revenue = [12.4, 13.1, 12.8, 14.6, 15.2, 16.9, 16.1, 18.3, 19.0, 20.4, 21.7, 23.2].map((k) => k * 1000);
export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const channels = [
  { label: 'Organic', value: 42 },
  { label: 'Referral', value: 23 },
  { label: 'Email', value: 18 },
  { label: 'Paid', value: 17 },
];
