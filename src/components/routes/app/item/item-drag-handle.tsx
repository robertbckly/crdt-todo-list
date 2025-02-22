import { useContext, useRef } from 'react';
import { DraggingContext } from '../../../../context/dragging-context';
import { classnames } from '../../../../utils/classnames';

type ButtonAttributes = React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
  index: number;
};

const DRAG_START_DELAY = 250; // ms

export const ItemDragHandle = ({ index }: Props) => {
  const timeoutRef = useRef<number | null>(null);
  const {
    isDragging,
    dragType,
    dragIndex,
    dropLineIndex,
    startDragging,
    stopDragging,
    updateDropLineIndex,
    drop,
  } = useContext(DraggingContext);

  const handlePointerDown: ButtonAttributes['onPointerDown'] = async (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (e.pointerType === 'touch') {
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, DRAG_START_DELAY);
      });
      if (!timeoutRef.current) return;
    }
    startDragging('pointer', index);
  };

  const handleCancelDuringDelay = () => {
    if (!timeoutRef.current) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const handleKeyDown: ButtonAttributes['onKeyDown'] = (e) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        if (!isDragging) startDragging('keyboard', index);
        if (isDragging) drop();
        break;
      case 'Escape':
        stopDragging();
        break;
      case 'ArrowUp':
        if (dragType !== 'keyboard') break;
        updateDropLineIndex(dropLineIndex - 2);
        break;
      case 'ArrowDown':
        if (dragType !== 'keyboard') break;
        updateDropLineIndex(dropLineIndex + 2);
        break;
    }
  };

  return (
    <button
      className={classnames(
        'h-8 w-8 shrink-0 cursor-pointer rounded bg-black active:cursor-grabbing',
        isDragging && index === dragIndex ? 'opacity-100' : 'opacity-50',
      )}
      onPointerDown={handlePointerDown}
      onPointerLeave={handleCancelDuringDelay}
      onPointerCancel={handleCancelDuringDelay}
      onKeyDown={handleKeyDown}
    />
  );
};
