import { useSetMode } from '../../../../../context/mode-provider';
import { CrossIcon } from '../../../../lib/icons/cross-icon';
import { ToolbarButton } from '../toolbar-button';

export const ReorderMode = () => {
  const setMode = useSetMode();
  return (
    <div className="flex flex-row justify-end gap-3">
      <ToolbarButton
        name="Exit reorder-mode"
        onClick={() => setMode('default')}
      >
        <CrossIcon />
      </ToolbarButton>
    </div>
  );
};
