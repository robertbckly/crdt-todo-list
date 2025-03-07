import {
  createContext,
  useContext,
  useReducer,
  type PropsWithChildren,
} from 'react';
import { dataReducer } from './data-reducer';
import { INIT_STATE } from './init-state';
import { useLocalSync } from './hooks/use-local-sync';
import { useRemoteSync } from './hooks/use-remote-sync';
import { useClientId } from './hooks/use-client-id';
import { type DataContextValue, type DataDispatch } from './types';

const DataContext = createContext<DataContextValue>(INIT_STATE);
const DataDispatchContext = createContext<DataDispatch | null>(null);

export const useData = () => useContext(DataContext);
export const useDataDispatch = () => useContext(DataDispatchContext);

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [dataState, dispatch] = useReducer(dataReducer, INIT_STATE);

  useClientId({ dispatch });
  useLocalSync({ dataState: dataState, dispatch });
  const { sync } = useRemoteSync({ dataState });

  // TODO: this depends on `sync` being memoised by its parent hook
  // ... fix that
  if (sync !== dataState.sync) {
    dispatch({
      type: 'updated_sync_callback',
      callback: sync,
    });
  }

  return (
    <DataContext.Provider value={dataState}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
};
