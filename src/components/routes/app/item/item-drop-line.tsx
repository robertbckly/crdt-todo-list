import { classnames } from '../../../../utils/classnames';

type Props = {
  active: boolean;
};

export const ItemDropLine = ({ active }: Props) => (
  <div className={classnames('h-1', active && 'bg-emerald-400')} />
);
