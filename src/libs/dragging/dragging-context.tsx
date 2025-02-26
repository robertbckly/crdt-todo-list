import {
  createContext,
  useState,
  type PropsWithChildren,
  type RefObject,
} from 'react';
import { useAutoScroll } from './hooks/use-auto-scroll';
import { useHitBoxResize } from './hooks/use-hit-box-resize';
import { useDraggingHelpers } from './hooks/use-dragging-helpers';
import { usePointerDrop } from './hooks/use-pointer-drop';

type DragType = 'pointer' | 'keyboard';

export type DraggingContextValue = {
  isDragging: boolean;
  dragType: DragType | null;
  dragIndex: number;
  dropIndex: number;
  dropLineIndex: number;
  hitBoxWidth: number;
  hitBoxOffset: number;
  startDragging: (type: DragType, index: number) => void;
  stopDragging: () => void;
  updateDropLineIndex: (index: number) => void;
  drop: () => void;
};

type DraggingContextProviderProps = PropsWithChildren<{
  listLength: number;
  isDragging: boolean;
  dropIndex: number;
  hitBoxParentRef: RefObject<HTMLElement | null>;
  onStartDragging: () => void;
  onStopDragging: () => void;
  onDropIndexChange: (newIndex: number) => void;
  onDrop: (from: number, to: number) => void;
}>;

export const DraggingContext = createContext<DraggingContextValue>({
  isDragging: false,
  dragType: null,
  dragIndex: -1,
  dropIndex: -1,
  dropLineIndex: -1,
  hitBoxWidth: 0,
  hitBoxOffset: 0,
  startDragging: () => {},
  stopDragging: () => {},
  updateDropLineIndex: () => {},
  drop: () => {},
});

export const DraggingContextProvider = ({
  listLength,
  isDragging,
  dropIndex,
  hitBoxParentRef,
  children,
  onStartDragging,
  onStopDragging,
  onDropIndexChange,
  onDrop,
}: DraggingContextProviderProps) => {
  const [dragType, setDragType] = useState<DragType | null>(null);
  const [dragIndex, setDragIndex] = useState<number>(-1);
  const [dropLineIndex, setDropLineIndex] = useState<number>(-1);
  const [hitBoxWidth, setHitBoxWidth] = useState(0);
  const [hitBoxOffset, setHitBoxOffset] = useState(0);

  const reset = () => {
    onStopDragging();
    onDropIndexChange(-1);
    setDragType(null);
    setDragIndex(-1);
    setDropLineIndex(-1);
  };

  const value: DraggingContextValue = {
    isDragging,
    dragType,
    dragIndex,
    dropIndex,
    dropLineIndex,
    hitBoxWidth,
    hitBoxOffset,
    startDragging: (type, index) => {
      onStartDragging();
      onDropIndexChange(index);
      setDragType(type);
      setDragIndex(index);
      // Pre-set drop-line index for keyboard, accounting for
      // each item having two drop-line indices
      setDropLineIndex(index * 2);
    },
    stopDragging: reset,
    updateDropLineIndex: (newDropLineIndex) => {
      // Note: each item has x2 drop-line indices,
      // e.g. item-0 has 0 + 1; item-1 has 2 + 3
      const newDropIndex = Math.ceil(newDropLineIndex / 2);
      if (newDropIndex < 0 || newDropIndex > listLength) return;
      setDropLineIndex(newDropLineIndex);
      onDropIndexChange(newDropIndex);
    },
    drop: () => {
      onDrop(dragIndex, dropIndex);
      reset();
    },
  };

  usePointerDrop(value);
  useDraggingHelpers(value);
  useAutoScroll(value);
  useHitBoxResize({
    parentRef: hitBoxParentRef,
    onWidthChange: setHitBoxWidth,
    onOffsetChange: setHitBoxOffset,
  });

  return (
    <DraggingContext.Provider value={value}>
      {children}
    </DraggingContext.Provider>
  );
};
