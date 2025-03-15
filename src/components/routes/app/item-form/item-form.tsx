import { useState } from 'react';
import { Button } from '../../../lib/button';
import { ItemInput } from '../item/item-input';
import { useData, useDataDispatch } from '../../../../libs/data/data-context';
import { useDrag } from '../../../../libs/drag/drag-context';

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;

export const ItemForm = () => {
  const [hasInputValue, setHasInputValue] = useState(false);
  const { isReadyForEdit } = useData();
  const { isDragging } = useDrag();
  const dispatch = useDataDispatch();
  const disabled = !isReadyForEdit || isDragging;

  const handleInputChange: InputAttributes['onChange'] = (e) => {
    setHasInputValue(!!e.target.value.trim());
  };

  const handleSubmit: FormAttributes['onSubmit'] = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form) return;

    const formData = new FormData(form);
    const value = formData.get('text') as string;
    if (!value.trim()) return;

    dispatch?.({
      type: 'created_item',
      text: value,
    });
    setHasInputValue(false);
    form.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-disabled={disabled}
      className="flex gap-2"
    >
      <ItemInput
        name="text"
        autoFocus
        disabled={disabled}
        onChange={handleInputChange}
      />
      <Button type="submit" disabled={disabled || !hasInputValue}>
        Add
      </Button>
    </form>
  );
};
