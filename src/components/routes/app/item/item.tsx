import { useContext, useState, type RefObject } from 'react';
import { Button } from '../../../lib/button';
import { ItemInput } from './item-input';
import { ItemText } from './item-text';
import { type Item as TItem } from '../../../../types/item';
import { ItemDragHandle } from './item-drag-handle';
import { DraggingContext } from '../../../../context/dragging-context';
import { classnames } from '../../../../utils/classnames';
import { ItemHitBox } from './item-hit-box';

type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;
type ListItemAttributes = React.HTMLAttributes<HTMLLIElement>;

type Props = {
  index: number;
  data: TItem;
  ref?: RefObject<HTMLLIElement | null>;
  disabled?: boolean;
  isLastInList?: boolean;
  onUpdate: (newData: TItem) => void;
  onDelete: () => void;
};

export const Item = ({
  index,
  data,
  ref,
  disabled = false,
  isLastInList = false,
  onUpdate,
  onDelete,
}: Props) => {
  const [inputText, setInputText] = useState(data.text);
  const [isEditing, setIsEditing] = useState(false);
  const { isDragging, dragType, updateDropLineIndex } =
    useContext(DraggingContext);

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

  const handleListItemPointerMove: ListItemAttributes['onPointerMove'] = (
    e,
  ) => {
    if (!isDragging || dragType !== 'pointer') return;
    // Note: all positions are relative to viewport
    const { top, height } = e.currentTarget.getBoundingClientRect();
    const itemMidpoint = top + height / 2;
    const mouseY = e.clientY;
    // Each item gets index & index + 1 without overlap between items,
    // representing above and below the item
    const topBottomOffset = mouseY <= itemMidpoint ? 0 : 1;
    updateDropLineIndex(index * 2 + topBottomOffset);
  };

  return (
    <li
      ref={ref}
      onPointerMove={handleListItemPointerMove}
      className={classnames(
        'relative flex items-center gap-2 border-y-2 border-transparent py-2',
        !isLastInList && 'border-b border-b-black pb-2',
      )}
    >
      {isDragging && <ItemHitBox />}

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
          <ItemDragHandle index={index} />

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
