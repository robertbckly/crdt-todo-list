import { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { LOCAL_STORAGE_CRDT_KEY } from '../constants/config';
import { isCrdt } from '../utils/is-crdt';
import { useSync } from './use-sync';
import { useClientId } from './use-client-id';
import type { CRDT } from '../types/crdt';
import type { Item } from '../types/item';

type Return = {
  items: CRDT['items'];
  isReady: boolean;
  isSyncReady: boolean;
  createItem: (item: Omit<Item, 'id' | 'clientId' | 'counter'>) => void;
  updateItem: (id: Item['id'], newValue: Item['value']) => void;
  deleteItem: (id: Item['id']) => void;
  sync: () => void;
};

export const useData = (): Return => {
  const [doneInit, setDoneInit] = useState(false);
  const [crdt, setCrdt] = useState<CRDT>({ items: [], counters: {} });
  const { clientId } = useClientId();

  const updateCrdt = useCallback((newCrdt: CRDT) => {
    setCrdt(newCrdt);
    localStorage.setItem(LOCAL_STORAGE_CRDT_KEY, JSON.stringify(newCrdt));
  }, []);

  const { isReady: isSyncReady, sync } = useSync({
    updateLocalCrdt: updateCrdt,
  });

  const currentCounter = clientId ? crdt.counters[clientId] : null;
  const isActionAllowed =
    !!clientId && doneInit && typeof currentCounter === 'number';

  // Init: load CRDT from local storage
  useEffect(() => {
    if (doneInit || !clientId) return;

    // Read local-storage entry
    const localStorageEntry = localStorage.getItem(LOCAL_STORAGE_CRDT_KEY);

    // If non-existent: create local-storage entry
    if (!localStorageEntry) {
      const newCrdt: CRDT = { items: [], counters: { [clientId]: 0 } };
      updateCrdt(newCrdt);
      setDoneInit(true);
      return;
    }

    // Otherwise: parse, validate, then load into state
    let existingCrdt: unknown;
    try {
      existingCrdt = JSON.parse(localStorageEntry);
    } catch {
      // Do nothing
    }
    if (!isCrdt(existingCrdt)) return; // TODO: handle corruption
    setCrdt(existingCrdt);
    setDoneInit(true);
  }, [clientId, doneInit, updateCrdt]);

  const createItem: Return['createItem'] = (item) => {
    if (!isActionAllowed) return;
    const newCounter = currentCounter + 1;
    const newCrdt = structuredClone(crdt);
    newCrdt.items.push({
      ...item,
      id: uuid(),
      clientId,
      counter: newCounter,
    });
    newCrdt.counters[clientId] = newCounter;
    updateCrdt(newCrdt);
  };

  const updateItem: Return['updateItem'] = (id, newValue) => {
    if (!isActionAllowed) return;

    const itemIndex = crdt.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return;
    }

    const existingItem = crdt.items[itemIndex]!;
    const newCounter = currentCounter + 1;
    const newCrdt = structuredClone(crdt);
    newCrdt.items.splice(itemIndex, 1, {
      ...existingItem,
      id: uuid(),
      value: newValue,
      counter: newCounter,
    });
    newCrdt.counters[clientId] = newCounter;
    updateCrdt(newCrdt);
  };

  const deleteItem: Return['deleteItem'] = (id) => {
    if (!isActionAllowed) return;

    const itemIndex = crdt.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return;
    }

    const newCrdt = structuredClone(crdt);
    newCrdt.items.splice(itemIndex, 1);
    updateCrdt(newCrdt);
  };

  return {
    items: crdt.items,
    isReady: doneInit,
    isSyncReady: doneInit && isSyncReady,
    createItem,
    updateItem,
    deleteItem,
    sync: () => sync(crdt),
  } as const;
};
