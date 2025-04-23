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

/**
 * Automatically configures remote sync if the user has
 * logged in and established cookies
 */
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

    // Merge, or fallback to local CRDT
    if (!isCrdt(remoteCrdt)) {
      throw Error("Remote data isn't CRDT");
    }
    const localCrdt = dataState.crdt;
    const mergedCrdt: CRDT = merge(localCrdt, remoteCrdt);

    dispatch({
      type: 'restored_data',
      data: mergedCrdt,
    });

    // Put remote CRDT
    await fetch(API_ORIGIN, {
      method: 'PUT',
      body: JSON.stringify(mergedCrdt),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });
  }, [csrfToken, dataState.crdt, dispatch, isReady]);

  if (isReady && sync !== dataState.sync) {
    dispatch({
      type: 'updated_sync_callback',
      callback: sync,
    });
  }
};
