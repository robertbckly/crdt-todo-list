import { useRef, type ComponentProps } from 'react';
import { useData, useDataDispatch } from '../../../../libs/data/data-context';
import { Button } from '../../../lib/button';
import { TickIcon } from '../../../lib/icons/tick-icon';
import { CrossIcon } from '../../../lib/icons/cross-icon';
import { MultilineInput } from '../../../lib/multiline-input';
import { useSetMode } from '../../../../context/mode-provider';

const TEXT_INPUT_NAME = 'text';

export const ItemCreateForm = () => {
  const { isReadyForEdit } = useData();
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDataDispatch();
  const setMode = useSetMode();
  const isDisabled = !isReadyForEdit;

  const handleTextInput = (value: string) => {
    if (!hiddenInputRef.current) return;
    hiddenInputRef.current.value = value;
  };

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
    setMode('default');
  };

  return (
    <form
      aria-label="Add item"
      aria-disabled={isDisabled}
      onSubmit={handleSubmit}
      className="flex items-start gap-3 p-2 pr-0"
    >
      {/* Hidden input kept in sync with `MultilineInput`, as it's not form-compatible */}
      <input ref={hiddenInputRef} type="hidden" name={TEXT_INPUT_NAME} />
      <MultilineInput
        autoFocus
        isReadOnly={isDisabled}
        onBlur={handleTextInput}
        className="mt-1 w-full rounded border"
      />

      <Button type="submit" disabled={isDisabled}>
        <TickIcon />
      </Button>

      <Button
        type="button"
        disabled={isDisabled}
        onClick={() => setMode('default')}
      >
        <CrossIcon />
      </Button>
    </form>
  );
};
