import { useState } from 'react';
import { DefaultMode } from './modes/default-mode';
import { DeleteMode } from './modes/delete-mode';

type Mode = 'default' | 'delete';

type Props = {
  onCreateStart: () => void;
};

export const Toolbar = ({ onCreateStart }: Props) => {
  const [mode, setMode] = useState<Mode>('default');

  return (
    <div role="menubar">
      {mode === 'default' && (
        <DefaultMode
          onCreateStart={onCreateStart}
          onDeleteStart={() => setMode('delete')}
        />
      )}
      {mode === 'delete' && <DeleteMode onExit={() => setMode('default')} />}
    </div>
  );
};
