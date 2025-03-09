import { useCallback } from 'react';
import { API_ORIGIN } from '../../../constants/config';
import { isCrdt } from '../is-crdt';
import { merge } from '../merge';
import { useCsrfToken } from './use-csrf-token';
import type { CRDT } from '../../../types/crdt';
import type { DataContextValue, DataDispatch } from '../types';

type Params = {
  dataState: DataContextValue;
  dispatch: DataDispatch;
};

export const useRemoteSync = ({ dataState, dispatch }: Params) => {
  const csrfToken = useCsrfToken();
  const isReady = !!csrfToken;

  const sync = useCallback(async () => {
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
    const localCrdt = dataState.crdt;
    const newCrdt: CRDT = !isCrdt(remoteCrdt)
      ? localCrdt
      : merge(localCrdt, remoteCrdt);

    // Put remote CRDT
    await fetch(API_ORIGIN, {
      method: 'PUT',
      body: JSON.stringify(newCrdt),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });
  }, [csrfToken, dataState.crdt, isReady]);

  if (sync !== dataState.sync) {
    dispatch({
      type: 'updated_sync_callback',
      callback: sync,
    });
  }
};
