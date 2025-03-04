import { useEffect } from 'react';
import { type DragContextValue, type DragDispatch } from '../drag-context';

export const usePointerDrop = (
  context: DragContextValue,
  dispatch: DragDispatch,
) => {
  const { isDragging, dragType } = context;

  useEffect(() => {
    if (!isDragging || dragType !== 'pointer') return;

    const drop = () => {
      dispatch?.({
        type: 'dropped',
        fromIndex: -1,
        toIndex: -1,
      });
    };

    document.body.addEventListener('pointerup', drop);
    return () => document.body.removeEventListener('pointerup', drop);
  }, [dispatch, dragType, isDragging]);
};
