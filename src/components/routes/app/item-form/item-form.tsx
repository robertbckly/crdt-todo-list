import { useState } from 'react';
import { Button } from '../../../lib/button';
import { ItemInput } from '../item/item-input';

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;
type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;

type Props = {
  disabled?: boolean;
  onCreate: (newValue: string) => void;
};

export const ItemForm = ({ disabled = false, onCreate }: Props) => {
  const [hasInputValue, setHasInputValue] = useState(false);

  const handleInputChange: InputAttributes['onChange'] = (e) => {
    setHasInputValue(!!e.target.value.trim());
  };

  const handleSubmit: FormAttributes['onSubmit'] = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const value = formData.get('text') as string;
    if (!value.trim()) {
      return;
    }

    onCreate(value);
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
