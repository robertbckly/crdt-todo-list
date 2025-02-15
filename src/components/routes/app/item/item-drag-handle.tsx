import { useContext, useEffect } from 'react';
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
    draggingType,
    draggingIndex,
    draggingOverIndex,
    startDragging,
    stopDragging,
    setDraggingOverIndex,
  } = useContext(DraggingContext);

  const handlePointerDown: ButtonAttributes['onPointerDown'] = (e) => {
    startDragging('pointer', index);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Handle stop dragging
  useEffect(() => {
    const stop = () => {
      stopDragging();
      onDrop(draggingIndex, Math.ceil(draggingOverIndex));
    };
    document.body.addEventListener('pointerup', stop);
    return () => document.body.removeEventListener('pointerup', stop);
  }, [draggingIndex, draggingOverIndex, onDrop, stopDragging]);

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
        startDragging('keyboard', index);
        break;
      case 'Escape':
        stopDragging();
        break;
      case 'ArrowUp':
        if (draggingType !== 'keyboard' || !draggingOverIndex) break;
        setDraggingOverIndex(draggingOverIndex - 0.5);
        break;
      case 'ArrowDown':
        if (draggingType !== 'keyboard' || !draggingOverIndex) break;
        setDraggingOverIndex(draggingOverIndex + 0.5);
        break;
    }
  };

  return (
    <button
      className={classnames(
        'h-8 w-8 shrink-0 cursor-pointer rounded bg-black active:cursor-grabbing',
        isDragging && index === draggingIndex ? 'opacity-100' : 'opacity-50',
      )}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
    />
  );
};
