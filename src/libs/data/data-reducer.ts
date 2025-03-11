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

      const newCrdt = structuredClone(state.crdt);
      newCrdt.items.splice(itemIndex, 1, {
        ...existingItem,
        ...action.updates,
        // Must make new item from this client to ensure
        // updates are applied during other clients' merges
        id: uuid(),
        clientId,
        counter: clientCounter + 1,
      });
      newCrdt.counters[clientId] = clientCounter + 1;

      return {
        ...state,
        crdt: newCrdt,
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

      const newCrdt = structuredClone(state.crdt);
      newCrdt.items.splice(action.fromIndex, 1);
      newCrdt.items.splice(newIndex, 0, item);
      newCrdt.items = newCrdt.items.map((item, index) => ({
        ...item,
        order: index,
        // Must make new item from this client to ensure
        // updates are applied during other clients' merges
        id: uuid(),
        clientId,
        counter: clientCounter + 1,
      }));
      newCrdt.counters[clientId] = clientCounter + 1;

      return {
        ...state,
        crdt: newCrdt,
      };
    }

    default:
      return state;
  }
};
