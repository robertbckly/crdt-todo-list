import { useContext } from 'react';
import { DraggingContext } from '../../../../context/dragging-context';
import { classnames } from '../../../../utils/classnames';

type ButtonAttributes = React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
  index: number;
};

export const ItemDragHandle = ({ index }: Props) => {
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

  const handlePointerDown: ButtonAttributes['onPointerDown'] = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    startDragging('pointer', index);
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
      onKeyDown={handleKeyDown}
    />
  );
};
