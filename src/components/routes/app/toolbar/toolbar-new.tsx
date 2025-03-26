import { useState } from 'react';
import { ModalDialog } from '../../../lib/modal-dialog';
import { DefaultItems } from './mode-items/default-items';
import { DeleteItems } from './mode-items/delete-items';
import { Button } from '../../../lib/button';
import { CrossIcon } from '../../../lib/icons/cross-icon';

export const Toolbar = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const mode = isDeleting ? 'delete' : 'default';

  return (
    <>
      <div role="menubar">
        {mode === 'default' && (
          <DefaultItems
            onCreateItem={() => setIsCreating(true)}
            onDeleteMode={() => setIsDeleting(true)}
          />
        )}
        {mode === 'delete' && (
          <DeleteItems onExit={() => setIsDeleting(false)} />
        )}
      </div>

      <ModalDialog open={isCreating} onClose={() => setIsCreating(false)}>
        Creating...
        <Button onClick={() => setIsCreating(false)}>
          <CrossIcon />
        </Button>
      </ModalDialog>
    </>
  );
};
