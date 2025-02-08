import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_CRDT_KEY } from '../constants/config';
import { isCrdt } from '../utils/is-crdt';
import { useClientId } from './use-client-id';
import type { CRDT } from '../types/crdt';
import type { Item } from '../types/item';

type Return = {
  crdt: CRDT;
  items: CRDT['items'];
  counters: CRDT['counters'];
  haveItems: boolean;
  hasInitialised: boolean;
  setCrdt: (crdt: CRDT) => void;
  setItems: (items: Item[], incrementCounter?: boolean) => void;
};

export const useCrdt = (): Return => {
  const { clientId } = useClientId();
  const [hasInitialised, setHasInitialised] = useState(false);
  const [crdt, setCrdt] = useState<CRDT>({ items: [], counters: {} });

  // Load items from local storage initially
  useEffect(() => {
    if (hasInitialised || !clientId) return;

    // Read from local storage
    const localStorageEntry = localStorage.getItem(LOCAL_STORAGE_CRDT_KEY);

    // Create in local storage if non-existent
    if (!localStorageEntry) {
      const newCrdt: CRDT = {
        ...crdt,
        counters: {
          ...crdt.counters,
          [clientId]: 0,
        },
      };
      localStorage.setItem(LOCAL_STORAGE_CRDT_KEY, JSON.stringify(newCrdt));
      setCrdt(newCrdt);
      setHasInitialised(true);
      return;
    }

    // Parse, then load into state if passes validation
    const parsed = JSON.parse(localStorageEntry);
    if (!isCrdt(parsed)) return;
    setCrdt(parsed);

    // Don't init again
    setHasInitialised(true);
  }, [clientId, crdt, hasInitialised]);

  const handleSetItems = (updatedItems: Item[], incrementCounter = false) => {
    const newCrdt = structuredClone(crdt);
    if (!clientId || typeof newCrdt.counters[clientId] !== 'number') return;
    newCrdt.items = updatedItems;
    newCrdt.counters[clientId] = incrementCounter
      ? newCrdt.counters[clientId] + 1
      : newCrdt.counters[clientId];
    setCrdt(newCrdt);
    localStorage.setItem(LOCAL_STORAGE_CRDT_KEY, JSON.stringify(newCrdt));
  };

  return {
    crdt,
    items: crdt.items,
    counters: crdt.counters,
    haveItems: !!crdt.items.length,
    hasInitialised,
    setCrdt,
    setItems: handleSetItems,
  };
};
