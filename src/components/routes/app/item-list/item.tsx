import { useState } from 'react';
import { Button } from '../../../lib/button';
import { classnames } from '../../../../utils/classnames';
import { DragHandle } from '../../../../libs/drag/drag-handle';
import { DragHitBox } from '../../../../libs/drag/drag-hit-box';
import { useDataDispatch } from '../../../../libs/data/data-context';
import { DeleteDialog } from '../dialogs/delete-dialog';
import { MultilineInput } from '../../../lib/multiline-input';
import { BinIcon } from '../../../lib/icons/bin-icon';
import { useMode } from '../../../../context/mode-provider';
import { type Item as TItem } from '../../../../types/item';

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
          'relative flex items-start rounded-md border-transparent p-1.5 pl-0',
        )}
      >
        <DragHitBox index={index} />

        <div className="flex h-8 shrink-0 basis-8 items-center justify-center">
          {mode !== 'delete' && mode !== 'order' && (
            <input
              type="checkbox"
              checked={data.status === 'closed'}
              disabled={disabled || mode !== 'default'}
              onChange={toggleStatus}
              className="scale-125"
            />
          )}

          {mode === 'delete' && (
            <Button
              aria-label={`Delete ${data.text}`}
              disabled={disabled}
              onClick={() => deleteItem()}
            >
              <BinIcon />
            </Button>
          )}

          {mode === 'order' && <DragHandle index={index} />}
        </div>

        {/* Note: extra container needed to prevent clicking to focus outside of bounds */}
        <div className="flex-auto mt-1">
          <MultilineInput
            initialValue={data.text}
            readOnly={mode !== 'update'}
            disabled={data.status === 'closed'}
            onBlur={updateText}
            id={TEXT_INPUT_ID}
            className={classnames(
              'rounded-sm',
              data.status === 'closed' && 'text-gray-500 line-through',
            )}
          />
        </div>
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
