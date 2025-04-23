import { DefaultMode } from './modes/default-mode';
import { useMode } from '../../../../context/mode-provider';
import { ActiveMode } from './modes/active-mode';

export const Toolbar = () => {
  const mode = useMode();
  return (
    <div
      role="menubar"
      aria-label="Top-level controls"
      className="sticky top-0 z-[1] bg-white py-2"
    >
      {mode === 'default' && <DefaultMode />}
      {mode === 'update' && <ActiveMode nameLabel="Update mode" />}
      {mode === 'delete' && <ActiveMode nameLabel="Delete mode" />}
      {mode === 'order' && <ActiveMode nameLabel="Reorder mode" />}
    </div>
  );
};
