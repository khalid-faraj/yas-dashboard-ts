import RankingList from './RankingList';
import { formatNumber } from '../../utils/formatters';
import type { RankedQuantityEntry } from '../../types/analytics';

export interface TopProductsProps {
  data: RankedQuantityEntry[];
}

export default function TopProducts({ data }: TopProductsProps): JSX.Element {
  const items = data.map((p) => ({
    name: p.name,
    displayValue: `${formatNumber(p.quantity)} وحدة`,
    percentOfTop: p.percentOfTop,
  }));
  return (
    <RankingList
      title="أكثر المنتجات مبيعًا"
      items={items}
      emptyLabel="لا توجد منتجات في هذه الفترة"
    />
  );
}
