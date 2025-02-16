import { useContext, useState } from 'react';
import { Button } from '../../../lib/button';
import { ItemInput } from './item-input';
import { ItemText } from './item-text';
import { type Item as TItem } from '../../../../types/item';
import { ItemDragHandle } from './item-drag-handle';
import { DraggingContext } from '../../../../context/dragging-context';
import { classnames } from '../../../../utils/classnames';

type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;
type ListItemAttributes = React.HTMLAttributes<HTMLLIElement>;

type Props = {
  index: number;
  data: TItem;
  disabled?: boolean;
  isLastInList?: boolean;
  onUpdate: (newData: TItem) => void;
  onDelete: () => void;
  onMove: (from: number, to: number) => void;
};

export const Item = ({
  index,
  data,
  disabled = false,
  isLastInList = false,
  onUpdate,
  onDelete,
  onMove,
}: Props) => {
  const [inputText, setInputText] = useState(data.text);
  const [isEditing, setIsEditing] = useState(false);
  const { isDragging, setDropLineIndex: setDropIndex } = useContext(DraggingContext);

  const startEdit = () => setIsEditing(true);

  const endEdit = () => {
    onUpdate({ ...data, text: inputText });
    setIsEditing(false);
  };

  const toggleStatus = () => {
    onUpdate({
      ...data,
      status: data.status === 'open' ? 'closed' : 'open',
    });
  };

  const handleInputKeyDown: InputAttributes['onKeyDown'] = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      endEdit();
    }
  };

  const handleListItemPointerOver: ListItemAttributes['onPointerOver'] = (
    e,
  ) => {
    if (!isDragging) return;
    // Note: all positions are relative to viewport
    const { top, height } = e.currentTarget.getBoundingClientRect();
    const itemMidpoint = top + height / 2;
    const mouseY = e.clientY;
    // Each item gets index & index + 1 without overlap between items,
    // representing above and below the item
    const topBottomOffset = mouseY <= itemMidpoint ? 0 : 1;
    setDropIndex(index * 2 + topBottomOffset);
  };

  return (
    <li
      onPointerOver={handleListItemPointerOver}
      className={classnames(
        'flex items-center gap-2 border-y-2 border-transparent py-2',
        !isLastInList && 'border-b-2 border-b-black pb-2',
      )}
    >
      {isEditing && (
        <ItemInput
          value={inputText}
          disabled={disabled}
          autoFocus
          onChange={(e) => setInputText(e.currentTarget.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={endEdit}
        />
      )}
      {!isEditing && (
        <>
          <ItemDragHandle index={index} onDrop={onMove} />

          <input
            type="checkbox"
            checked={data.status === 'closed'}
            disabled={disabled}
            onChange={toggleStatus}
          />

          <ItemText
            className={`${data.status === 'closed' ? 'text-gray-500 line-through' : ''}`}
          >
            {data.text}
          </ItemText>

          <Button
            onClick={startEdit}
            disabled={disabled || data.status === 'closed'}
          >
            Edit
          </Button>

          <Button onClick={onDelete} disabled={disabled}>
            Delete
          </Button>
        </>
      )}
    </li>
  );
};
