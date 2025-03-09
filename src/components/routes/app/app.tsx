import { DataProvider } from '../../../libs/data/data-context';
import { ItemList } from './item-list/item-list';
import { Toolbar } from './toolbar/toolbar';

export const App = () => {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-2 p-4">
      <DataProvider>
        <Toolbar />
        <ItemList />
      </DataProvider>
    </main>
  );
};
