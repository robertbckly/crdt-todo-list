import { useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import { useClientId } from './use-client-id';
import { INIT_STATE } from '../init-state';
import type { DataAction, DataContextValue } from '../types';

export const useDataReducer = () => {
  const clientId = useClientId();

  const reducer = (
    state: DataContextValue,
    action: DataAction,
  ): DataContextValue => {
    if (!clientId) return state;
    const clientCounter = state.counters[clientId] ?? 0;

    switch (action.type) {
      case 'restored_data': {
        return action.data;
      }

      case 'created_item': {
        return {
          items: [
            ...state.items,
            {
              id: uuid(),
              clientId,
              counter: clientCounter + 1,
              order: state.items.length,
              text: action.text,
              status: 'open',
            },
          ],
          counters: {
            ...state.counters,
            [clientId]: clientCounter + 1,
          },
        };
      }

      case 'updated_item': {
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
          clientId, // must overwrite as it's this client's counter being incremented
          counter: clientCounter + 1,
        });
        return {
          ...state,
          items: newItems,
        };
      }

      case 'deleted_item': {
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

      case 'ordered_item': {
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

  return useReducer(reducer, INIT_STATE);
};
