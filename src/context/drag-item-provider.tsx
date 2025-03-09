import { useCallback, type PropsWithChildren } from 'react';
import { DragProvider } from '../libs/drag/drag-context';
import { useDataDispatch } from '../libs/data/data-context';

/**
 * Glues together data and generic drag-context
 * to support item moving on drop
 */
export const DragItemProvider = ({ children }: PropsWithChildren) => {
  const dataDispatch = useDataDispatch();

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      dataDispatch?.({
        type: 'ordered_item',
        fromIndex,
        toIndex,
      });
    },
    [dataDispatch],
  );

  return <DragProvider onDrop={moveItem}>{children}</DragProvider>;
};
