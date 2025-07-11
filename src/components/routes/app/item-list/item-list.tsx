import { Fragment } from 'react';
import { Item } from './item';
import { ItemDropLine } from './item-drop-line';
import { useData } from '../../../../libs/data/data-context';
import { useDrag } from '../../../../libs/drag/drag-context';

export const ItemList = () => {
  const {
    crdt: { items },
    isReadyForEdit,
  } = useData();
  const { isDragging, dropIndex } = useDrag();
  const disabled = !isReadyForEdit || isDragging;

  return (
    <ul aria-label="items" className="flex flex-col rounded">
      <ItemDropLine active={dropIndex === 0} />
      {items
        .sort((a, b) => a.order - b.order)
        .map((item, index) => (
          <Fragment key={item.id}>
            <Item
              index={index}
              data={item}
              disabled={disabled}
              isLastItem={index === items.length - 1}
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
