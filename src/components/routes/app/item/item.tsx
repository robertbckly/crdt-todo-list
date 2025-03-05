import { useState } from 'react';
import { Button } from '../../../lib/button';
import { ItemInput } from './item-input';
import { ItemText } from './item-text';
import { classnames } from '../../../../utils/classnames';
import { DragHandle } from '../../../../libs/drag/drag-handle';
import { DragHitBox } from '../../../../libs/drag/drag-hit-box';
import { type Item as TItem } from '../../../../types/item';

type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;
type Props = {
  index: number;
  data: TItem;
  disabled?: boolean;
  isLastInList?: boolean;
  onUpdate: (newData: TItem) => void;
  onDelete: () => void;
};

export const Item = ({
  index,
  data,
  disabled = false,
  isLastInList = false,
  onUpdate,
  onDelete,
}: Props) => {
  const [inputText, setInputText] = useState(data.text);
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <li
      className={classnames(
        'relative flex items-center gap-2 border-y-2 border-transparent py-2 select-none',
        !isLastInList && 'border-b border-b-black pb-2',
      )}
    >
      <DragHitBox index={index} />

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
          <DragHandle index={index} />

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
