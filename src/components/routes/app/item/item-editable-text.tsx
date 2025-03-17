import { useRef } from 'react';
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

  const handleBlur: ParagraphAttributes['onBlur'] = (e) => {
    onComplete(e.currentTarget.innerText);
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
      role={disabled ? undefined : 'textbox'}
      contentEditable={disabled ? 'false' : 'plaintext-only'}
      // spellCheck={} TODO: make dynamic depending on editing
      className={classnames(
        'grow border border-transparent p-2 select-auto',
        className,
      )}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {value}
    </p>
  );
};
