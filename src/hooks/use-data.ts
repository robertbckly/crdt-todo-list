import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { LOCAL_STORAGE_CRDT_KEY } from '../constants/config';
import { isCrdt } from '../utils/is-crdt';
import type { CRDT } from '../types/crdt';
import type { Item } from '../types/item';
import type { ClientId } from '../types/client-id';

type Params = {
  clientId: ClientId;
};

type Return = {
  items: CRDT['items'];
  isReady: boolean;
  createItem: (item: Omit<Item, 'id' | 'clientId' | 'counter'>) => void;
  updateItem: (id: Item['id'], newValue: Item['value']) => void;
  deleteItem: (id: Item['id']) => void;
};

export const useData = ({ clientId }: Params): Return => {
  const [doneInit, setDoneInit] = useState(false);
  const [crdt, setCrdt] = useState<CRDT>({ items: [], counters: {} });

  // TODO make sync part of this

  // Init: load CRDT from local storage
  useEffect(() => {
    if (doneInit || !clientId) return;

    // Read local-storage entry
    const localStorageEntry = localStorage.getItem(LOCAL_STORAGE_CRDT_KEY);

    // If non-existent: create local-storage entry
    if (!localStorageEntry) {
      const newCrdt: CRDT = { items: [], counters: { [clientId]: 0 } };
      localStorage.setItem(LOCAL_STORAGE_CRDT_KEY, JSON.stringify(newCrdt));
      setCrdt(newCrdt);
      setDoneInit(true);
      return;
    }

    // Otherwise: parse, validate, then load into state
    const existingCrdt = JSON.parse(localStorageEntry);
    if (!isCrdt(existingCrdt)) return; // TODO: handle corruption
    setCrdt(existingCrdt);
    setDoneInit(true);
  }, [clientId, crdt, doneInit]);

  const updateCrdt = (newCrdt: CRDT) => {
    setCrdt(newCrdt);
    localStorage.setItem(LOCAL_STORAGE_CRDT_KEY, JSON.stringify(newCrdt));
  };

  const createItem: Return['createItem'] = (item) => {
    if (!clientId) return;

    const currentCounter = crdt.counters[clientId];
    if (typeof currentCounter !== 'number') return;

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
    const itemIndex = crdt.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      return;
    }

    const existingItem = crdt.items[itemIndex]!;
    const newCrdt = structuredClone(crdt);
    newCrdt.items.splice(itemIndex, 1, {
      ...existingItem,
      id: uuid(),
      value: newValue,
    });

    updateCrdt(newCrdt);
  };

  const deleteItem: Return['deleteItem'] = (id) => {
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
    createItem,
    updateItem,
    deleteItem,
  } as const;
};
