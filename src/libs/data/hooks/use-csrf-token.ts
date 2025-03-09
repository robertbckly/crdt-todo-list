import { useEffect, useState } from 'react';
import { COOKIE_CSRF_TOKEN_KEY } from '../../../constants/config';

export const useCsrfToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';').map((string) => string.trim());
    const csrfCookieValue = cookies
      .find((cookie) => cookie.startsWith(COOKIE_CSRF_TOKEN_KEY))
      ?.split('=')[1];
    if (csrfCookieValue) {
      setToken(csrfCookieValue);
    }
  }, []);

  return token;
};
