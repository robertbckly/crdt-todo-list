import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_CLIENT_ID_KEY } from '../constants/config';
import { v4 as uuid } from 'uuid';
import type { ClientId } from '../types/client-id';

type Return = {
  clientId: ClientId;
};

export const useClientId = (): Return => {
  const [clientId, setClientId] = useState<ClientId>(null);

  useEffect(() => {
    // Find client ID in local storage
    let clientId: ClientId = localStorage.getItem(LOCAL_STORAGE_CLIENT_ID_KEY);

    // If not found, generate new one
    if (!clientId) {
      clientId = uuid();
      localStorage.setItem(LOCAL_STORAGE_CLIENT_ID_KEY, clientId);
    }

    setClientId(clientId);
  }, []);

  return { clientId } as const;
};
