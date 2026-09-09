import RankingList from './RankingList';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import type { ReturnEntry } from '../../types/analytics';

export interface ReturnsCustomersProps {
  data: ReturnEntry[];
}

export default function ReturnsCustomers({
  data,
}: ReturnsCustomersProps): JSX.Element {
  const max = data.length > 0 ? data[0].value : 0;
  const items = data.map((c) => ({
    name: c.name,
    displayValue: `${formatCurrency(c.value)} · ${formatNumber(c.quantity)} وحدة`,
    percentOfTop: max > 0 ? (c.value / max) * 100 : 0,
  }));
  return (
    <RankingList
      title="أكثر العملاء في المرتجعات"
      items={items}
      emptyLabel="لا توجد مرتجعات في هذه الفترة"
      accent="danger"
    />
  );
}
