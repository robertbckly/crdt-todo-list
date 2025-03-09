import { DataProvider } from '../../../libs/data/data-context';
import { ItemForm } from './item-form/item-form';
import { ItemList } from './item-list/item-list';
import { Toolbar } from './toolbar/toolbar';

// TODO: move DragProvider here... so it wraps everything...
// this means ItemForm can be disabled...
// probably need to change setting of drop callback to be dispatch???

export const App = () => {
  return (
    <DataProvider>
      <main className="mx-auto flex max-w-md flex-col gap-2 p-4">
        <Toolbar />
        <div className="my-2 flex flex-col gap-2">
          <ItemForm />
          <ItemList />
        </div>
      </main>
    </DataProvider>
  );
};
