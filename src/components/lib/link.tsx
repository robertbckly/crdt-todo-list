import { Link as ReactRouterLink, type LinkProps } from 'react-router';
import { classnames } from '../../utils/classnames';

export const Link = (props: LinkProps) => (
  <ReactRouterLink
    {...props}
    className={classnames('text-cyan-600', props.className)}
  />
);
