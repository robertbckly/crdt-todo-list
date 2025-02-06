import { Button } from '../../../lib/button';
import { ItemInput } from '../item/item-input';

type FormAttributes = React.FormHTMLAttributes<HTMLFormElement>;

type Props = {
  onCreate: (newValue: string) => void;
};

export const ItemForm = ({ onCreate }: Props) => {
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
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <ItemInput name="text" autoFocus />
      <Button type="submit">Add</Button>
    </form>
  );
};
