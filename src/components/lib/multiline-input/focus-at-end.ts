export const focusAtEnd = (element: HTMLElement | null) => {
  if (!element) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);

  element.focus();
};
