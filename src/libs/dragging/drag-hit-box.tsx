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
  const { isDragging, dragType, dropLineIndex, hitBoxWidth, hitBoxOffset } =
    useDrag();
  const dispatch = useDragDispatch();

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
      onPointerMove={handlePointerMove}
      style={{ width: `${hitBoxWidth}px`, left: `${hitBoxOffset}px` }}
      className={classnames(
        'absolute z-[1] h-full',
        debug && 'bg-red-500 opacity-10',
      )}
    />
  );
};
