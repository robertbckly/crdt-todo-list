import type { ActionDispatch } from 'react';
import type { CRDT } from '../../types/crdt';
import type { Item } from '../../types/item';

export type DataContextValue = {
  crdt: CRDT;
  clientId: string | null;
  sync: (() => Promise<void>) | null;
};

export type DataAction =
  | { type: 'restored_data'; data: DataContextValue['crdt'] }
  | { type: 'created_item'; text: Item['text'] }
  | {
      type: 'updated_item';
      itemId: string;
      updates: Omit<Item, 'id' | 'clientId' | 'counter' | 'order'>;
    }
  | { type: 'deleted_item'; itemId: string }
  | { type: 'ordered_item'; fromIndex: number; toIndex: number }
  | { type: 'updated_client_id'; clientId: string }
  | { type: 'updated_sync_callback'; callback: DataContextValue['sync'] };

export type DataDispatch = ActionDispatch<[action: DataAction]>;
