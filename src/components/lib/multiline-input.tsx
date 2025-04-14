import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { classnames } from '../../utils/classnames';

type Props = {
  initialValue?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  onBlur?: (value: string) => void;
};

export const MultilineInput = ({
  initialValue = '',
  autoFocus = false,
  readOnly = false,
  disabled = false,
  id,
  className,
  onBlur,
}: Props) => {
  const inputRef = useRef<HTMLParagraphElement>(null);
  const doneAutofocusRef = useRef(false);
  const [staticInitialValue] = useState(initialValue);

  useEffect(() => {
    if (autoFocus && !doneAutofocusRef.current && inputRef.current) {
      inputRef.current.focus();
      doneAutofocusRef.current = true;
    }
  }, [autoFocus]);

  // Customised blur event-listener is required to ensure
  // hiding virtual keyboard on iPad actually blurs
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const blur = () => {
      // Force blur required for iPad after virtual-keyboard hide
      if (document.activeElement === input) {
        input.blur();
        return;
      }
      // Blur is complete once input no longer active
      onBlur?.(input.innerText);
    };

    // Note 1: I'm using capture to ensure the iPad fix works, as I think
    // hiding the virtual keyboard might be blurring the inner text-node,
    // and because blur events don't bubble, the event listener on the
    // parent contenteditable div isn't fired (something like this, anyway).
    // ---
    // Note 2: it *does* seem as though Safari and Chrome bubble the blur
    // event when it's added via `addEventListener()` (i.e. not via attribute),
    // but I don't trust that (seems non-compliant), so capture is a safer bet.
    input.addEventListener('blur', blur, { capture: true });
    return () => input.removeEventListener('blur', blur, { capture: true });
  }, [onBlur]);

  const handleKeyDown: ComponentProps<'div'>['onKeyDown'] = (e) => {
    if (disabled) return;
    const isSubmitShortcut = e.metaKey && e.key === 'Enter';

    if (isSubmitShortcut || e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <div
      id={id}
      ref={inputRef}
      role={readOnly ? undefined : 'textbox'}
      contentEditable={disabled || readOnly ? false : 'plaintext-only'}
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      className={classnames(
        className,
        'overflow-x-hidden px-1.5',
        !disabled && !readOnly && 'not-focus:cursor-pointer hover:bg-gray-200',
      )}
    >
      {staticInitialValue}
    </div>
  );
};
