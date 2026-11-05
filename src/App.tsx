import { Layout } from './components/Layout';
import { useRoute, type Route } from './lib/router';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { Users } from './pages/Users';

const pages: Record<Route, [string, () => React.JSX.Element]> = {
  dashboard: ['Dashboard', Dashboard],
  users: ['Users', Users],
  'not-found': ['Not found', NotFound],
};

export function App() {
  const route = useRoute();
  const [title, Page] = pages[route];
  return (
    <Layout route={route} title={title}>
      <Page />
    </Layout>
  );
}
