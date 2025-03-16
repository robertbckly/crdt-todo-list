export const truncate = (string: string, length: number) => {
  const shouldShowEllipsis = string.length > length;
  return `${string.substring(0, length)}${shouldShowEllipsis ? '...' : ''}`;
};
