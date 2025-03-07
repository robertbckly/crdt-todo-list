import { createContext, useContext, type PropsWithChildren } from 'react';
import { useDataReducer } from './hooks/use-data-reducer';
import { INIT_STATE } from './init-state';
import { useLocalSync } from './hooks/use-local-sync';
import { type DataContextValue, type DataDispatch } from './types';

const DataContext = createContext<DataContextValue>(INIT_STATE);
const DataDispatchContext = createContext<DataDispatch | null>(null);

export const useData = () => useContext(DataContext);
export const useDataDispatch = () => useContext(DataDispatchContext);

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [dataState, dispatch] = useDataReducer();

  useLocalSync({ dataState: dataState, dispatch });

  return (
    <DataContext.Provider value={dataState}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
};
