import { useEffect } from 'react';
import type { DragContextValue, DragDispatch } from '../types';

type Params = {
  dragState: DragContextValue;
  dispatch: DragDispatch;
};

export const useDragHelpers = ({ dragState, dispatch }: Params) => {
  const { isDragging, dragType, dragPointerId } = dragState;

  useEffect(() => {
    const preventDefault = (e: Event) => isDragging && e.preventDefault();
    const cancelOnNewPointer = (e: PointerEvent) => {
      if (e.pointerId !== dragPointerId) {
        dispatch?.({ type: 'stopped' });
      }
    };

    document.body.style.cursor =
      isDragging && dragType === 'pointer' ? 'grabbing' : 'auto';

    // Prevent mobile browsers allowing pull-to-refresh etc. while dragging
    document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });

    // Prevent different pointer from taking over drag or causing
    // drag to become uncontrollable
    document.body.addEventListener('pointerenter', cancelOnNewPointer);

    return () => {
      document.body.style.cursor = 'auto';
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('pointerenter', cancelOnNewPointer);
    };
  }, [dispatch, dragPointerId, dragType, isDragging]);
};
