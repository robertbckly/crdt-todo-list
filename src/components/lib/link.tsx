import { Link as ReactRouterLink, type LinkProps } from 'react-router';

export const Link = (props: LinkProps) => (
  <ReactRouterLink className="text-cyan-600" {...props} />
);
