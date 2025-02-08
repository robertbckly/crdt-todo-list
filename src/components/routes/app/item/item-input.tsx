import type { ComponentProps } from 'react';

export const ItemInput = (props: ComponentProps<'input'>) => (
  <input
    type="text"
    className="grow rounded border p-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
    {...props}
  />
);
