import { useState } from 'react';
import { Button } from '../../../lib/button';
import { ItemInput } from './item-input';
import { ItemText } from './item-text';
import { type Item as TItem } from '../../../../types/item';

type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;

type Props = {
  data: TItem;
  disabled?: boolean;
  isLastInList?: boolean;
  onUpdate: (newData: TItem) => void;
  onDelete: () => void;
};

export const Item = ({
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

  const handleKeyDown: InputAttributes['onKeyDown'] = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      endEdit();
    }
  };

  return (
    <li
      className={`flex items-center gap-2 ${!isLastInList ? 'border-b pb-2' : ''}`}
    >
      {isEditing && (
        <ItemInput
          value={inputText}
          disabled={disabled}
          autoFocus
          onChange={(e) => setInputText(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onBlur={endEdit}
        />
      )}
      {!isEditing && (
        <>
          <input
            type="checkbox"
            checked={data.status === 'closed'}
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
