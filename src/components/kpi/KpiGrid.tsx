import KpiCard from './KpiCard';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import styles from './KpiGrid.module.css';
import type { KpiMetrics } from '../../types/analytics';

export interface KpiGridProps {
  kpis: KpiMetrics;
}

export default function KpiGrid({ kpis }: KpiGridProps): JSX.Element {
  const {
    grossSales,
    returns,
    netSales,
    invoiceCount,
    clientCount,
    averageInvoiceValue,
  } = kpis;

  return (
    <div className={styles.grid}>
      <KpiCard
        label="إجمالي المبيعات"
        value={formatCurrency(grossSales)}
        icon="💰"
        tone="primary"
      />
      <KpiCard
        label="إجمالي المرتجعات"
        value={formatCurrency(returns)}
        icon="↩️"
        tone="danger"
      />
      <KpiCard
        label="صافي المبيعات"
        value={formatCurrency(netSales)}
        icon="📈"
        tone="success"
      />
      <KpiCard
        label="عدد الفواتير"
        value={formatNumber(invoiceCount)}
        icon="🧾"
        tone="neutral"
      />
      <KpiCard
        label="عدد العملاء"
        value={formatNumber(clientCount)}
        icon="👥"
        tone="neutral"
      />
      <KpiCard
        label="متوسط قيمة الفاتورة"
        value={formatCurrency(averageInvoiceValue)}
        icon="📊"
        tone="primary"
      />
    </div>
  );
}
