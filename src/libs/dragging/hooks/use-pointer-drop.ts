import { useEffect } from 'react';
import { useDrag } from '../drag-context';

export const usePointerDrop = () => {
  const { isDragging, dragType } = useDrag();

  useEffect(() => {
    if (!isDragging || dragType !== 'pointer') return;
    const drop = () => console.log('should drop');
    document.body.addEventListener('pointerup', drop);
    return () => document.body.removeEventListener('pointerup', drop);
  }, [dragType, isDragging]);
};
