import { ROUTES } from '../../../constants/routes.js';
import { Link } from '../../lib/link.js';

export const Login = () => (
  <main>
    <h1>Login</h1>
    <Link to={ROUTES.index}>Back</Link>
  </main>
);
