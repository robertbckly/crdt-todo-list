import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type RefObject,
} from 'react';
import { startAutoScroll, stopAutoScroll } from '../utils/auto-scroll';

type DragType = 'pointer' | 'keyboard';

type DraggingContextValue = {
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
    }),
    [
      dragIndex,
      dragType,
      dropIndex,
      dropLineIndex,
      hitBoxOffset,
      hitBoxWidth,
      isDragging,
      listLength,
      onDrop,
      onDropIndexChange,
      onStartDragging,
      reset,
    ],
  );

  // Handle pointer-based drop
  useEffect(() => {
    if (!isDragging || dragType !== 'pointer') return;
    document.body.addEventListener('pointerup', value.drop);
    return () => document.body.removeEventListener('pointerup', value.drop);
  }, [dragType, isDragging, value.drop]);

  // Handle pointer-based drag cancellation
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
    document.body.style.cursor =
      isDragging && dragType === 'pointer' ? 'grabbing' : 'auto';
    // Prevent mobile browsers allowing pull-to-refresh etc. while dragging
    document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });
    return () => {
      document.body.style.cursor = 'auto';
      document.body.removeEventListener('touchmove', preventDefault);
    };
  }, [dragType, isDragging]);

  // Handle dynamic hit-box width and offset
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const parent = hitBoxParentRef.current;
      if (entry?.target !== root || !parent) return;
      setHitBoxWidth(root.clientWidth);
      setHitBoxOffset(-parent.getBoundingClientRect().x);
    });

    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
  }, [isDragging, hitBoxParentRef]);

  // Handle drag auto-scroll
  useEffect(() => {
    const viewportHeight = document.documentElement.clientHeight;
    const hasOverflow = document.documentElement.scrollHeight > viewportHeight;

    const doSomething = (e: PointerEvent) => {
      if (!isDragging || !hasOverflow) return;

      const proportion = 0.1; // of viewport to hit for up/down scrolling
      const pointerY = e.clientY;
      const goAbove = pointerY < viewportHeight * proportion;
      const goBelow = pointerY > viewportHeight * (1 - proportion);

      if (goAbove) return startAutoScroll('up');
      if (goBelow) return startAutoScroll('down');
      stopAutoScroll();
    };

    document.addEventListener('pointermove', doSomething);
    return () => {
      stopAutoScroll();
      document.removeEventListener('pointermove', doSomething);
    };
  }, [isDragging]);

  return (
    <DraggingContext.Provider value={value}>
      {children}
    </DraggingContext.Provider>
  );
};
