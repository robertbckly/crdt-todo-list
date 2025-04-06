import { DragItemProvider } from '../../../context/drag-item-provider';
import { DataProvider } from '../../../libs/data/data-context';
import { ItemList } from './item-list/item-list';
import { Toolbar } from './toolbar/toolbar';
import { ItemCreateForm } from './item-create-form/item-create-form';
import { useMode } from '../../../context/mode-provider';

export const App = () => {
  const mode = useMode();
  return (
    <DataProvider>
      <DragItemProvider>
        <main className="mx-auto flex max-w-md flex-col gap-2 p-4 pt-0">
          {mode !== 'create' && <Toolbar />}
          {mode === 'create' && <ItemCreateForm />}
          <ItemList />
        </main>
      </DragItemProvider>
    </DataProvider>
  );
};
