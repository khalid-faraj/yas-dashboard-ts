
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
import type { TooltipProps } from 'recharts';
import type { LabelProps } from 'recharts';

import { formatCurrency, formatCurrencyFull } from '../utils/formatters';

import styles from './MonthlyNetSalesChart.module.css';
import type { MonthlySalesPoint } from '../types/analytics';

export interface MonthlyNetSalesChartProps {
  data: MonthlySalesPoint[];
}

interface MonthlyChartRow {
  monthKey: string;
  label: string;
  net: number;
}

const MONTH_NAMES = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

function getMonthLabel(monthKey: string | undefined): string {
  if (!monthKey) {
    return '';
  }

  const parts = String(monthKey).split('-');

  if (parts.length !== 2) {
    return monthKey;
  }

  const year = Number(parts[0]);
  const monthNumber = Number(parts[1]);

  if (!year || monthNumber < 1 || monthNumber > 12) {
    return monthKey;
  }

  return `${MONTH_NAMES[monthNumber - 1]} - ${year}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const netEntry = payload.find((entry) => entry.dataKey === 'net');

  if (!netEntry || netEntry.value === undefined) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipMonth}>{label}</div>

      <div className={styles.tooltipRow}>
        <span className={styles.tooltipLabel}>صافي المبيعات</span>

        <span className={styles.tooltipValue}>
          {formatCurrencyFull(Number(netEntry.value))}
        </span>
      </div>
    </div>
  );
}

/**
 * Label shown at the end of every horizontal bar.
 */
function NetValueLabel(props: LabelProps) {
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

export default function MonthlyNetSalesChart({
  data,
}: MonthlyNetSalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>صافي المبيعات لكل شهر</div>

        <div className={styles.empty}>
          لا توجد بيانات كافية لعرض الرسم البياني
        </div>
      </div>
    );
  }

  /**
   * getSalesByMonths() returns:
   *
   * {
   *   month: "2026-05",
   *   value: 123456,
   *   gross: 123456,
   *   returns: 10000,
   *   net: 113456
   * }
   *
   * We only use:
   *
   * net = gross - returns
   */
  const chartData: MonthlyChartRow[] = [...data]
    .map((item) => ({
      monthKey: item.month,

      // مثال:
      // 2025-01 => يناير - 2025
      // 2025-02 => فبراير - 2025
      // 2026-01 => يناير - 2026
      label: getMonthLabel(item.month),

      net: Number(item.net ?? 0),
    }))
    .reverse();

  return (
    <div className={styles.card}>
      <div className={styles.header}>صافي المبيعات لكل شهر</div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 20,
              right: 80,
              left: 20,
              bottom: 10,
            }}
            barCategoryGap="25%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#eef1f5"
              horizontal={false}
            />

            {/* قيمة المبيعات */}
            <XAxis
              type="number"
              tickFormatter={(value: number) => formatCurrency(value)}
              tick={{
                fontSize: 11,
                fill: '#9aa3af',
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* أسماء الشهور + السنة */}
            <YAxis
              type="category"
              dataKey="label"
              width={120}
              tick={{
                fontSize: 12,
                fill: '#9aa3af',
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: '#f7f9fc',
              }}
            />

            {/* صافي المبيعات فقط */}
            <Bar
              dataKey="net"
              name="صافي المبيعات"
              fill="#1688e8"
              radius={[0, 6, 6, 0]}
              maxBarSize={42}
            >
              <LabelList dataKey="net" content={<NetValueLabel />} />

              {chartData.map((entry) => (
                <Cell key={`net-${entry.monthKey}`} fill="#1688e8" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
