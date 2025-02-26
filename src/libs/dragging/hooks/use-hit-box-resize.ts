import { useEffect, type RefObject } from 'react';

type Params = {
  parentRef: RefObject<HTMLElement | null>;
  onWidthChange: (width: number) => void;
  onOffsetChange: (offset: number) => void;
};

export const useHitBoxResize = ({
  parentRef,
  onWidthChange,
  onOffsetChange,
}: Params) => {
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const parent = parentRef.current;
      if (entry?.target !== root || !parent) return;
      onWidthChange(root.clientWidth);
      onOffsetChange(-parent.getBoundingClientRect().x);
    });

    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
  }, [parentRef, onOffsetChange, onWidthChange]);
};
