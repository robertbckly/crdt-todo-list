import { Item } from './item/item';
import { ItemForm } from './item-form/item-form';
import { Button } from '../../lib/button';
import { useData } from '../../../hooks/use-data';
import { Link } from '../../lib/link';
import { ROUTES } from '../../../constants/routes';
import type { Item as TItem } from '../../../types/item';
import { useEffect, useState } from 'react';

export const App = () => {
  const [doneInit, setDoneInit] = useState(false);
  const {
    items,
    isReady,
    isSyncReady,
    createItem,
    updateItem,
    deleteItem,
    sync,
  } = useData();

  // Init: run sync when ready
  useEffect(() => {
    if (!doneInit && isSyncReady) {
      sync();
      setDoneInit(true);
    }
  }, [doneInit, isSyncReady, sync]);

  const handleCreate = (value: TItem['value']) => {
    createItem({ value, status: 'open' });
  };

  const handleUpdate = (id: TItem['id'], newValue: TItem['value']) => {
    updateItem(id, newValue);
  };

  const handleDelete = (id: TItem['id']) => {
    deleteItem(id);
  };

  return (
    <main className="m-4 flex max-w-md flex-col gap-2">
      <Link to={ROUTES.login} className="self-start">
        Login
      </Link>

      <Button disabled={!isSyncReady} onClick={sync} className="self-end">
        Sync
      </Button>

      <div className="my-2 flex flex-col gap-2 rounded border p-2">
        <ItemForm disabled={!isReady} onCreate={handleCreate} />
        {!!items.length && (
          <ul aria-label="items" className="flex flex-col gap-2">
            {items.map((item, index) => (
              <Item
                key={item.id}
                value={item.value}
                disabled={!isReady}
                isLastInList={index === items.length - 1}
                onUpdate={(newValue) => handleUpdate(item.id, newValue)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};
