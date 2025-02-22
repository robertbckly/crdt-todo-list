import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

type DragType = 'pointer' | 'keyboard';

type DraggingContextValue = {
  isDragging: boolean;
  dragType: DragType | null;
  dragIndex: number;
  dropIndex: number;
  dropLineIndex: number;
  startDragging: (type: DragType, index: number) => void;
  stopDragging: () => void;
  updateDropLineIndex: (index: number) => void;
  drop: () => void;
};

type DraggingContextProviderProps = PropsWithChildren<{
  isDragging: boolean;
  dropIndex: number;
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
  startDragging: () => {},
  stopDragging: () => {},
  updateDropLineIndex: () => {},
  drop: () => {},
});

export const DraggingContextProvider = ({
  isDragging,
  dropIndex,
  children,
  onStartDragging,
  onStopDragging,
  onDropIndexChange,
  onDrop,
}: DraggingContextProviderProps) => {
  const [dragType, setDragType] = useState<DragType | null>(null);
  const [dragIndex, setDragIndex] = useState<number>(-1);
  const [dropLineIndex, setDropLineIndex] = useState<number>(-1);

  const reset = useCallback(() => {
    onStopDragging();
    setDragType(null);
    setDragIndex(-1);
    onDropIndexChange(-1);
    setDropLineIndex(-1);
  }, [onDropIndexChange, onStopDragging]);

  const value: DraggingContextValue = useMemo(
    () => ({
      isDragging,
      dragType,
      dragIndex,
      dropIndex,
      dropLineIndex,
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
      updateDropLineIndex: (newLineIndex) => {
        // Note: each item has x2 drop-line indices, e.g. item-0 has 0 + 1; item-1 has 2 + 3
        setDropLineIndex(newLineIndex);
        onDropIndexChange(Math.ceil(newLineIndex / 2));
      },
      drop: () => {
        onDrop(dragIndex, dropIndex);
        reset();
      },
    }),
    [
      dragIndex,
      dragType,
      dropIndex,
      dropLineIndex,
      isDragging,
      onDrop,
      onDropIndexChange,
      onStartDragging,
      reset,
    ],
  );

  // Handle drop
  useEffect(() => {
    if (!isDragging || dragType !== 'pointer') return;
    document.body.addEventListener('pointerup', value.drop);
    return () => document.body.removeEventListener('pointerup', value.drop);
  }, [dragType, isDragging, value.drop]);

  // Handle drag cancellation
  useEffect(() => {
    if (!isDragging || dragType !== 'pointer') return;
    document.body.addEventListener('pointerleave', reset);
    return () => {
      document.body.removeEventListener('pointerleave', reset);
    };
  }, [dragType, isDragging, reset]);

  // Handle quality-of-life stuff while dragging
  useEffect(() => {
    const preventDefault = (e: Event) => isDragging && e.preventDefault();
    window.document.body.style.cursor =
      isDragging && dragType === 'pointer' ? 'grabbing' : 'auto';
    // Prevent mobile browsers allowing pull-to-refresh etc. while dragging
    window.document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });
    return () => {
      window.document.body.style.cursor = 'auto';
      window.document.body.removeEventListener('touchmove', preventDefault);
    };
  }, [dragType, isDragging]);

  return (
    <DraggingContext.Provider value={value}>
      {children}
    </DraggingContext.Provider>
  );
};
