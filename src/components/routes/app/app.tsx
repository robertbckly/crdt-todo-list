import { useState } from 'react';
import { DragItemProvider } from '../../../context/drag-item-provider';
import { DataProvider } from '../../../libs/data/data-context';
import { ItemList } from './item-list/item-list';
import { Toolbar } from './toolbar/toolbar';
import { ItemForm } from './item-create-form/item-create-form';

export const App = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <DataProvider>
      <DragItemProvider>
        <main className="mx-auto flex max-w-md flex-col gap-2 p-4">
          {!isCreating && <Toolbar onCreateStart={() => setIsCreating(true)} />}
          {isCreating && <ItemForm onClose={() => setIsCreating(false)} />}
          <ItemList />
        </main>
      </DragItemProvider>
    </DataProvider>
  );
};
