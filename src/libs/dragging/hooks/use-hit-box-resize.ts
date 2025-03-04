import { useEffect, type RefObject } from 'react';

type Params = {
  parentRef: RefObject<HTMLElement | null>;
  onChange: (params: Record<'width' | 'offset', number>) => void;
};

export const useHitBoxResize = ({ parentRef, onChange }: Params) => {
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const parent = parentRef.current;
      if (entry?.target !== root || !parent) return;
      onChange({
        width: root.clientWidth,
        offset: -parent.getBoundingClientRect().x,
      });
    });

    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
  }, [onChange, parentRef]);
};
