import { createContext, useState, type PropsWithChildren } from 'react';

type DraggingType = 'pointer' | 'keyboard';

type DraggingContextValue = {
  isDragging: boolean;
  draggingType: DraggingType | null;
  draggingIndex: number;
  draggingOverIndex: number;
  startDragging: (type: DraggingType, index: number) => void;
  stopDragging: () => void;
  setDraggingOverIndex: (index: number) => void;
  onDrop?: (from: number, to: number) => void;
};

export const DraggingContext = createContext<DraggingContextValue>({
  isDragging: false,
  draggingType: null,
  draggingIndex: -1,
  draggingOverIndex: -1,
  startDragging: () => {},
  stopDragging: () => {},
  setDraggingOverIndex: () => {},
});

export const DraggingContextProvider = ({ children }: PropsWithChildren) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingType, setDraggingType] = useState<DraggingType | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number>(-1);
  const [draggingOverIndex, setDraggingOverIndex] = useState<number>(-1);

  const value: DraggingContextValue = {
    isDragging,
    draggingType,
    draggingIndex,
    draggingOverIndex,
    startDragging: (type, index) => {
      setIsDragging(true);
      setDraggingType(type);
      setDraggingIndex(index);
      setDraggingOverIndex(index);
    },
    stopDragging: () => {
      setIsDragging(false);
      setDraggingType(null);
      setDraggingIndex(-1);
      setDraggingOverIndex(-1);
    },
    setDraggingOverIndex,
  };

  return (
    <DraggingContext.Provider value={value}>
      {children}
    </DraggingContext.Provider>
  );
};
