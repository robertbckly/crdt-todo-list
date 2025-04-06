import { CrossIcon } from '../../../../lib/icons/cross-icon';
import { ToolbarButton } from '../toolbar-button';

type Props = {
  onExit: () => void;
};

export const DeleteMode = ({ onExit }: Props) => (
  <div className="flex flex-row justify-end gap-2">
    <ToolbarButton name="Exit delete-mode" onClick={onExit}>
      <CrossIcon />
    </ToolbarButton>
  </div>
);
