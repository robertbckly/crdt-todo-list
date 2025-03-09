import type { CRDT } from '../../types/crdt';

export const isCrdt = (value: unknown): value is CRDT =>
  !!value &&
  typeof value === 'object' &&
  ('items' satisfies keyof CRDT) in value &&
  ('counters' satisfies keyof CRDT) in value &&
  Array.isArray(value.items) &&
  typeof value.counters === 'object';
