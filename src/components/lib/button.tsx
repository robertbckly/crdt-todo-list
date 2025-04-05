import type { ComponentProps } from 'react';
import { classnames } from '../../utils/classnames';

export const Button = (props: ComponentProps<'button'>) => (
  <button
    {...props}
    className={classnames(
      'rounded p-2 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
      props.className,
    )}
  />
);
