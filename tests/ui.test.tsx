import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';

const go = async (hash: string) => {
  await act(async () => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
};

describe('app', () => {
  it('renders the dashboard with stats and charts', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Revenue', { selector: 'h3' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Revenue by month' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('aria-current', 'page');
  });

  it('navigates via the hash router and shows 404', async () => {
    render(<App />);
    await go('#/users');
    expect(screen.getByRole('heading', { level: 1, name: 'Users' })).toBeInTheDocument();
    await go('#/missing');
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('users table searches, filters, sorts and paginates', async () => {
    const u = userEvent.setup();
    render(<App />);
    await go('#/users');
    expect(screen.getByText(/48 results · page 1 of 5/)).toBeInTheDocument();
    await u.selectOptions(screen.getByLabelText('Statuses'), 'Suspended');
    const n = Number(screen.getByText(/results/).textContent!.split(' ')[0]);
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(48);
    await u.selectOptions(screen.getByLabelText('Statuses'), '');
    await u.type(screen.getByLabelText('Search'), 'zzzz');
    expect(screen.getByText('No results')).toBeInTheDocument();
    await u.clear(screen.getByLabelText('Search'));
    await u.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText(/page 2 of 5/)).toBeInTheDocument();
    await u.click(screen.getByRole('button', { name: /^Name/ }));
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending');
    const firstRow = screen.getAllByRole('row')[1];
    expect(within(firstRow).getAllByRole('cell')[0].textContent).toMatch(/^A/);
  });



});
