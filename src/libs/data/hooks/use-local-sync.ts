import { useEffect } from 'react';
import { LOCAL_STORAGE_CRDT_KEY } from '../../../constants/config';
import { isCrdt } from '../is-crdt';
import type { DataContextValue, DataDispatch } from '../types';

type Params = {
  dataState: DataContextValue;
  dispatch: DataDispatch;
};

export const useLocalSync = ({ dataState, dispatch }: Params) => {
  const doneInit = !!Object.keys(dataState.crdt.counters).length;
  const { clientId } = dataState;

  // Init sync (restore)
  useEffect(() => {
    if (doneInit || !clientId) return;

    const localData = localStorage.getItem(LOCAL_STORAGE_CRDT_KEY);

    if (!localData) {
      dispatch({
        type: 'restored_data',
        data: { items: [], counters: { [clientId]: 0 } },
      });
      return;
    }

    let parsedLocalData: unknown;
    try {
      parsedLocalData = JSON.parse(localData);
      if (!isCrdt(parsedLocalData)) throw Error("Local data isn't CRDT");
    } catch (error) {
      // TODO: handle corruption...
      // just rethrowing for now to make issues obvious
      throw Error(
        error instanceof Error ? error.message : 'Local sync parsing error',
      );
    }

    dispatch({
      type: 'restored_data',
      data: parsedLocalData,
    });
  }, [clientId, dispatch, doneInit]);

  // Sync on change
  useEffect(() => {
    if (!doneInit) return;
    const serialisedData = JSON.stringify(dataState.crdt);
    localStorage.setItem(LOCAL_STORAGE_CRDT_KEY, serialisedData);
  }, [dataState, doneInit]);
};
