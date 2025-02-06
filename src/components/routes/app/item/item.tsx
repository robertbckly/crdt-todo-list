import { useState } from 'react';
import { Button } from '../../../lib/button';
import { ItemInput } from './item-input';
import { ItemText } from './item-text';

type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;
// type ButtonAttributes = React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
  value: string;
  isLastInList?: boolean;
  onEdit: InputAttributes['onChange'];
  onDelete: () => void;
};

export const Item = ({ value, isLastInList, onEdit, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = () => setIsEditing(true);
  const endEdit = () => setIsEditing(false);

  const handleKeyDown: InputAttributes['onKeyDown'] = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      endEdit();
    }
  };

  return (
    <li className={`flex gap-2 ${!isLastInList ? 'border-b pb-2' : ''}`}>
      {isEditing ? (
        <ItemInput
          value={value}
          autoFocus
          onChange={onEdit}
          onBlur={endEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <ItemText>{value}</ItemText>
      )}
      {!isEditing && <Button onClick={startEdit}>Edit</Button>}
      {!isEditing && <Button onClick={onDelete}>Delete</Button>}
    </li>
  );
};
