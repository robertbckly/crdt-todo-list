import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { focusAtEnd } from './focus-at-end';
import { classnames } from '../../../utils/classnames';

type Props = {
  initialValue?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  onBlur?: (value: string) => void;
};

export const MultilineInput = ({
  initialValue = '',
  autoFocus = false,
  disabled = false,
  id,
  className,
  onBlur,
}: Props) => {
  const inputRef = useRef<HTMLParagraphElement>(null);
  const [staticInitialValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (autoFocus && !isFocused) {
      focus();
    }
  }, [autoFocus, isFocused]);

  const focus = () => {
    focusAtEnd(inputRef.current);
    setIsFocused(true);
  };

  const handlePointerDown: ComponentProps<'div'>['onPointerDown'] = (e) => {
    if (disabled || isFocused) return;
    e.preventDefault();
    // focus();
  };

  const handlePointerUp: ComponentProps<'div'>['onPointerUp'] = (e) => {
    if (disabled || isFocused) return;
    e.preventDefault();
    focus();
  };

  const handleFocus: ComponentProps<'div'>['onFocus'] = (e) => {
    e.preventDefault();
    focus();
  };

  const handleBlur: ComponentProps<'div'>['onBlur'] = (e) => {
    onBlur?.(e.currentTarget.innerText);
    setIsFocused(false);
  };

  const handleKeyDown: ComponentProps<'div'>['onKeyDown'] = (e) => {
    if (disabled) return;
    const isSubmitShortcut = e.metaKey && e.key === 'Enter';
    if (isSubmitShortcut || e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={inputRef}
      role="textbox"
      contentEditable={disabled ? false : 'plaintext-only'}
      suppressContentEditableWarning
      spellCheck={isFocused}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      id={id}
      className={classnames(
        className,
        'w-full px-2 py-1',
        !isFocused && !disabled && 'cursor-pointer hover:bg-gray-100',
      )}
    >
      {staticInitialValue}
    </div>
  );
};
