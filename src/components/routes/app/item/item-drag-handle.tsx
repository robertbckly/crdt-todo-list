import { useCallback, useContext, useEffect } from 'react';
import { DraggingContext } from '../../../../context/dragging-context';
import { classnames } from '../../../../utils/classnames';

type ButtonAttributes = React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
  index: number;
  onDrop: (fromIndex: number, toIndex: number) => void;
};

export const ItemDragHandle = ({ index, onDrop }: Props) => {
  const {
    isDragging,
    dragType,
    dragIndex,
    dropIndex,
    dropLineIndex,
    startDragging,
    stopDragging,
    setDropLineIndex,
  } = useContext(DraggingContext);

  const handlePointerDown: ButtonAttributes['onPointerDown'] = (e) => {
    startDragging('pointer', index);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleStop = useCallback(() => {
    stopDragging();
    onDrop(dragIndex, dropIndex);
  }, [dragIndex, dropIndex, onDrop, stopDragging]);

  // Handle stop dragging
  useEffect(() => {
    document.body.addEventListener('pointerup', handleStop);
    return () => document.body.removeEventListener('pointerup', handleStop);
  }, [handleStop]);

  // Handle document stuff while dragging
  useEffect(() => {
    const preventDefault = (e: Event) => isDragging && e.preventDefault();

    window.document.body.style.cursor = isDragging ? 'grabbing' : 'auto';
    window.document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });

    return () => {
      window.document.body.style.cursor = 'auto';
      window.document.body.removeEventListener('touchmove', preventDefault);
    };
  }, [isDragging]);

  const handleKeyDown: ButtonAttributes['onKeyDown'] = (e) => {
    switch (e.key) {
      case ' ':
        if (!isDragging) startDragging('keyboard', index);
        if (isDragging) handleStop();
        break;
      case 'Enter':
      case 'Escape':
        handleStop();
        break;
      case 'ArrowUp':
        if (dragType !== 'keyboard') break;
        setDropLineIndex(dropLineIndex - 2);
        break;
      case 'ArrowDown':
        if (dragType !== 'keyboard') break;
        setDropLineIndex(dropLineIndex + 2);
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
      onKeyDown={handleKeyDown}
    />
  );
};
