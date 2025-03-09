import { ROUTES } from '../../../../constants/routes';
import { useData } from '../../../../libs/data/data-context';
import { useDrag } from '../../../../libs/drag/drag-context';
import { Button } from '../../../lib/button';
import { Link } from '../../../lib/link';

export const Toolbar = () => {
  const { isReadyForSync, sync } = useData();
  const { isDragging } = useDrag();

  return isReadyForSync ? (
    <Button
      disabled={!isReadyForSync || isDragging}
      onClick={sync || undefined}
      className="self-end"
    >
      Sync
    </Button>
  ) : (
    <Link to={ROUTES.login} className="self-start">
      Login
    </Link>
  );
};
