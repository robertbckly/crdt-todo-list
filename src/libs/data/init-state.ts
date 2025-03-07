import type { DataContextValue } from './types';

export const INIT_STATE = {
  items: [],
  counters: {},
} as const satisfies DataContextValue;
