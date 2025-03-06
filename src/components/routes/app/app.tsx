import { ItemForm } from './item-form/item-form';
import { ItemList } from './item-list/item-list';
import { Button } from '../../lib/button';
import { useData } from '../../../hooks/use-data';
import { Link } from '../../lib/link';
import { ROUTES } from '../../../constants/routes';
import { useEffect, useState } from 'react';
import { DataProvider } from '../../../libs/data/data-context';

export const App = () => {
  const [doneInit, setDoneInit] = useState(false);
  const { isReady, isSyncReady, sync } = useData(); // OLD; replace

  // Init: run sync when ready
  useEffect(() => {
    if (!doneInit && isSyncReady) {
      sync();
      setDoneInit(true);
    }
  }, [doneInit, isSyncReady, sync]);

  return (
    <DataProvider>
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
          <ItemForm disabled={!isReady} />
          <ItemList disabled={!isReady} />
        </div>
      </main>
    </DataProvider>
  );
};
