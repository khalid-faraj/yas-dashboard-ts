import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { TooltipProps } from 'recharts';

import {
  formatCurrency,
  formatCurrencyFull,
  formatDate,
} from '../utils/formatters';
import styles from './SalesTrendChart.module.css';
import type { SalesTrendPoint } from '../types/analytics';

export interface SalesTrendChartProps {
  data: SalesTrendPoint[];
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDate}>{formatDate(label)}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: entry.color }} />
          <span className={styles.tooltipLabel}>{entry.name}</span>
          <span className={styles.tooltipValue}>
            {entry.value !== undefined ? formatCurrencyFull(Number(entry.value)) : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SalesTrendChart({ data }: SalesTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>اتجاه المبيعات</div>
        <div className={styles.empty}>لا توجد بيانات كافية لعرض الاتجاه</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>اتجاه المبيعات</div>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1688e8" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#1688e8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(v: string) => formatDate(v)}
              tick={{ fontSize: 11, fill: '#9aa3af' }}
              axisLine={{ stroke: '#e7eaf0' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => formatCurrency(v)}
              tick={{ fontSize: 11, fill: '#9aa3af' }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value: string) => <span style={{ color: '#374151' }}>{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="gross"
              name="إجمالي المبيعات"
              stroke="#1688e8"
              strokeWidth={2}
              fill="url(#grossGradient)"
            />
            <Area
              type="monotone"
              dataKey="net"
              name="صافي المبيعات"
              stroke="#16a34a"
              strokeWidth={2}
              fill="url(#netGradient)"
            />
            <Area
              type="monotone"
              dataKey="returns"
              name="المرتجعات"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#returnsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
