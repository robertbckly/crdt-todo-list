import {
  createContext,
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
  setDropLineIndex: (index: number) => void;
  onDrop?: (from: number, to: number) => void;
};

export const DraggingContext = createContext<DraggingContextValue>({
  isDragging: false,
  dragType: null,
  dragIndex: -1,
  dropIndex: -1,
  dropLineIndex: -1,
  startDragging: () => {},
  stopDragging: () => {},
  setDropLineIndex: () => {},
});

export const DraggingContextProvider = ({ children }: PropsWithChildren) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<DragType | null>(null);
  const [dragIndex, setDragIndex] = useState<number>(-1);
  const [dropIndex, setDropIndex] = useState<number>(-1);
  const [dropLineIndex, setDropLineIndex] = useState<number>(-1);

  const handleDropLineChange: DraggingContextValue['setDropLineIndex'] = (
    newLineIndex,
  ) => {
    // Note: each item has x2 drop-line indices, e.g. item-0 has 0 + 1; item-1 has 2 + 3
    setDropLineIndex(newLineIndex);
    setDropIndex(Math.ceil(newLineIndex / 2));
  };

  const value: DraggingContextValue = useMemo(
    () => ({
      isDragging,
      dragType,
      dragIndex,
      dropIndex,
      dropLineIndex,
      startDragging: (type, index) => {
        setIsDragging(true);
        setDragType(type);
        setDragIndex(index);
        setDropIndex(index);
        // Pre-set drop-line index for keyboard, accounting for
        // each item having two drop-line indices
        setDropLineIndex(index * 2);
      },
      stopDragging: () => {
        setIsDragging(false);
        setDragType(null);
        setDragIndex(-1);
        setDropIndex(-1);
        setDropLineIndex(-1);
      },
      setDropLineIndex: handleDropLineChange,
    }),
    [dragIndex, dragType, dropIndex, dropLineIndex, isDragging],
  );

  // Cancel dragging
  useEffect(() => {
    const cancel = () => value.stopDragging();
    document.body.addEventListener('pointerup', cancel);
    document.body.addEventListener('pointerleave', cancel);
    return () => {
      document.body.removeEventListener('pointerup', cancel);
      document.body.removeEventListener('pointerleave', cancel);
    };
  }, [value]);

  return (
    <DraggingContext.Provider value={value}>
      {children}
    </DraggingContext.Provider>
  );
};
