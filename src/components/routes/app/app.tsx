import { DragItemProvider } from '../../../context/drag-item-provider';
import { DataProvider } from '../../../libs/data/data-context';
import { ItemForm } from './item-form/item-form';
import { ItemList } from './item-list/item-list';
import { Toolbar } from './toolbar/toolbar';

export const App = () => {
  return (
    <DataProvider>
      <DragItemProvider>
        <main className="mx-auto flex max-w-md flex-col gap-2 p-4">
          <Toolbar />
          <ItemForm />
          <ItemList />
        </main>
      </DragItemProvider>
    </DataProvider>
  );
};
