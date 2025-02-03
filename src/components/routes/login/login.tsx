import { useEffect, useRef } from 'react';
import { ROUTES } from '../../../constants/routes.js';
import { Link } from '../../lib/link.js';

export const Login = () => {
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGoogleButton = () => {
      window.google.accounts.id.initialize({
        client_id:
          '316817011021-b176pu0pre4vjqlt0uiro9gr25gfbfce.apps.googleusercontent.com',
        login_uri: 'https://localhost:8787/google',
        ux_mode: 'redirect',
      });

      if (buttonContainerRef.current) {
        window.google?.accounts.id.renderButton(buttonContainerRef.current, {
          type: 'standard',
          shape: 'pill',
          size: 'large',
        });
      }
    };

    const gsiScript = document.createElement('script');
    gsiScript.src = 'https://accounts.google.com/gsi/client';
    gsiScript.onload = initGoogleButton;
    document.head.append(gsiScript);

    return () => {
      // @ts-expect-error this is fine
      window.google = undefined;
      document.head.removeChild(gsiScript);
    };
  }, []);

  return (
    <main className="m-4">
      <h1>Login</h1>
      <Link to={ROUTES.index}>Back</Link>
      <div
        ref={buttonContainerRef}
        className="m-auto flex w-56 justify-center"
      />
    </main>
  );
};
