import type { ComponentProps } from 'react';

export const ItemInput = (props: ComponentProps<'input'>) => (
  <input
    type="text"
    className="grow rounded border border-gray-500 p-2"
    {...props}
  />
);
