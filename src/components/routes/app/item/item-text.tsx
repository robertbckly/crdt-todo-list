import type { ComponentProps } from 'react';

export const ItemText = (props: ComponentProps<'p'>) => (
  <p
    {...props}
    className={`${props.className} grow border border-transparent p-2 select-auto`}
  />
);
