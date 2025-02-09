import { Link as ReactRouterLink, type LinkProps } from 'react-router';

export const Link = (props: LinkProps) => (
  <ReactRouterLink {...props} className={`${props.className} text-cyan-600`} />
);
