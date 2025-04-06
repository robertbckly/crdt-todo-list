import { useRef } from 'react';
import { classnames } from '../../utils/classnames';
import { useDrag, useDragDispatch } from './drag-context';
import { MoveIcon } from '../../components/lib/icons/move-icon';

type ButtonAttributes = React.ButtonHTMLAttributes<HTMLButtonElement>;
type Props = {
  index: number;
};

const DRAG_START_DELAY = 250; // ms

export const DragHandle = ({ index }: Props) => {
  const timeoutRef = useRef<number | null>(null);
  const { isDragging, dragType, dragIndex, dropIndex, dropLineIndex, drop } =
    useDrag();
  const dispatch = useDragDispatch();

  const handlePointerDown: ButtonAttributes['onPointerDown'] = async (e) => {
    if (!e.isPrimary) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (e.pointerType === 'touch') {
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, DRAG_START_DELAY);
      });
      if (!timeoutRef.current) return;
    }

    dispatch?.({
      type: 'started',
      dragType: 'pointer',
      pointerId: e.pointerId,
      overIndex: index,
    });
  };

  const handleCancelDuringDelay = () => {
    if (!timeoutRef.current) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const handleKeyDown: ButtonAttributes['onKeyDown'] = (e) => {
    e.preventDefault();
    switch (e.key) {
      case ' ':
      case 'Enter':
        if (!isDragging) {
          dispatch?.({
            type: 'started',
            dragType: 'keyboard',
            overIndex: index,
          });
        }
        if (isDragging) {
          drop?.(dragIndex, dropIndex);
          dispatch?.({ type: 'stopped' });
        }
        break;
      case 'Escape':
        dispatch?.({ type: 'stopped' });
        break;
      case 'ArrowUp':
        if (dragType !== 'keyboard') break;
        dispatch?.({ type: 'dragged', overDropLineIndex: dropLineIndex - 2 });
        break;
      case 'ArrowDown':
        if (dragType !== 'keyboard') break;
        dispatch?.({ type: 'dragged', overDropLineIndex: dropLineIndex + 2 });
        break;
    }
  };

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerLeave={handleCancelDuringDelay}
      onPointerCancel={handleCancelDuringDelay}
      onKeyDown={handleKeyDown}
      className={classnames(
        'h-8 w-8 shrink-0 cursor-pointer rounded hover:opacity-100 active:cursor-grabbing',
        isDragging && index === dragIndex ? 'opacity-100' : 'opacity-50',
      )}
    >
      <MoveIcon />
    </button>
  );
};
