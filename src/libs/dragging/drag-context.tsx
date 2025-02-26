import {
  createContext,
  useContext,
  useReducer,
  type ActionDispatch,
  type PropsWithChildren,
} from 'react';
import { usePointerDrop } from './hooks/use-pointer-drop';
import { useDraggingHelpers } from './hooks/use-dragging-helpers';
import { useAutoScroll } from './hooks/use-auto-scroll';

type DragType = 'pointer' | 'keyboard';
type DragContextValue = {
  isDragging: boolean;
  dragType: DragType | null;
  dragIndex: number;
  dropIndex: number;
  dropLineIndex: number;
  hitBoxWidth: number;
  hitBoxOffset: number;
};
type Action =
  | { type: 'started'; dragType: DragType; overIndex: number }
  | { type: 'stopped' }
  | { type: 'dragged'; overDropLineIndex: number }
  | { type: 'dropped'; fromIndex: number; toIndex: number };
type Dispatch = ActionDispatch<[action: Action]>;

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
const DragDispatchContext = createContext<Dispatch | null>(null);

const dragReducer = (
  state: DragContextValue,
  action: Action,
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
    default:
      return state;
  }
};

export const useDrag = () => useContext(DragContext);
export const useDragDispatch = () => useContext(DragDispatchContext);

export const DragProvider = ({ children }: PropsWithChildren) => {
  const [dragState, dispatch] = useReducer(dragReducer, INIT_STATE);

  usePointerDrop();
  useDraggingHelpers();
  useAutoScroll();
  // useHitBoxResize({
  //   parentRef: hitBoxParentRef,
  //   onWidthChange: setHitBoxWidth,
  //   onOffsetChange: setHitBoxOffset,
  // });

  return (
    <DragContext.Provider value={dragState}>
      <DragDispatchContext.Provider value={dispatch}>
        {children}
      </DragDispatchContext.Provider>
    </DragContext.Provider>
  );
};
