/**
 * Simple util for concatenating / filtering classname strings
 * to help with dynamic values and Tailwind
 */
export const classnames = (
  ...values: (string | number | boolean | null | undefined)[]
) =>
  [...values]
    .filter((classname) => classname && typeof classname === 'string')
    .join(' ');
