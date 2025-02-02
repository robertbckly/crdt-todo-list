import { ROUTES } from '../../../constants/routes';
import { Link } from '../../lib/link';

export const App = () => (
  <main>
    <h1>Hello :-)</h1>
    <Link to={ROUTES.login}>Login</Link>
  </main>
);
