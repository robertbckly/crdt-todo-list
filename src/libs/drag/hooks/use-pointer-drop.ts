import { useEffect } from 'react';
import type { DragContextValue, DragDispatch } from '../types';

type Params = {
  dragState: DragContextValue;
  dispatch: DragDispatch;
};

export const usePointerDrop = ({ dragState, dispatch }: Params) => {
  const { isDragging, dragType, dragIndex, dropIndex, drop } = dragState;

  useEffect(() => {
    if (!isDragging || dragType !== 'pointer') return;

    const doDrop = () => {
      drop?.(dragIndex, dropIndex);
      dispatch({ type: 'stopped' });
    };

    // Listening on document (not body) ensures event is still received
    // when pointer is outside of viewport
    document.addEventListener('pointerup', doDrop);
    return () => document.removeEventListener('pointerup', doDrop);
  }, [dispatch, dragIndex, dragType, drop, dropIndex, isDragging]);
};
