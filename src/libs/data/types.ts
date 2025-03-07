import type { ActionDispatch } from 'react';
import type { CRDT } from '../../types/crdt';
import type { Item } from '../../types/item';

export type DataContextValue = CRDT;

export type DataAction =
  | {
      type: 'restored_data';
      data: DataContextValue;
    }
  | {
      type: 'created_item';
      text: Item['text'];
    }
  | {
      type: 'updated_item';
      itemId: string;
      updates: Omit<Item, 'id' | 'clientId' | 'counter' | 'order'>;
    }
  | {
      type: 'deleted_item';
      itemId: string;
    }
  | {
      type: 'ordered_item';
      fromIndex: number;
      toIndex: number;
    };

export type DataDispatch = ActionDispatch<[action: DataAction]>;
