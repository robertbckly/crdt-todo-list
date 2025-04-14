import { useSetMode } from '../../../../../context/mode-provider';
import { AddIcon } from '../../../../lib/icons/add-icon';
import { BinIcon } from '../../../../lib/icons/bin-icon';
import { EditIcon } from '../../../../lib/icons/edit-icon';
import { OrderIcon } from '../../../../lib/icons/order-icon';
import { ToolbarButton } from '../toolbar-button';

export const DefaultMode = () => {
  const setMode = useSetMode();
  return (
    <div className="flex flex-row justify-end gap-3">
      <ToolbarButton name="Add item" onClick={() => setMode('create')}>
        <AddIcon />
      </ToolbarButton>

      <ToolbarButton name="Enter update-mode" onClick={() => setMode('update')}>
        <EditIcon />
      </ToolbarButton>

      <ToolbarButton name="Enter reorder-mode" onClick={() => setMode('order')}>
        <OrderIcon />
      </ToolbarButton>

      <ToolbarButton name="Enter delete-mode" onClick={() => setMode('delete')}>
        <BinIcon />
      </ToolbarButton>
    </div>
  );
};
