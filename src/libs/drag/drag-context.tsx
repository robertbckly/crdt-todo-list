import {
  createContext,
  useContext,
  useReducer,
  type PropsWithChildren,
} from 'react';
import { useAutoScroll } from './hooks/use-auto-scroll';
import { useDragHelpers } from './hooks/use-drag-helpers';
import { usePointerDrop } from './hooks/use-pointer-drop';
import type { DragContextValue, DragAction, DragDispatch } from './types';

const INIT_STATE = {
  isDragging: false,
  dragType: null,
  dragIndex: -1,
  dropIndex: -1,
  dropLineIndex: -1,
  hitBoxWidth: 0,
  hitBoxOffset: 0,
  dropCallback: null,
} as const satisfies DragContextValue;

const dragReducer = (
  state: DragContextValue,
  action: DragAction,
): DragContextValue => {
  console.log(action);
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
        dropCallback: action.callback,
      };
    default:
      return state;
  }
};

const DragContext = createContext<DragContextValue>(INIT_STATE);
const DragDispatchContext = createContext<DragDispatch | null>(null);

export const useDrag = () => useContext(DragContext);
export const useDragDispatch = () => useContext(DragDispatchContext);

type Props = PropsWithChildren<{
  onDrop: (fromIndex: number, toIndex: number) => void;
}>;

export const DragProvider = ({ children, onDrop }: Props) => {
  const [dragState, dispatch] = useReducer(dragReducer, INIT_STATE);

  if (onDrop !== dragState.dropCallback) {
    dispatch({
      type: 'updated_drop_callback',
      callback: onDrop,
    });
  }

  useDragHelpers({ dragState, dispatch });
  usePointerDrop({ dragState, dispatch });
  useAutoScroll({ dragState });

  return (
    <DragContext.Provider value={dragState}>
      <DragDispatchContext.Provider value={dispatch}>
        {children}
      </DragDispatchContext.Provider>
    </DragContext.Provider>
  );
};
