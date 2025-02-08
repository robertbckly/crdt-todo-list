import { API_ORIGIN, LOCAL_STORAGE_CRDT_KEY } from '../constants/config';
import { useCsrfToken } from './use-csrf-token';
import { isCrdt } from '../utils/is-crdt';
import { merge } from '../utils/merge';
import type { CRDT } from '../types/crdt';

type SyncParams = {
  crdt: CRDT;
  setCrdt: (crdt: CRDT) => void;
};

type Return = {
  canSync: boolean;
  sync: (params: SyncParams) => Promise<void>;
};

export const useSync = (): Return => {
  const csrfToken = useCsrfToken();
  const canSync = !!csrfToken;

  const sync = async ({ crdt: localCrdt, setCrdt }: SyncParams) => {
    if (!canSync) return;

    const response = await fetch(API_ORIGIN, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });

    const remoteCrdt = await response.json();

    let newCrdt: CRDT;
    if (!isCrdt(remoteCrdt)) {
      newCrdt = localCrdt;
    } else {
      console.log('merging', localCrdt);
      newCrdt = merge(localCrdt, remoteCrdt);
    }

    localStorage.setItem(LOCAL_STORAGE_CRDT_KEY, JSON.stringify(newCrdt));
    setCrdt(newCrdt);

    await fetch(API_ORIGIN, {
      method: 'PUT',
      body: JSON.stringify(newCrdt),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });
  };

  return {
    canSync,
    sync,
  } as const;
};
