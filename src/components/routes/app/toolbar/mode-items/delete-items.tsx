import { CrossIcon } from '../../../../lib/icons/cross-icon';
import { ToolbarButton } from '../toolbar-button';

type Props = {
  onExit: () => void;
};

export const DeleteItems = ({ onExit }: Props) => (
  <div className="flex justify-center">
    <ToolbarButton name="Exit delete-mode" onClick={onExit}>
      <CrossIcon />
    </ToolbarButton>
  </div>
);
