import { classnames } from '../../utils/classnames';
import { useDrag } from './drag-context';

// type DivAttributes = React.HTMLAttributes<HTMLDivElement>;
// type Props = {
//   index: number;
// };

/**
 * Invisible hit box to extend item surface for pointer events;
 * enables out-of-bounds dragging to be maintained
 */
export const DragHitBox = () => {
  const debug = false;
  const { isDragging, hitBoxWidth, hitBoxOffset } = useDrag();
  // const dispatch = useDragDispatch();

  // TODO: move this back here from item
  // const handlePointerMove: DivAttributes['onPointerMove'] = (e) => {
  //   if (!isDragging || dragType !== 'pointer') return;
  //   // Note: all positions are relative to viewport
  //   const { top, height } = e.currentTarget.getBoundingClientRect();
  //   const itemMidpoint = top + height / 2;
  //   const mouseY = e.clientY;
  //   // Each item gets index & index + 1 without overlap between items,
  //   // representing above and below the item
  //   const topBottomOffset = mouseY <= itemMidpoint ? 0 : 1;
  //   dispatch?.({
  //     type: 'dragged',
  //     overDropLineIndex: index * 2 + topBottomOffset,
  //   });
  // };

  if (!isDragging) return null;

  return (
    <div
      // onPointerMove={handlePointerMove}
      style={{ width: `${hitBoxWidth}px`, left: `${hitBoxOffset}px` }}
      className={classnames(
        'absolute z-[1] h-full',
        debug && 'bg-red-500 opacity-10',
      )}
    />
  );
};
