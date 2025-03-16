import { truncate } from '../../../../../utils/truncate';
import { Button } from '../../../../lib/button';
import { ModalDialog } from '../../../../lib/modal-dialog';

type Props = {
  open: boolean;
  itemName: string;
  onConfirm: () => void;
  onClose: () => void;
};

export const DeleteDialog = ({ open, itemName, onConfirm, onClose }: Props) => {
  return (
    <ModalDialog open={open} onClose={onClose}>
      <form method="dialog">
        <p>
          Are you sure you want to delete{' '}
          <b>&quot;{truncate(itemName, 50)}&quot;</b>?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Delete</Button>
        </div>
      </form>
    </ModalDialog>
  );
};
