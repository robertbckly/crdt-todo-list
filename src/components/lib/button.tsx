import type { ComponentProps } from 'react';

export const Button = (props: ComponentProps<'button'>) => (
  <button
    {...props}
    className={`${props.className} rounded border p-2 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
  />
);
