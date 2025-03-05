import { useEffect } from 'react';
import type { DragContextValue, DragDispatch } from '../types';

type Params = {
  dragState: DragContextValue;
  dispatch: DragDispatch;
};

export const usePointerDrop = ({ dragState, dispatch }: Params) => {
  const { isDragging, dragType, dragIndex, dropIndex, dropCallback } =
    dragState;

  useEffect(() => {
    if (!isDragging || dragType !== 'pointer') return;

    const drop = () => {
      dropCallback?.(dragIndex, dropIndex);
      dispatch({ type: 'stopped' });
    };

    document.body.addEventListener('pointerup', drop);
    return () => document.body.removeEventListener('pointerup', drop);
  }, [dispatch, dragIndex, dragType, dropCallback, dropIndex, isDragging]);
};
