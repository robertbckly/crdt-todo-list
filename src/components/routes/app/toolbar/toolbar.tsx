import { DefaultMode } from './modes/default-mode';
import { DeleteMode } from './modes/delete-mode';
import { ReorderMode } from './modes/reorder-mode';
import { useMode } from '../../../../context/mode-provider';

export const Toolbar = () => {
  const mode = useMode();
  return (
    <div role="menubar" className="sticky top-0 z-[1] bg-white py-2">
      {mode === 'default' && <DefaultMode />}
      {mode === 'delete' && <DeleteMode />}
      {mode === 'order' && <ReorderMode />}
    </div>
  );
};
