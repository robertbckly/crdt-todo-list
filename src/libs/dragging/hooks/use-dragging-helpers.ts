import { useEffect } from 'react';
import { useDrag, useDragDispatch } from '../drag-context';

export const useDraggingHelpers = () => {
  const { isDragging, dragType } = useDrag();
  const dispatch = useDragDispatch();

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
