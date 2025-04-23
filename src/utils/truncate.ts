export const truncate = (
  string: string,
  length: number,
  stopBeforeBreak: boolean = true,
) => {
  const substring = string.trim().substring(0, length);
  const substringLines = substring.split('\n');

  const hasBreaks = substringLines.length > 1;
  const shouldShowEllipsis =
    substring.length < string.length || (hasBreaks && stopBeforeBreak);

  if (stopBeforeBreak && shouldShowEllipsis) {
    return `${substringLines[0] || ''}...`;
  }

  return `${substring}${shouldShowEllipsis ? '...' : ''}`;
};
