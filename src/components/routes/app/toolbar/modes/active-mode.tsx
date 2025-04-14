import { useSetMode } from '../../../../../context/mode-provider';
import { CrossIcon } from '../../../../lib/icons/cross-icon';
import { ToolbarButton } from '../toolbar-button';

type Props = {
  nameLabel: string;
};

export const ActiveMode = ({ nameLabel }: Props) => {
  const setMode = useSetMode();
  return (
    <div className="flex flex-row items-center justify-end gap-3">
      <h2 className="opacity-80">{nameLabel}</h2>
      <ToolbarButton
        name={`Exit ${nameLabel}`}
        onClick={() => setMode('default')}
      >
        <CrossIcon />
      </ToolbarButton>
    </div>
  );
};
