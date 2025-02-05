import type { ComponentProps } from 'react';

export const ItemText = (props: ComponentProps<'p'>) => (
  <p className="grow border border-transparent p-2" {...props} />
);
