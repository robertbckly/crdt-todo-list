import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type PropsWithChildren,
} from 'react';
import { v4 as uuid } from 'uuid';
import {
  type DataAction,
  type DataContextValue,
  type DataDispatch,
} from './types';
import { LOCAL_STORAGE_CRDT_KEY } from '../../constants/config';
import { useClientId } from '../../hooks/use-client-id';
import { isCrdt } from '../../utils/is-crdt';

const INIT_STATE = {
  items: [],
  counters: {},
} as const satisfies DataContextValue;

const dataReducer = (
  state: DataContextValue,
  action: DataAction,
): DataContextValue => {
  const clientCounter =
    'clientId' in action ? (state.counters[action.clientId] ?? 0) : null;

  if (clientCounter === null) {
    return state;
  }

  switch (action.type) {
    case 'restored': {
      return action.data;
    }

    case 'created': {
      return {
        items: [
          ...state.items,
          {
            id: uuid(),
            clientId: action.clientId,
            counter: clientCounter + 1,
            order: state.items.length,
            text: action.text,
            status: 'open',
          },
        ],
        counters: {
          ...state.counters,
          [action.clientId]: clientCounter + 1,
        },
      };
    }

    case 'updated': {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.itemId,
      );
      if (itemIndex === -1) return state;

      const existingItem = state.items[itemIndex];
      if (!existingItem) return state;

      const newItems = [...state.items];
      newItems.splice(itemIndex, 1, {
        ...existingItem,
        ...action.updates,
        id: uuid(),
        clientId: action.itemId, // must overwrite as it's this client's counter being incremented
        counter: clientCounter + 1,
      });
      return {
        ...state,
        items: newItems,
      };
    }

    case 'deleted': {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.itemId,
      );
      if (itemIndex === -1) return state;

      const newItems = [...state.items];
      newItems.splice(itemIndex, 1);

      return {
        ...state,
        items: newItems,
      };
    }

    case 'ordered': {
      let newItems = [...state.items];
      const item = newItems[action.fromIndex];
      if (!item) return state;
      const shiftOffset = action.toIndex > action.fromIndex ? -1 : 0;
      newItems.splice(action.fromIndex, 1);
      newItems.splice(Math.max(action.toIndex + shiftOffset, 0), 0, item);
      newItems = newItems.map((item, index) => ({
        ...item,
        order: index,
      }));
      return {
        ...state,
        items: newItems,
      };
    }

    default:
      return state;
  }
};

const DataContext = createContext<DataContextValue>(INIT_STATE);
const DataDispatchContext = createContext<DataDispatch | null>(null);

export const useData = () => useContext(DataContext);
export const useDataDispatch = () => useContext(DataDispatchContext);

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [dataState, dispatch] = useReducer(dataReducer, INIT_STATE);
  const [doneInit, setDoneInit] = useState(false);
  const { clientId } = useClientId();

  const updateLocalCrdt = useCallback((newCrdt: DataContextValue) => {
    localStorage.setItem(LOCAL_STORAGE_CRDT_KEY, JSON.stringify(newCrdt));
  }, []);

  // Init: load CRDT from local storage
  useEffect(() => {
    if (doneInit || !clientId) return;

    // Read local-storage entry
    const localStorageEntry = localStorage.getItem(LOCAL_STORAGE_CRDT_KEY);

    // If non-existent: create local-storage entry
    if (!localStorageEntry) {
      const newCrdt: DataContextValue = {
        items: [],
        counters: { [clientId]: 0 },
      };
      updateLocalCrdt(newCrdt);
      setDoneInit(true);
      return;
    }

    // Otherwise: parse, validate, then load into state
    let existingCrdt: unknown;
    try {
      existingCrdt = JSON.parse(localStorageEntry);
    } catch {
      // Do nothing
    }
    if (!isCrdt(existingCrdt)) return; // TODO: handle corruption

    dispatch({
      type: 'restored',
      clientId,
      data: existingCrdt,
    });
    setDoneInit(true);
  }, [clientId, doneInit, updateLocalCrdt]);

  // Save every change
  useEffect(() => {
    if (!doneInit) return;
    localStorage.setItem(LOCAL_STORAGE_CRDT_KEY, JSON.stringify(dataState));
  }, [dataState, doneInit]);

  return (
    <DataContext.Provider value={dataState}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
};
