import { Item } from './item/item';
import { ItemForm } from './item-form/item-form';
import { Button } from '../../lib/button';
import { useData } from '../../../hooks/use-data';
import { Link } from '../../lib/link';
import { ROUTES } from '../../../constants/routes';
import { Fragment, useContext, useEffect, useState } from 'react';
import { DraggingContext } from '../../../context/dragging-context';
import type { Item as TItem } from '../../../types/item';
import { ItemDropLine } from './item/item-drop-line';

export const App = () => {
  const [doneInit, setDoneInit] = useState(false);
  const {
    items,
    isReady,
    isSyncReady,
    createItem,
    updateItem,
    deleteItem,
    moveItem,
    sync,
  } = useData();
  const { isDragging, dropIndex } = useContext(DraggingContext);

  // Init: run sync when ready
  useEffect(() => {
    if (!doneInit && isSyncReady) {
      sync();
      setDoneInit(true);
    }
  }, [doneInit, isSyncReady, sync]);

  const handleCreate = (text: TItem['text']) => {
    createItem({ text: text });
  };

  const handleUpdate = (updates: TItem) => {
    updateItem(updates);
  };

  const handleDelete = (id: TItem['id']) => {
    deleteItem(id);
  };

  return (
    <main className="mx-auto flex max-w-md flex-col gap-2 p-4">
      {isSyncReady ? (
        <Button onClick={sync} className="self-end">
          Sync
        </Button>
      ) : (
        <Link to={ROUTES.login} className="self-start">
          Login
        </Link>
      )}

      <div className="my-2 flex flex-col gap-2">
        <ItemForm disabled={!isReady} onCreate={handleCreate} />
        {!!items.length && (
          <ul aria-label="items" className="flex flex-col rounded border px-2">
            <ItemDropLine active={dropIndex === 0} />
            {items
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <Fragment key={item.id}>
                  <Item
                    index={index}
                    data={item}
                    disabled={!isReady || isDragging}
                    isLastInList={index === items.length - 1}
                    onUpdate={handleUpdate}
                    onDelete={() => handleDelete(item.id)}
                    onMove={moveItem}
                  />
                  <ItemDropLine
                    // Display beneath item before `dropIndex`
                    active={index === dropIndex - 1}
                  />
                </Fragment>
              ))}
          </ul>
        )}
      </div>
    </main>
  );
};
