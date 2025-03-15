import type { ActionDispatch } from 'react';

type PointerDragType = 'pointer';
type KeyboardDragType = 'keyboard';
type DragType = PointerDragType | KeyboardDragType;

export type DragContextValue = {
  isDragging: boolean;
  dragType: DragType | null;
  dragPointerId: number | null;
  dragIndex: number;
  dropIndex: number;
  dropLineIndex: number;
  hitBoxWidth: number;
  hitBoxOffset: number;
  drop: null | ((fromIndex: number, toIndex: number) => void);
};

export type DragAction =
  | { type: 'started'; dragType: KeyboardDragType; overIndex: number }
  | {
      type: 'started';
      dragType: PointerDragType;
      pointerId: number;
      overIndex: number;
    }
  | { type: 'stopped' }
  | { type: 'dragged'; overDropLineIndex: number }
  | { type: 'updated_hit_box'; width: number; offset: number }
  | {
      type: 'updated_drop_callback';
      callback: DragContextValue['drop'];
    };

export type DragDispatch = ActionDispatch<[action: DragAction]>;
