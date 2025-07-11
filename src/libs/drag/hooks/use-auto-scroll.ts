import { useEffect } from 'react';
import type { DragContextValue } from '../types';

const RATE = 4;

let currentScroll: 'up' | 'down' | null = null;

// TODO: add timer-based incrementing for inter-device consistency
const autoScroll = () => {
  if (currentScroll === null) return;
  window.scrollBy({ top: currentScroll === 'up' ? -RATE : RATE });
  requestAnimationFrame(autoScroll);
};

const startAutoScroll = (type: Exclude<typeof currentScroll, null>) => {
  const isStopped = currentScroll === null;
  currentScroll = type;
  if (isStopped) autoScroll();
};

const stopAutoScroll = () => {
  currentScroll = null;
};

type Params = {
  dragState: DragContextValue;
};

export const useAutoScroll = ({ dragState }: Params) => {
  const { isDragging } = dragState;

  useEffect(() => {
    const viewportHeight = document.documentElement.clientHeight;
    const hasOverflow = document.documentElement.scrollHeight > viewportHeight;

    const handleMove = (e: PointerEvent) => {
      if (!isDragging || !hasOverflow) return;

      const proportion = 0.1; // of viewport to hit for up/down scrolling
      const pointerY = e.clientY;
      const goAbove = pointerY < viewportHeight * proportion;
      const goBelow = pointerY > viewportHeight * (1 - proportion);

      if (goAbove) return startAutoScroll('up');
      if (goBelow) return startAutoScroll('down');
      stopAutoScroll();
    };

    document.addEventListener('pointermove', handleMove);
    return () => {
      stopAutoScroll();
      document.removeEventListener('pointermove', handleMove);
    };
  }, [isDragging]);
};
