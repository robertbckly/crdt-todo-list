import { useState } from 'react';
import { Button } from '../../../lib/button';
import { ItemEditableText } from './item-editable-text';
import { classnames } from '../../../../utils/classnames';
import { DragHandle } from '../../../../libs/drag/drag-handle';
import { DragHitBox } from '../../../../libs/drag/drag-hit-box';
import { useDataDispatch } from '../../../../libs/data/data-context';
import { DeleteDialog } from '../dialogs/delete-dialog/delete-dialog';
import { type Item as TItem } from '../../../../types/item';

type Props = {
  index: number;
  data: TItem;
  disabled?: boolean;
  isLastInList?: boolean;
};

export const Item = ({
  index,
  data,
  disabled = false,
  isLastInList = false,
}: Props) => {
  const [inputText, setInputText] = useState(data.text);
  const [isEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDataDispatch();

  if (!isEditing && inputText !== data.text) {
    setInputText(data.text);
  }

  // const startEdit = () => setIsEditing(true);

  const endEdit = (newText: string) => {
    dispatch?.({
      type: 'updated_item',
      itemId: data.id,
      updates: {
        ...data,
        text: newText,
      },
    });
  };

  const deleteItem = (confirmed: boolean = false) => {
    if (!confirmed) {
      setIsDeleting(true);
      return;
    }
    dispatch?.({
      type: 'deleted_item',
      itemId: data.id,
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

  // const handleInputKeyDown: InputAttributes['onKeyDown'] = (e) => {
  //   if (e.key === 'Escape' || e.key === 'Enter') {
  //     endEdit();
  //   }
  // };

  return (
    <>
      <li
        className={classnames(
          'relative flex items-center gap-2 border-y-2 border-transparent py-2 select-none',
          !isLastInList && 'border-b border-b-black pb-2',
        )}
      >
        <DragHitBox index={index} />
        <DragHandle index={index} />

        {/* {isEditing && (
          <ItemInput
            value={inputText}
            disabled={disabled}
            autoFocus
            onChange={(e) => setInputText(e.currentTarget.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={endEdit}
          />
        )} */}

        <input
          type="checkbox"
          checked={data.status === 'closed'}
          disabled={disabled}
          onChange={toggleStatus}
        />

        <ItemEditableText
          value={data.text}
          disabled={data.status === 'closed'}
          onComplete={endEdit}
          className={`${data.status === 'closed' ? 'text-gray-500 line-through' : ''}`}
        />

        <Button onClick={() => deleteItem()} disabled={disabled}>
          x
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
