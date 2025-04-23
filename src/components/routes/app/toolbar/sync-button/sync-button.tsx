import { useState } from 'react';
import { useData } from '../../../../../libs/data/data-context';
import { SyncIcon } from '../../../../lib/icons/sync-icon';
import { ToolbarButton } from '../toolbar-button';
import { classnames } from '../../../../../utils/classnames';
import { AuthIcon } from '../../../../lib/icons/auth-icon';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../../constants/routes';

export const SyncButton = () => {
  const { sync, isReadyForSync } = useData();
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    // Await sync with minimum delay in parallel
    await Promise.all([
      new Promise((resolve) => setTimeout(resolve, 500)),
      sync?.(),
    ]);

    setIsSyncing(false);
  };

  if (!isReadyForSync) {
    return (
      <ToolbarButton name="Login" onClick={() => navigate(ROUTES.login)}>
        <AuthIcon />
      </ToolbarButton>
    );
  }

  return (
    <ToolbarButton
      name={isSyncing ? 'Saving' : 'Save'}
      disabled={isSyncing}
      onClick={handleSync}
    >
      <div className={classnames(isSyncing && 'animate-spin')}>
        <SyncIcon />
      </div>
    </ToolbarButton>
  );
};
