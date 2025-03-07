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

    document.body.addEventListener('pointerup', doDrop);
    return () => document.body.removeEventListener('pointerup', doDrop);
  }, [dispatch, dragIndex, dragType, drop, dropIndex, isDragging]);
};
