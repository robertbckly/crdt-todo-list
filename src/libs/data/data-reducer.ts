import { v4 as uuid } from 'uuid';
import type { DataAction, DataContextValue } from './types';

export const dataReducer = (
  state: DataContextValue,
  action: DataAction,
): DataContextValue => {
  // Actions that don't require client ID...

  if (action.type === 'updated_client_id') {
    return {
      ...state,
      clientId: action.clientId,
      isReadyForEdit: true,
    };
  }
  if (action.type === 'updated_sync_callback') {
    return {
      ...state,
      sync: action.callback,
      isReadyForSync: true,
    };
  }

  // Actions that do require client ID...

  const clientId = state.clientId;
  if (!clientId) return state;
  const clientCounter = state.crdt.counters[clientId] ?? 0;

  switch (action.type) {
    case 'restored_data': {
      return {
        ...state,
        crdt: action.data,
      };
    }

    case 'created_item': {
      const newCrdt = structuredClone(state.crdt);
      newCrdt.items.push({
        id: uuid(),
        clientId,
        counter: clientCounter + 1,
        order: state.crdt.items.length,
        text: action.text,
        status: 'open',
      });
      newCrdt.counters[clientId] = clientCounter + 1;
      return {
        ...state,
        crdt: newCrdt,
      };
    }

    case 'updated_item': {
      const itemIndex = state.crdt.items.findIndex(
        (item) => item.id === action.itemId,
      );
      const existingItem = state.crdt.items[itemIndex];
      if (!existingItem) return state;

      const newItems = [...state.crdt.items];
      newItems.splice(itemIndex, 1, {
        ...existingItem,
        ...action.updates,
        id: uuid(),
        // Must use this client's ID and counter to ensure
        // other clients take the updated item
        clientId,
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
      const item = state.crdt.items[action.fromIndex];
      if (!item) return state;

      const offsetCaused = action.toIndex > action.fromIndex ? -1 : 0;
      const newIndex = Math.max(action.toIndex + offsetCaused, 0);

      let newItems = [...state.crdt.items];
      newItems.splice(action.fromIndex, 1);
      newItems.splice(newIndex, 0, item);
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
