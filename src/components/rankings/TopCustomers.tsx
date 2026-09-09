import RankingList from './RankingList';
import { formatCurrency } from '../../utils/formatters';
import type { RankedValueEntry } from '../../types/analytics';

export interface TopCustomersProps {
  data: RankedValueEntry[];
}

export default function TopCustomers({ data }: TopCustomersProps): JSX.Element {
  const items = data.map((c) => ({
    name: c.name,
    displayValue: formatCurrency(c.value),
    percentOfTop: c.percentOfTop,
  }));
  return (
    <RankingList
      title="العملاء الأكثر شراءً"
      items={items}
      emptyLabel="لا يوجد عملاء في هذه الفترة"
    />
  );
}
