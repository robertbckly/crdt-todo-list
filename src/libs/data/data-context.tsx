import {
  createContext,
  useContext,
  useReducer,
  type PropsWithChildren,
} from 'react';
import { dataReducer } from './data-reducer';
import { useLocalSync } from './hooks/use-local-sync';
import { useRemoteSync } from './hooks/use-remote-sync';
import { useClientId } from './hooks/use-client-id';
import { type DataContextValue, type DataDispatch } from './types';

const INIT_STATE = {
  crdt: { items: [], counters: {} },
  clientId: null,
  isReadyForEdit: false,
  isReadyForSync: false,
  sync: null,
} as const satisfies DataContextValue;

const DataContext = createContext<DataContextValue>(INIT_STATE);
const DataDispatchContext = createContext<DataDispatch | null>(null);

export const useData = () => useContext(DataContext);
export const useDataDispatch = () => useContext(DataDispatchContext);

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [dataState, dispatch] = useReducer(dataReducer, INIT_STATE);

  useClientId({ dispatch });
  useLocalSync({ dataState, dispatch });
  useRemoteSync({ dataState, dispatch });

  return (
    <DataContext.Provider value={dataState}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
};
