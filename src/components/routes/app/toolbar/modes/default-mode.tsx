import { AddIcon } from '../../../../lib/icons/add-icon';
import { BinIcon } from '../../../../lib/icons/bin-icon';
import { ToolbarButton } from '../toolbar-button';

type Props = {
  onCreateStart: () => void;
  onDeleteStart: () => void;
};

export const DefaultMode = ({ onCreateStart, onDeleteStart }: Props) => (
  <div className="flex flex-row justify-end gap-2">
    <ToolbarButton name="Add item" onClick={onCreateStart}>
      <AddIcon />
    </ToolbarButton>
    <ToolbarButton name="Enter delete-mode" onClick={onDeleteStart}>
      <BinIcon />
    </ToolbarButton>
  </div>
);
