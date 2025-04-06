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

type Props = {
  index: number;
  data: TItem;
  disabled?: boolean;
  isLastItem?: boolean;
};

export const Item = ({ index, data, disabled = false }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDataDispatch();

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
      <li className="relative flex items-center gap-2 border-y-2 border-transparent py-2 select-none hover:shadow-sm">
        <DragHitBox index={index} />
        <DragHandle index={index} />

        <input
          type="checkbox"
          checked={data.status === 'closed'}
          disabled={disabled}
          onChange={toggleStatus}
        />

        <MultilineInput
          initialValue={data.text}
          disabled={data.status === 'closed'}
          onBlur={updateText}
          className={classnames(
            data.status === 'closed' && 'text-gray-500 line-through',
          )}
        />

        <Button onClick={() => deleteItem()} disabled={disabled}>
          <BinIcon />
        </Button>
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
