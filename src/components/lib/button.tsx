import type { ComponentProps } from 'react';

export const Button = (props: ComponentProps<'button'>) => (
  <button className="cursor-pointer rounded border p-2" {...props} />
);
