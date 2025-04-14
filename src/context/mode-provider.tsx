import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

type Mode = 'default' | 'create' | 'update' | 'delete' | 'order';
type SetMode = (newMode: Mode) => void;

const ModeContext = createContext<Mode>('default');
const SetModeContext = createContext<SetMode>(() => {});

export const useMode = () => useContext(ModeContext);
export const useSetMode = () => useContext(SetModeContext);

export const ModeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<Mode>('default');
  return (
    <ModeContext.Provider value={mode}>
      <SetModeContext.Provider value={setMode}>
        {children}
      </SetModeContext.Provider>
    </ModeContext.Provider>
  );
};
