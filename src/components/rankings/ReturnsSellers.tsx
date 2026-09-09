import RankingList from './RankingList';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import type { ReturnEntry } from '../../types/analytics';

export interface ReturnsSellersProps {
  data: ReturnEntry[];
}

export default function ReturnsSellers({
  data,
}: ReturnsSellersProps): JSX.Element {
  const max = data.length > 0 ? data[0].value : 0;
  const items = data.map((s) => ({
    name: s.name,
    displayValue: `${formatCurrency(s.value)} · ${formatNumber(s.quantity)} وحدة`,
    percentOfTop: max > 0 ? (s.value / max) * 100 : 0,
  }));
  return (
    <RankingList
      title="أكثر البائعين في المرتجعات"
      items={items}
      emptyLabel="لا توجد مرتجعات في هذه الفترة"
      accent="danger"
    />
  );
}
