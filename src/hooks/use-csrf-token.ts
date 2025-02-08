import { useEffect, useState } from 'react';
import { COOKIE_CSRF_TOKEN_KEY } from '../constants/config';

type Token = string | null;

export const useCsrfToken = (): Token => {
  const [token, setToken] = useState<Token>(null);

  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';').map((string) => string.trim());
    setToken(
      cookies
        .find((cookie) => cookie.startsWith(COOKIE_CSRF_TOKEN_KEY))
        ?.split('=')[1] || null,
    );
  }, []);

  return token;
};
