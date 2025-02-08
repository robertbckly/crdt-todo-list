import type { CRDT } from '../types/crdt';
import type { Item } from '../types/item';

// Helper function to compare objects
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

  // intersection (i.e. common items; definitely keep)
  const m = new Set<Item>(
    [...ourSet].filter((i) => findItemById(theirSet, i.id)),
  );

  // exclusively in our set that they haven't seen yet
  const m1 = new Set<Item>(
    [...ourSet].filter(
      (i) =>
        !findItemById(theirSet, i.id) &&
        i.counter > (theirData.counters[i.clientId] || 0),
    ),
  );

  // exclusively in their set that we haven't seen yet
  const m2 = new Set<Item>(
    [...theirSet].filter(
      (i) =>
        !findItemById(ourSet, i.id) &&
        i.counter > (ourData.counters[i.clientId] || 0),
    ),
  );

  // union of all common + new-to-each-side items
  const u = new Set<Item>([...m, ...m1, ...m2]);

  // OPTIONAL:
  // ... below isn't applicable when using a complex element type,
  // ... i.e. not a primitive value, and esp. when using UUIDs,
  // ... as there will be no repeat adds of the same element
  //
  // find any duplicates (take newest example)
  // const o = new Set<Item>();
  // u.forEach((outer) => {
  //   u.forEach((inner) => {
  //     // Keep newest version of each duplicate item
  //     if (outer.id === inner.id && outer.counter < inner.counter) {
  //       o.add(outer);
  //     }
  //   });
  // });
  //
  // remove duplicates from union
  // const resultSet = new Set<Item>(u);
  // o.forEach((item) => resultSet.delete(item));

  // max every counter
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

  // ta-da
  const result: CRDT = {
    items: Array.from(u),
    counters: newCounters,
  };

  return result;
};
