import { Fragment } from 'react';
import { Item } from '../item/item';
import { ItemDropLine } from '../item/item-drop-line';
import { useData, useDataDispatch } from '../../../../libs/data/data-context';
import { DragProvider, useDrag } from '../../../../libs/drag/drag-context';

type Props = {
  disabled: boolean;
};

export const ItemList = (props: Props) => {
  const dataDispatch = useDataDispatch();

  const moveItem = (fromIndex: number, toIndex: number) => {
    dataDispatch?.({
      type: 'ordered_item',
      fromIndex,
      toIndex,
    });
  };

  return (
    <DragProvider onDrop={moveItem}>
      <BaseItemList {...props} />
    </DragProvider>
  );
};

const BaseItemList = ({ disabled }: Props) => {
  const { items } = useData();
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
