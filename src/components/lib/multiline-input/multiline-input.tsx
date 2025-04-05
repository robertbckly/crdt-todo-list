import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { focusAtEnd } from './focus-at-end';
import { classnames } from '../../../utils/classnames';

type Props = {
  initialValue?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  isFormInput?: boolean;
  formInputName?: string;
  className?: string;
  onBlur?: (value: string) => void;
};

export const MultilineInput = ({
  initialValue = '',
  autoFocus = false,
  disabled = false,
  isFormInput = false,
  formInputName,
  className,
  onBlur,
}: Props) => {
  const inputRef = useRef<HTMLParagraphElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
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

  const handlePointerDown: ComponentProps<'p'>['onPointerDown'] = (e) => {
    if (!isFocused) {
      e.preventDefault();
      focus();
    }
  };

  const handleFocus: ComponentProps<'p'>['onFocus'] = (e) => {
    e.preventDefault();
    focus();
  };

  const handleBlur: ComponentProps<'p'>['onBlur'] = (e) => {
    onBlur?.(e.currentTarget.innerText);
    setIsFocused(false);
  };

  const handleKeyDown: ComponentProps<'p'>['onKeyDown'] = (e) => {
    const isSubmitShortcut = e.metaKey && e.key === 'Enter';
    if (isSubmitShortcut || e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  const handleInput: ComponentProps<'p'>['onInput'] = (e) => {
    const hiddenInputEl = hiddenInputRef.current;
    if (!hiddenInputEl) return;
    hiddenInputEl.value = e.currentTarget.innerText;
  };

  return (
    <>
      {isFormInput && (
        <input ref={hiddenInputRef} type="hidden" name={formInputName} />
      )}
      <p
        ref={inputRef}
        role={disabled ? undefined : 'textbox'}
        contentEditable={disabled ? 'false' : 'plaintext-only'}
        suppressContentEditableWarning
        spellCheck={isFocused}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        className={classnames(
          className,
          'flex-auto',
          !isFocused && 'cursor-pointer hover:bg-gray-200',
        )}
      >
        {initialValue}
      </p>
    </>
  );
};
