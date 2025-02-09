import { useState } from 'react';
import { Button } from '../../../lib/button';
import { ItemInput } from './item-input';
import { ItemText } from './item-text';
import { type Item as TItem } from '../../../../types/item';

type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;

type Props = {
  value: string;
  disabled?: boolean;
  isLastInList?: boolean;
  onUpdate: (newValue: TItem['value']) => void;
  onDelete: () => void;
};

export const Item = ({
  value,
  disabled = false,
  isLastInList = false,
  onUpdate,
  onDelete,
}: Props) => {
  const [inputValue, setInputValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = () => setIsEditing(true);

  const endEdit = () => {
    onUpdate(inputValue);
    setIsEditing(false);
  };

  const handleKeyDown: InputAttributes['onKeyDown'] = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      endEdit();
    }
  };

  return (
    <li className={`flex gap-2 ${!isLastInList ? 'border-b pb-2' : ''}`}>
      {isEditing ? (
        <ItemInput
          value={inputValue}
          disabled={disabled}
          autoFocus
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onBlur={endEdit}
        />
      ) : (
        <ItemText>{value}</ItemText>
      )}
      {!isEditing && (
        <Button onClick={startEdit} disabled={disabled}>
          Edit
        </Button>
      )}
      {!isEditing && (
        <Button onClick={onDelete} disabled={disabled}>
          Delete
        </Button>
      )}
    </li>
  );
};
