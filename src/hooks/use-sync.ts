import { API_ORIGIN } from '../constants/config';
import { useCsrfToken } from './use-csrf-token';
import { isCrdt } from '../utils/is-crdt';
import { merge } from '../utils/merge';
import type { CRDT } from '../types/crdt';

type Params = {
  updateLocalCrdt: (mergedCrdt: CRDT) => void;
};

type Return = {
  isReady: boolean;
  sync: (localCrdt: CRDT) => Promise<void>;
};

export const useSync = ({ updateLocalCrdt }: Params): Return => {
  const csrfToken = useCsrfToken();
  const isReady = !!csrfToken;

  const sync: Return['sync'] = async (localCrdt) => {
    if (!isReady) return;

    // Get remote CRDT
    const response = await fetch(API_ORIGIN, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });

    // Parse
    let remoteCrdt: unknown;
    try {
      remoteCrdt = await response.json();
    } catch {
      // Do nothing
    }

    // TODO: below shouldn't put the local CRDT; remote should always
    //       start with a blank CRDT... meaning failure to load or
    //       validate remote is an error!
    //       Can use stringified JSON constant in server config !

    // Merge, or fallback to local CRDT
    const newCrdt: CRDT = !isCrdt(remoteCrdt)
      ? localCrdt
      : merge(localCrdt, remoteCrdt);
    updateLocalCrdt(newCrdt);

    // Put remote CRDT
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
    isReady,
    sync,
  } as const;
};
