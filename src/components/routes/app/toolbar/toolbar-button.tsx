import type { ComponentProps } from 'react';

type Props = ComponentProps<'button'> & { name: string };

export const ToolbarButton = ({ name, ...props }: Props) => (
  <button
    {...props}
    role="menuitem"
    aria-label={name}
    className="cursor-pointer rounded p-1"
  />
);
