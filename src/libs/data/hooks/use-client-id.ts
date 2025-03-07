import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { LOCAL_STORAGE_CLIENT_ID_KEY } from '../../../constants/config';

export const useClientId = () => {
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    let clientId = localStorage.getItem(LOCAL_STORAGE_CLIENT_ID_KEY);
    if (!clientId) {
      clientId = uuid();
      localStorage.setItem(LOCAL_STORAGE_CLIENT_ID_KEY, clientId);
    }
    setClientId(clientId);
  }, []);

  return clientId;
};
