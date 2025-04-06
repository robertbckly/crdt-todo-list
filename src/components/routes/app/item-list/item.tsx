import { useState } from 'react';
import { Button } from '../../../lib/button';
import { classnames } from '../../../../utils/classnames';
import { DragHandle } from '../../../../libs/drag/drag-handle';
import { DragHitBox } from '../../../../libs/drag/drag-hit-box';
import { useDataDispatch } from '../../../../libs/data/data-context';
import { DeleteDialog } from '../dialogs/delete-dialog';
import { MultilineInput } from '../../../lib/multiline-input/multiline-input';
import { BinIcon } from '../../../lib/icons/bin-icon';
import { type Item as TItem } from '../../../../types/item';
import { useMode } from '../../../../context/mode-provider';

const TEXT_INPUT_ID = 'text';

type Props = {
  index: number;
  data: TItem;
  disabled?: boolean;
  isLastItem?: boolean;
};

export const Item = ({ index, data, disabled = false }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDataDispatch();
  const mode = useMode();

  const updateText = (newText: string) => {
    dispatch?.({
      type: 'updated_item',
      itemId: data.id,
      updates: {
        ...data,
        text: newText,
      },
    });
  };

  const toggleStatus = () => {
    dispatch?.({
      type: 'updated_item',
      itemId: data.id,
      updates: {
        ...data,
        status: data.status === 'open' ? 'closed' : 'open',
      },
    });
  };

  const deleteItem = (isConfirmed: boolean = false) => {
    if (!isConfirmed) {
      setIsDeleting(true);
      return;
    }
    dispatch?.({
      type: 'deleted_item',
      itemId: data.id,
    });
  };

  return (
    <>
      <li
        aria-labelledby={TEXT_INPUT_ID}
        className={classnames(
          'relative flex items-center gap-2 rounded-md border-transparent py-1',
          mode !== 'default' && 'hover:bg-gray-100',
        )}
      >
        <DragHitBox index={index} />

        <input
          type="checkbox"
          checked={data.status === 'closed'}
          disabled={disabled || mode !== 'default'}
          onChange={toggleStatus}
          className="ml-2 scale-125"
        />

        {/* Extra container needed to prevent clicking to focus outside of bounds */}
        <div className="mx-1 flex-auto">
          <MultilineInput
            initialValue={data.text}
            disabled={mode !== 'default' || data.status === 'closed'}
            onBlur={updateText}
            id={TEXT_INPUT_ID}
            className={classnames(
              'rounded-sm',
              data.status === 'closed' && 'text-gray-500 line-through',
            )}
          />
        </div>

        {mode === 'order' && <DragHandle index={index} />}

        {mode === 'delete' && (
          <Button onClick={() => deleteItem()} disabled={disabled}>
            <BinIcon />
          </Button>
        )}

        {mode !== 'order' && mode !== 'delete' && (
          // Placeholder to prevent layout re-flow on mode change
          <div className="w-[32px] shrink-0 p-2" />
        )}
      </li>

      <DeleteDialog
        open={isDeleting}
        itemName={data.text}
        onConfirm={() => deleteItem(true)}
        onClose={() => setIsDeleting(false)}
      />
    </>
  );
};
