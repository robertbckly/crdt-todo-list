import {
  createContext,
  useContext,
  useReducer,
  type PropsWithChildren,
} from 'react';
import { useAutoScroll } from './hooks/use-auto-scroll';
import { useDragHelpers } from './hooks/use-drag-helpers';
import { usePointerDrop } from './hooks/use-pointer-drop';
import { dragReducer } from './drag-reducer';
import type { DragContextValue, DragDispatch } from './types';

const INIT_STATE = {
  isDragging: false,
  dragType: null,
  dragPointerId: null,
  dragIndex: -1,
  dropIndex: -1,
  dropLineIndex: -1,
  hitBoxWidth: 0,
  hitBoxOffset: 0,
  drop: null,
} as const satisfies DragContextValue;

const DragContext = createContext<DragContextValue>(INIT_STATE);
const DragDispatchContext = createContext<DragDispatch | null>(null);

export const useDrag = () => useContext(DragContext);
export const useDragDispatch = () => useContext(DragDispatchContext);

type Props = PropsWithChildren<{
  onDrop: DragContextValue['drop'];
}>;

export const DragProvider = ({ children, onDrop }: Props) => {
  const [dragState, dispatch] = useReducer(dragReducer, INIT_STATE);

  useDragHelpers({ dragState, dispatch });
  usePointerDrop({ dragState, dispatch });
  useAutoScroll({ dragState });

  if (onDrop !== dragState.drop) {
    dispatch({
      type: 'updated_drop_callback',
      callback: onDrop,
    });
  }

  return (
    <DragContext.Provider value={dragState}>
      <DragDispatchContext.Provider value={dispatch}>
        {children}
      </DragDispatchContext.Provider>
    </DragContext.Provider>
  );
};
