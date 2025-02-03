import { useEffect } from 'react';
import { ROUTES } from '../../../constants/routes';
import { Link } from '../../lib/link';

export const App = () => {
  // Testing...
  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';').map((string) => string.trim());
    const csrfToken =
      cookies
        .find((cookie) => cookie.startsWith('__Host-csrf='))
        ?.split('__Host-csrf=')[1] || '';
    fetch('/api', {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });
  }, []);

  return (
    <main className="m-4">
      <h1>Hello :-)</h1>
      <Link to={ROUTES.login}>Login</Link>
    </main>
  );
};
