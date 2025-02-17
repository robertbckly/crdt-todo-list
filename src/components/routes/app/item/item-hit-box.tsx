import { useEffect, useRef, useState } from 'react';

/**
 * Invisible hit box to extend item surface for pointer events;
 * enables out-of-bounds dragging to be maintained
 */
export const ItemHitBox = () => {
  const [leftOffset, setLeftOffset] = useState(0);
  const hitBoxRef = useRef<HTMLDivElement>(null);

  // Update `leftOffset` on window resize
  useEffect(() => {
    const updateOffset = () => {
      const parent = hitBoxRef.current?.parentElement;
      setLeftOffset(parent?.getBoundingClientRect().x || 0);
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.addEventListener('resize', updateOffset);
  }, []);

  return (
    <div
      ref={hitBoxRef}
      style={{ left: `-${leftOffset}px` }}
      className="absolute h-full w-dvw"
    />
  );
};
