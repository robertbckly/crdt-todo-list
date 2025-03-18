import { useRef, useState } from 'react';
import { classnames } from '../../../../utils/classnames';

type ParagraphAttributes = React.InputHTMLAttributes<HTMLParagraphElement>;

type Props = {
  value: string;
  disabled?: boolean;
  className: string;
  onComplete: (newValue: string) => void;
};

export const ItemEditableText = ({
  value,
  disabled = false,
  className,
  onComplete,
}: Props) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const focusAtEnd = () => {
    const element = ref.current;
    if (!element) return;

    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    element.focus();
  };

  const handlePointerDown: ParagraphAttributes['onPointerDown'] = (e) => {
    if (isEditing) return;
    e.preventDefault();
    focusAtEnd();
    setIsEditing(true);
  };

  const handleFocus: ParagraphAttributes['onFocus'] = () => {
    focusAtEnd();
  };

  const handleBlur: ParagraphAttributes['onBlur'] = (e) => {
    onComplete(e.currentTarget.innerText);
    setIsEditing(false);
  };

  const handleKeyDown: ParagraphAttributes['onKeyDown'] = (e) => {
    if (e.key === 'Escape') {
      onComplete(e.currentTarget.innerText);
      ref.current?.blur();
    }
  };

  return (
    <p
      ref={ref}
      role={!disabled ? 'textbox' : undefined}
      contentEditable={!disabled ? 'plaintext-only' : 'false'}
      suppressContentEditableWarning
      spellCheck={isEditing ? 'true' : 'false'}
      className={classnames(
        'grow border border-transparent p-2 select-auto',
        !disabled && !isEditing && 'cursor-pointer',
        className,
      )}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {value}
    </p>
  );
};
