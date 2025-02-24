import { useContext } from 'react';
import { DraggingContext } from '../../../../context/dragging-context';
import { classnames } from '../../../../utils/classnames';

/**
 * Invisible hit box to extend item surface for pointer events;
 * enables out-of-bounds dragging to be maintained
 */
export const ItemHitBox = () => {
  const { isDragging, hitBoxWidth, hitBoxOffset } = useContext(DraggingContext);
  const debug = false;

  if (!isDragging) return null;

  return (
    <div
      style={{ width: `${hitBoxWidth}px`, left: `${hitBoxOffset}px` }}
      className={classnames(
        'absolute z-[1] h-full',
        debug && 'bg-red-500 opacity-10',
      )}
    />
  );
};
