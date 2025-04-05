import { type ComponentProps } from 'react';
import { useData, useDataDispatch } from '../../../../libs/data/data-context';
import { useDrag } from '../../../../libs/drag/drag-context';
import { Button } from '../../../lib/button';
import { TickIcon } from '../../../lib/icons/tick-icon';
import { CrossIcon } from '../../../lib/icons/cross-icon';
import { MultilineInput } from '../../../lib/multiline-input/multiline-input';

const TEXT_INPUT_NAME = 'text';

type Props = {
  onClose: () => void;
};

export const ItemForm = ({ onClose }: Props) => {
  const { isReadyForEdit } = useData();
  const { isDragging } = useDrag();
  const dispatch = useDataDispatch();
  const disabled = !isReadyForEdit || isDragging;

  const handleSubmit: ComponentProps<'form'>['onSubmit'] = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form) return;

    const formData = new FormData(form);
    const value = formData.get(TEXT_INPUT_NAME);
    if (typeof value !== 'string' || !value.trim()) return;

    dispatch?.({
      type: 'created_item',
      text: value,
    });

    form.reset();
    onClose();
  };

  return (
    <form
      aria-label="Add item"
      aria-disabled={disabled}
      onSubmit={handleSubmit}
      className="flex items-center gap-2"
    >
      <MultilineInput
        isFormInput
        formInputName={TEXT_INPUT_NAME}
        autoFocus
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled}>
        <TickIcon />
      </Button>
      <Button type="button" disabled={disabled} onClick={onClose}>
        <CrossIcon />
      </Button>
    </form>
  );
};
