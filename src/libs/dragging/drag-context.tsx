import {
  createContext,
  useContext,
  useReducer,
  type ActionDispatch,
  type PropsWithChildren,
} from 'react';
import { useAutoScroll } from './hooks/use-auto-scroll';
import { useDraggingHelpers } from './hooks/use-dragging-helpers';
import { usePointerDrop } from './hooks/use-pointer-drop';
import { useHitBoxResize } from './hooks/use-hit-box-resize';

export type DragType = 'pointer' | 'keyboard';
export type DragContextValue = {
  isDragging: boolean;
  dragType: DragType | null;
  dragIndex: number;
  dropIndex: number;
  dropLineIndex: number;
  hitBoxWidth: number;
  hitBoxOffset: number;
};
export type DragAction =
  | { type: 'started'; dragType: DragType; overIndex: number }
  | { type: 'stopped' }
  | { type: 'dragged'; overDropLineIndex: number }
  | { type: 'dropped'; fromIndex: number; toIndex: number }
  | { type: 'updated_hit_box'; width: number; offset: number };
export type DragDispatch = ActionDispatch<[action: DragAction]>;

const INIT_STATE = {
  isDragging: false,
  dragType: null,
  dragIndex: -1,
  dropIndex: -1,
  dropLineIndex: -1,
  hitBoxWidth: 0,
  hitBoxOffset: 0,
} as const;
const DragContext = createContext<DragContextValue>(INIT_STATE);
const DragDispatchContext = createContext<DragDispatch | null>(null);

const dragReducer = (
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
    case 'dropped':
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
    default:
      return state;
  }
};

export const useDrag = () => useContext(DragContext);
export const useDragDispatch = () => useContext(DragDispatchContext);

type Props = PropsWithChildren<{
  firstItemRef: React.RefObject<HTMLElement | null>;
  onDrop: (from: number, to: number) => void;
}>;

export const DragProvider = ({ children, firstItemRef, onDrop }: Props) => {
  const [dragState, dispatch] = useReducer(dragReducer, INIT_STATE);

  useDraggingHelpers(dragState, dispatch);
  usePointerDrop(dragState, dispatch, onDrop);
  useAutoScroll(dragState);
  useHitBoxResize({
    parentRef: firstItemRef,
    dispatch,
  });

  return (
    <DragContext.Provider value={dragState}>
      <DragDispatchContext.Provider value={dispatch}>
        {children}
      </DragDispatchContext.Provider>
    </DragContext.Provider>
  );
};
