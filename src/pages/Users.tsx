import { DataTable, type Column } from '../components/DataTable';
import { StatusPill } from '../components/StatusPill';
import { makeUsers, type User } from '../data/demo';

const columns: Column<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', render: (u) => <StatusPill value={u.role} /> },
  { key: 'status', label: 'Status', render: (u) => <StatusPill value={u.status} /> },
  { key: 'joined', label: 'Joined' },
];

export function Users() {
  return (
    <DataTable rows={makeUsers()} columns={columns} searchKeys={['name', 'email']} caption="Users"
      filter={{ key: 'status', label: 'Statuses', options: ['Active', 'Invited', 'Suspended'] }} />
  );
}
