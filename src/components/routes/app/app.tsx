import { Item } from './item/item';
import { ItemForm } from './item-form/item-form';
import { Button } from '../../lib/button';
import { useCrdt } from '../../../hooks/use-crdt';
import { useSync } from '../../../hooks/use-sync';
import { Link } from '../../lib/link';
import { ROUTES } from '../../../constants/routes';
import { useClientId } from '../../../hooks/use-client-id';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

export const App = () => {
  const { clientId } = useClientId();
  const {
    crdt,
    items,
    counters,
    haveItems,
    hasInitialised,
    setItems,
    setCrdt,
  } = useCrdt();
  const { canSync, sync } = useSync();

  const counter = clientId ? counters[clientId] : null;

  // TODO: `canSync` shouldn't be required; will allow offline use
  const isReady = clientId && canSync && typeof counter === 'number';

  console.log(clientId, counters);

  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init || !canSync || !hasInitialised) return;
    sync({ crdt, setCrdt });
    setInit(true);
  }, [canSync, crdt, hasInitialised, init, setCrdt, sync]);

  const handleCreate = (newValue: string) => {
    if (!isReady) return;
    const newItems = [...items];
    newItems.unshift({
      id: uuid(),
      clientId,
      counter: counter + 1,
      value: newValue,
      status: 'open',
    });
    setItems(newItems, true);
  };

  const handleEdit = (index: number, newValue: string) => {
    if (!isReady) return;

    const newItems = [...items];
    const item = newItems[index];
    if (!item) return;

    newItems[index] = { ...item, value: newValue };
    setItems(newItems);
  };

  const handleDelete = (index: number) => {
    if (!isReady) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <main className="m-4 flex max-w-md flex-col gap-2">
      {!canSync && <Link to={ROUTES.login}>Login</Link>}

      <Button
        disabled={!isReady}
        onClick={() => sync({ crdt, setCrdt })}
        className="self-end"
      >
        Sync
      </Button>

      <div className="mt-2 flex flex-col gap-2 rounded border p-2">
        <ItemForm disabled={!isReady} onCreate={handleCreate} />
        {haveItems && (
          <ul aria-label="items" className="flex flex-col gap-2">
            {items.map((item, index) => (
              <Item
                key={item.id}
                value={item.value}
                disabled={!isReady}
                isLastInList={index === items.length - 1}
                onEdit={(event) => handleEdit(index, event.target.value)}
                onDelete={() => handleDelete(index)}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};
