import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import type { LabelProps, TooltipProps } from 'recharts';

import { formatCurrency, formatCurrencyFull, formatNumber } from '../../utils/formatters';
import styles from './CollectionsBarChart.module.css';
import type { CollectionChartDatum } from '../../types/employeeCollections';

export interface CollectionsBarChartProps {
  data: CollectionChartDatum[];
  barColor: string;
  valueLabel: string;
  emptyMessage: string;
  visibleColumns?: number;
}

interface ChartTooltipProps extends TooltipProps<number, string> {
  valueLabel?: string;
}

function ChartTooltip({ active, payload, label, valueLabel }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const entry = payload[0];

  if (entry.value === undefined) {
    return null;
  }

  const datum = entry.payload as CollectionChartDatum | undefined;

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipName}>{label}</div>

      <div className={styles.tooltipRow}>
        <span className={styles.tooltipLabel}>{valueLabel}</span>
        <span className={styles.tooltipValue}>
          {formatCurrencyFull(Number(entry.value))}
        </span>
      </div>

      {datum?.transactionsCount !== undefined && (
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipLabel}>عدد العمليات</span>
          <span className={styles.tooltipValue}>
            {formatNumber(datum.transactionsCount)}
          </span>
        </div>
      )}
    </div>
  );
}

/** Label shown at the end of every horizontal bar. */
function BarValueLabel(props: LabelProps) {
  const { x, y, width, height, value } = props;

  if (value === undefined || value === null) {
    return null;
  }

  const numericX = Number(x) || 0;
  const numericY = Number(y) || 0;
  const numericWidth = Number(width) || 0;
  const numericHeight = Number(height) || 0;
  const numericValue = Number(value) || 0;

  return (
    <text
      x={numericX + numericWidth + 8}
      y={numericY + numericHeight / 2}
      textAnchor="start"
      dominantBaseline="middle"
      fill="#10241E"
      fontSize={12}
      fontWeight={700}
    >
      {formatCurrency(numericValue)}
    </text>
  );
}

export default function CollectionsBarChart({
  data,
  barColor,
  valueLabel,
  emptyMessage,
  visibleColumns,
}: CollectionsBarChartProps): JSX.Element {
  if (!data || data.length === 0) {
    return <div className={styles.empty}>{emptyMessage}</div>;
  }

  const chartData =
    visibleColumns !== undefined
      ? data.slice(0, visibleColumns)
      : data;

  const chartHeight = Math.max(320, chartData.length * 46);

  return (
    <div className={styles.chartWrap}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 90, left: 20, bottom: 10 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" horizontal={false} />

          <XAxis
            type="number"
            tickFormatter={(value: number) => formatCurrency(value)}
            tick={{ fontSize: 11, fill: '#9aa3af' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={180}
            tick={{ fontSize: 12, fill: '#9aa3af' }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            content={<ChartTooltip valueLabel={valueLabel} />}
            cursor={{ fill: '#f7f9fc' }}
          />

          <Bar dataKey="value" name={valueLabel} fill={barColor} radius={[0, 6, 6, 0]} maxBarSize={28}>
            <LabelList dataKey="value" content={<BarValueLabel />} />
            {chartData.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
