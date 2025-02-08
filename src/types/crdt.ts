import type { Item } from './item';

export type CRDT = {
  items: Item[];
  counters: Record<string, number>;
};
