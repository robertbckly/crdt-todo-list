import type { ComponentProps } from 'react';
import { classnames } from '../../../../utils/classnames';
import { Button } from '../../../lib/button';

type Props = ComponentProps<'button'> & { name: string };

export const ToolbarButton = ({ name, ...props }: Props) => (
  <Button
    {...props}
    role="menuitem"
    aria-label={name}
    className={classnames(
      'cursor-pointer rounded p-1',
      props.disabled && 'opacity-50',
      props.className,
    )}
  />
);
