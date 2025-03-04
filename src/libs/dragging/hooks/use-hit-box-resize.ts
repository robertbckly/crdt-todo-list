import { useEffect, type RefObject } from 'react';
import type { DragDispatch } from '../drag-context';

type Params = {
  parentRef: RefObject<HTMLElement | null>;
  dispatch: DragDispatch;
};

export const useHitBoxResize = ({ parentRef, dispatch }: Params) => {
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const parent = parentRef.current;
      if (entry?.target !== root || !parent) return;
      dispatch({
        type: 'updated_hit_box',
        width: root.clientWidth,
        offset: -parent.getBoundingClientRect().x,
      });
    });

    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
  }, [dispatch, parentRef]);
};
