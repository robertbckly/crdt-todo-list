import type { ActionDispatch } from 'react';
import type { CRDT } from '../../types/crdt';
import type { Item } from '../../types/item';

export type DataContextValue = CRDT;

export type DataAction =
  | {
      type: 'restored';
      clientId: string;
      data: DataContextValue;
    }
  | {
      type: 'created';
      clientId: string;
      text: Item['text'];
    }
  | {
      type: 'updated';
      clientId: string;
      itemId: string;
      updates: Omit<Item, 'id' | 'clientId' | 'counter' | 'order'>;
    }
  | {
      type: 'deleted';
      clientId: string;
      itemId: string;
    }
  | {
      type: 'ordered';
      clientId: string;
      fromIndex: number;
      toIndex: number;
    };

export type DataDispatch = ActionDispatch<[action: DataAction]>;
