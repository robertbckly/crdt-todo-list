import { useState } from 'react';
import { DefaultItems } from './mode-items/default-items';
import { DeleteItems } from './mode-items/delete-items';

type Props = {
  onCreateStart: () => void;
};

export const Toolbar = ({ onCreateStart }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const mode = isDeleting ? 'delete' : 'default';

  return (
    <div role="menubar">
      {mode === 'default' && (
        <DefaultItems
          onCreateStart={onCreateStart}
          onDeleteStart={() => setIsDeleting(true)}
        />
      )}
      {mode === 'delete' && <DeleteItems onExit={() => setIsDeleting(false)} />}
    </div>
  );
};
