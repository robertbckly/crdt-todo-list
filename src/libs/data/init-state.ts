import type { DataContextValue } from './types';

export const INIT_STATE = {
  crdt: { items: [], counters: {} },
  clientId: null,
  sync: null,
} as const satisfies DataContextValue;
