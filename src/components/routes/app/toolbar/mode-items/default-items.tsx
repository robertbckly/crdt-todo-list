import { AddIcon } from '../../../../lib/icons/add-icon';
import { BinIcon } from '../../../../lib/icons/bin-icon';
import { ToolbarButton } from '../toolbar-button';

type Props = {
  onCreateItem: () => void;
  onDeleteMode: () => void;
};

export const DefaultItems = ({ onCreateItem, onDeleteMode }: Props) => (
  <div className="flex justify-between gap-4">
    <ToolbarButton name="Use delete-mode" onClick={onDeleteMode}>
      <BinIcon />
    </ToolbarButton>
    <ToolbarButton name="Add item" onClick={onCreateItem}>
      <AddIcon />
    </ToolbarButton>
  </div>
);
