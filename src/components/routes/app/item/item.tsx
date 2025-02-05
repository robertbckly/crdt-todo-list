import { useState } from 'react';
import { Button } from '../../../lib/button';
import { ItemInput } from './item-input';
import { ItemText } from './item-text';

type Props = {
  value: string;
  onChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
};

export const Item = ({ value, onChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <li className="flex gap-2 border-b pb-2">
      {isEditing ? (
        <ItemInput
          value={value}
          onChange={onChange}
          autoFocus
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <ItemText>{value}</ItemText>
      )}
      <Button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Done' : 'Edit'}
      </Button>
    </li>
  );
};
