import type { DragContextValue, DragAction } from './types';

export const dragReducer = (
  state: DragContextValue,
  action: DragAction,
): DragContextValue => {
  switch (action.type) {
    case 'started':
      return {
        ...state,
        isDragging: true,
        dragType: action.dragType,
        dragIndex: action.overIndex,
        dropIndex: action.overIndex,
        dropLineIndex: action.overIndex * 2,
      };

    case 'dragged':
      return {
        ...state,
        dropIndex: Math.ceil(action.overDropLineIndex / 2),
        dropLineIndex: action.overDropLineIndex,
      };

    case 'stopped':
      return {
        ...state,
        isDragging: false,
        dragType: null,
        dragIndex: -1,
        dropIndex: -1,
        dropLineIndex: -1,
      };

    case 'updated_hit_box':
      return {
        ...state,
        hitBoxWidth: action.width,
        hitBoxOffset: action.offset,
      };

    case 'updated_drop_callback':
      return {
        ...state,
        drop: action.callback,
      };

    default:
      return state;
  }
};
