import { useState, type ReactNode } from 'react';
import type { Route } from '../lib/router';
import { Icon, type IconName } from './Icon';

const nav: { route: Route; label: string; icon: IconName }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { route: 'users', label: 'Users', icon: 'users' },
];

export function Layout({ route, title, children }: { route: Route; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? 'shell open' : 'shell'}>
      <aside className="sidebar">
        <div className="brand"><span className="logo" aria-hidden="true">Y</span> YourBrand</div>
        <nav aria-label="Main">
          {nav.map((n) => (
            <a key={n.route} href={`#/${n.route}`} aria-current={route === n.route ? 'page' : undefined}
              onClick={() => setOpen(false)}>
              <Icon name={n.icon} /> {n.label}
            </a>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <button className="btn icon menu" aria-label="Open menu" onClick={() => setOpen(!open)}><Icon name="menu" /></button>
          <h1>{title}</h1>
          <span className="avatar" aria-label="Signed in as Ava Archer">AA</span>
        </header>
        <main id="content">{children}</main>
      </div>
    </div>
  );
}
