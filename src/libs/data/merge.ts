import type { CRDT } from '../../types/crdt';
import type { Item } from '../../types/item';

// Helper
const findItemById = (set: Set<Item>, id: Item['id']): boolean => {
  for (const item of set) {
    if (item.id === id) {
      return true;
    }
  }
  return false;
};

export const merge = (ourData: CRDT, theirData: CRDT): CRDT => {
  const ourSet = new Set<Item>(ourData.items);
  const theirSet = new Set<Item>(theirData.items);

  // Intersection (i.e. common items; definitely keep)
  const m = new Set<Item>(
    [...ourSet].filter((i) => findItemById(theirSet, i.id)),
  );

  // Exclusively in our set that they haven't seen yet
  const m1 = new Set<Item>(
    [...ourSet].filter(
      (i) =>
        !findItemById(theirSet, i.id) &&
        i.counter > (theirData.counters[i.clientId] || 0),
    ),
  );

  // Exclusively in their set that we haven't seen yet
  const m2 = new Set<Item>(
    [...theirSet].filter(
      (i) =>
        !findItemById(ourSet, i.id) &&
        i.counter > (ourData.counters[i.clientId] || 0),
    ),
  );

  // Union of all common + new-to-each-side items
  const u = new Set<Item>([...m, ...m1, ...m2]);

  // Max every counter
  const counterIds = new Set<string>([
    ...Object.keys(ourData.counters),
    ...Object.keys(theirData.counters),
  ]);
  const newCounters: CRDT['counters'] = {};
  counterIds.forEach((counterId) => {
    newCounters[counterId] = Math.max(
      ourData.counters[counterId] || 0,
      theirData.counters[counterId] || 0,
    );
  });

  // Ta-da
  return {
    items: Array.from(u),
    counters: newCounters,
  } as const satisfies CRDT;
};
