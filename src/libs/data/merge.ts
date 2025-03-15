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

/**
 * Opt-OR-Set merge function
 * https://arxiv.org/pdf/1210.3368
 */
export const merge = (ourData: CRDT, theirData: CRDT): CRDT => {
  const ourSet = new Set<Item>(ourData.items);
  const theirSet = new Set<Item>(theirData.items);

  // Intersection (i.e. common items; definitely keep)
  const m = new Set<Item>(
    [...ourSet].filter((i) => findItemById(theirSet, i.id)),
  );

  // In our set that they haven't seen yet
  const m1 = new Set<Item>(
    [...ourSet].filter(
      (i) => i.counter > (theirData.counters[i.clientId] || 0),
    ),
  );

  // In their set that we haven't seen yet
  const m2 = new Set<Item>(
    [...theirSet].filter(
      (i) => i.counter > (ourData.counters[i.clientId] || 0),
    ),
  );

  // Union of all common + new-to-each-side items
  const u = new Set<Item>([...m, ...m1, ...m2]);

  // Identify winning duplicates using last-writer-wins strategy
  const o = new Set<Item>();
  u.forEach((outer) => {
    u.forEach((inner) => {
      const sameItem = outer.id === inner.id;
      const lastWriter = outer.updatedTimeMs >= inner.updatedTimeMs;

      // Keep newest version of each duplicate item
      if (sameItem && !lastWriter) {
        o.add(outer);
      }
    });
  });

  // Remove losing duplicates from union
  const resultSet = new Set<Item>(u);
  o.forEach((item) => resultSet.delete(item));

  // Ensure consistent ordering between clients (first-writer-wins strategy)
  const orderedResultSet = Array.from(resultSet)
    .sort((a, b) => a.createdTimeMs - b.createdTimeMs)
    .sort((a, b) => a.order - b.order);

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
    items: orderedResultSet,
    counters: newCounters,
  } as const satisfies CRDT;
};
