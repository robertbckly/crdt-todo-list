import { useEffect, useRef } from 'react';

/**
 * Invisible hit box to extend item surface for pointer events;
 * enables out-of-bounds dragging to be maintained
 */
export const ItemHitBox = () => {
  const hitBoxRef = useRef<HTMLDivElement>(null);

  // Dynamically update width and offset if window resized
  useEffect(() => {
    const updateOffset = () => {
      const hitBox = hitBoxRef.current;
      const parent = hitBox?.parentElement;
      if (!hitBox || !parent) return;
      hitBox.style.left = `-${parent.getBoundingClientRect().x || 0}px`;
      hitBox.style.width = `${document.body.clientWidth}px`;
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.addEventListener('resize', updateOffset);
  }, []);

  return <div ref={hitBoxRef} className="absolute z-[1] h-full" />;
};
