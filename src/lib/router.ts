import { useEffect, useState } from 'react';

export const routes = ['dashboard', 'users'] as const;
export type Route = (typeof routes)[number] | 'not-found';

export function parseHash(hash: string): Route {
  const r = hash.replace(/^#\/?/, '') || 'dashboard';
  return (routes as readonly string[]).includes(r) ? (r as Route) : 'not-found';
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
