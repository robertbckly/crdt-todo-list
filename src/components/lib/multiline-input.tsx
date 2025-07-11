import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { classnames } from '../../utils/classnames';

type Props = {
  itemId?: string;
  a11yId?: string;
  initialValue?: string;
  autoFocus?: boolean;
  isReadOnly?: boolean;
  className?: string;
  onBlur?: (value: string) => void;
};

export const MultilineInput = ({
  itemId,
  a11yId,
  initialValue = '',
  autoFocus = false,
  isReadOnly = false,
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
    if (isReadOnly) return;
    const isSubmitShortcut = e.metaKey && e.key === 'Enter';

    if (isSubmitShortcut || e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <div
      id={a11yId}
      ref={inputRef}
      role={isReadOnly ? undefined : 'textbox'}
      contentEditable={isReadOnly ? false : 'plaintext-only'}
      suppressContentEditableWarning
      onKeyDown={handleKeyDown}
      className={classnames(
        className,
        'overflow-x-hidden px-1.5',
        !isReadOnly && 'not-focus:cursor-pointer',
      )}
    >
      {staticInitialValue &&
        staticInitialValue
          .split('\n')
          .map((lineString, lineIndex, arrayOfLines) => {
            // Note: it's impossible to avoid using the `index` in the key when
            // uniquely identifying each line, but any issues *should* be resolved
            // by including the text segment itself (i.e. can't foresee a bug from
            // having the same text in the same position in the same item)
            const key = `${itemId}-${lineString}-${lineIndex}`;
            const isLastSegment = lineIndex === arrayOfLines.length - 1;

            if (!lineString.length && !isLastSegment) {
              return <br key={key} />;
            } else {
              return <p key={key}>{lineString}</p>;
            }
          })}
    </div>
  );
};
