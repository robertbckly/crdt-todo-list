import { Fragment } from 'react';
import { Item } from '../item/item';
import { ItemDropLine } from '../item/item-drop-line';
import { useDrag } from '../../../../libs/drag/drag-context';
import type { Item as TItem } from '../../../../types/item';

type Props = {
  items: TItem[];
  disabled: boolean;
};

export const ItemList = ({ items, disabled }: Props) => {
  const { isDragging, dropIndex } = useDrag();

  return (
    <ul aria-label="items" className="flex flex-col rounded border px-2">
      <ItemDropLine active={dropIndex === 0} />
      {items
        .sort((a, b) => a.order - b.order)
        .map((item, index) => (
          <Fragment key={item.id}>
            <Item
              index={index}
              data={item}
              disabled={disabled || isDragging}
              isLastInList={index === items.length - 1}
              // onUpdate={handleUpdate}
              // onDelete={() => handleDelete(item.id)}
              onUpdate={() => {}}
              onDelete={() => {}}
            />
            <ItemDropLine
              // Display beneath item before `dropIndex`
              active={index === dropIndex - 1}
            />
          </Fragment>
        ))}
    </ul>
  );
};
