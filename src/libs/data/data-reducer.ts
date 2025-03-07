import { v4 as uuid } from 'uuid';
import type { DataAction, DataContextValue } from './types';

export const dataReducer = (
  state: DataContextValue,
  action: DataAction,
): DataContextValue => {
  if (action.type === 'updated_client_id') {
    return {
      ...state,
      clientId: action.clientId,
    };
  }

  if (action.type === 'updated_sync_callback') {
    return {
      ...state,
      sync: action.callback,
    };
  }

  const clientId = state.clientId;
  if (!clientId) return state;
  const clientCounter = state.crdt.counters[clientId] ?? 0;

  console.log(action);

  switch (action.type) {
    case 'restored_data': {
      return {
        ...state,
        crdt: action.data,
      };
    }

    case 'created_item': {
      return {
        ...state,
        crdt: {
          ...state.crdt,
          items: [
            ...state.crdt.items,
            {
              id: uuid(),
              clientId,
              counter: clientCounter + 1,
              order: state.crdt.items.length,
              text: action.text,
              status: 'open',
            },
          ],
          counters: {
            ...state.crdt.counters,
            [clientId]: clientCounter + 1,
          },
        },
      };
    }

    case 'updated_item': {
      const itemIndex = state.crdt.items.findIndex(
        (item) => item.id === action.itemId,
      );
      if (itemIndex === -1) return state;

      const existingItem = state.crdt.items[itemIndex];
      if (!existingItem) return state;

      const newItems = [...state.crdt.items];
      newItems.splice(itemIndex, 1, {
        ...existingItem,
        ...action.updates,
        id: uuid(),
        clientId, // must overwrite as it's this client's counter being incremented
        counter: clientCounter + 1,
      });
      return {
        ...state,
        crdt: {
          ...state.crdt,
          items: newItems,
        },
      };
    }

    case 'deleted_item': {
      const itemIndex = state.crdt.items.findIndex(
        (item) => item.id === action.itemId,
      );
      if (itemIndex === -1) return state;

      const newItems = [...state.crdt.items];
      newItems.splice(itemIndex, 1);

      return {
        ...state,
        crdt: {
          ...state.crdt,
          items: newItems,
        },
      };
    }

    case 'ordered_item': {
      let newItems = [...state.crdt.items];
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
        crdt: {
          ...state.crdt,
          items: newItems,
        },
      };
    }

    default:
      return state;
  }
};
