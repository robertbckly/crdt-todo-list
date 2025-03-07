import type { ActionDispatch } from 'react';

export type DragType = 'pointer' | 'keyboard';

export type DragContextValue = {
  isDragging: boolean;
  dragType: DragType | null;
  dragIndex: number;
  dropIndex: number;
  dropLineIndex: number;
  hitBoxWidth: number;
  hitBoxOffset: number;
  drop: null | ((fromIndex: number, toIndex: number) => void);
};

export type DragAction =
  | { type: 'started'; dragType: DragType; overIndex: number }
  | { type: 'stopped' }
  | { type: 'dragged'; overDropLineIndex: number }
  | { type: 'updated_hit_box'; width: number; offset: number }
  | {
      type: 'updated_drop_callback';
      callback: DragContextValue['drop'];
    };

export type DragDispatch = ActionDispatch<[action: DragAction]>;
