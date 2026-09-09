import RankingList from './RankingList';
import { formatCurrency } from '../../utils/formatters';
import type { RankedValueEntry } from '../../types/analytics';

export interface TopSellersProps {
  data: RankedValueEntry[];
}

export default function TopSellers({ data }: TopSellersProps): JSX.Element {
  const items = data.map((s) => ({
    name: s.name,
    displayValue: formatCurrency(s.value),
    percentOfTop: s.percentOfTop,
  }));
  return (
    <RankingList
      title="البائعون الأكثر بيعًا"
      items={items}
      emptyLabel="لا يوجد بائعون في هذه الفترة"
    />
  );
}
