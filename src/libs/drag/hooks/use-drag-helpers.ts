import { useEffect } from 'react';
import type { DragContextValue, DragDispatch } from '../types';

type Params = {
  dragState: DragContextValue;
  dispatch: DragDispatch;
};

export const useDragHelpers = ({ dragState, dispatch }: Params) => {
  const { isDragging, dragType } = dragState;

  useEffect(() => {
    const preventDefault = (e: Event) => isDragging && e.preventDefault();
    const stop = () => dispatch?.({ type: 'stopped' });

    document.body.style.cursor =
      isDragging && dragType === 'pointer' ? 'grabbing' : 'auto';

    // Prevent mobile browsers allowing pull-to-refresh etc. while dragging
    document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });

    document.body.addEventListener('pointerenter', stop);

    return () => {
      document.body.style.cursor = 'auto';
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('pointerenter', stop);
    };
  }, [dispatch, dragType, isDragging]);
};
