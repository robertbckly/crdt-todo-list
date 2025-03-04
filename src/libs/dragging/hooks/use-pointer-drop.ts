import { useEffect } from 'react';
import { type DragContextValue, type DragDispatch } from '../drag-context';

export const usePointerDrop = (
  context: DragContextValue,
  dispatch: DragDispatch,
  onDrop: (from: number, to: number) => void,
) => {
  const { isDragging, dragType, dragIndex, dropIndex } = context;

  useEffect(() => {
    if (!isDragging || dragType !== 'pointer') return;

    const drop = () => {
      onDrop(dragIndex, dropIndex);
      dispatch?.({
        type: 'dropped',
        fromIndex: -1,
        toIndex: -1,
      });
    };

    document.body.addEventListener('pointerup', drop);
    return () => document.body.removeEventListener('pointerup', drop);
  }, [dispatch, dragIndex, dragType, dropIndex, isDragging, onDrop]);
};
