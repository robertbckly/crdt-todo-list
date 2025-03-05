import { useEffect, useRef } from 'react';
import { classnames } from '../../utils/classnames';
import { useDrag, useDragDispatch } from './drag-context';

type DivAttributes = React.HTMLAttributes<HTMLDivElement>;
type Props = {
  index: number;
};

/**
 * Invisible hit box to extend item surface for pointer events;
 * enables out-of-bounds dragging to be maintained
 */
export const DragHitBox = ({ index }: Props) => {
  const debug = false;
  const hitBoxRef = useRef<HTMLDivElement>(null);
  const { isDragging, dragType, dropLineIndex, hitBoxWidth, hitBoxOffset } =
    useDrag();
  const dispatch = useDragDispatch();

  useEffect(() => {
    if (index !== 0 || !isDragging) return;

    const root = document.getElementById('root');
    if (!root) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const parent = hitBoxRef.current?.parentElement;
      if (entry?.target !== root || !parent) return;
      dispatch?.({
        type: 'updated_hit_box',
        width: root.clientWidth,
        offset: -parent.getBoundingClientRect().x,
      });
    });

    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
  }, [dispatch, index, isDragging]);

  const handlePointerMove: DivAttributes['onPointerMove'] = (e) => {
    if (!isDragging || dragType !== 'pointer') return;

    // Note: all positions are relative to viewport
    const { top, height } = e.currentTarget.getBoundingClientRect();
    const itemMidpoint = top + height / 2;
    const mouseY = e.clientY;

    // Each item gets index & index + 1 without overlap between items,
    // representing above and below the item
    const topBottomOffset = mouseY <= itemMidpoint ? 0 : 1;

    // Don't do anything if drop line hasn't changed
    const newDropLineIndex = index * 2 + topBottomOffset;
    if (newDropLineIndex === dropLineIndex) return;

    dispatch?.({
      type: 'dragged',
      overDropLineIndex: newDropLineIndex,
    });
  };

  if (!isDragging) return null;

  return (
    <div
      ref={hitBoxRef}
      onPointerMove={handlePointerMove}
      style={{ width: `${hitBoxWidth}px`, left: `${hitBoxOffset}px` }}
      className={classnames(
        'absolute z-[1] h-full',
        debug && 'bg-red-500 opacity-10',
      )}
    />
  );
};
