import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { TooltipProps } from 'recharts';

import {
  formatCurrency,
  formatCurrencyFull,
  formatPercentage,
} from '../utils/formatters';

import styles from './SalesByCategory.module.css';
import type { CategoryEntry } from '../types/analytics';

export interface SalesByCategoryProps {
  data: CategoryEntry[];
}

const PALETTE = ['#1688e8', '#16a34a', '#f59e0b', '#8b5cf6', '#06b6d4'];

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const entry = payload[0];

  if (entry.value === undefined) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipName}>{entry.name}</div>

      <div className={styles.tooltipValue}>
        {formatCurrencyFull(Number(entry.value))}
      </div>
    </div>
  );
}

export default function SalesByCategory({ data }: SalesByCategoryProps) {
  /**
   * Get only the top 8 categories by sales value.
   *
   * We create a new array so the original `data`
   * remains untouched.
   *
   * NOTE: hooks must run unconditionally, so this is computed
   * before the early-return below (same effective behavior as the
   * original component, which only rendered the chart once data
   * was known to be non-empty).
   */
  const topCategories = useMemo(() => {
    return [...(data ?? [])]
      .sort((a, b) => Number(b.value || 0) - Number(a.value || 0))
      .slice(0, 8);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>المبيعات حسب التصنيف</div>

        <div className={styles.empty}>لا توجد بيانات تصنيف لهذه الفترة</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>المبيعات حسب التصنيف</div>

      <div className={styles.body}>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={topCategories}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={2}
                stroke="none"
              >
                {topCategories.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={PALETTE[index % PALETTE.length]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className={styles.legend}>
          {topCategories.map((entry, index) => (
            <li key={entry.name} className={styles.legendRow}>
              <span
                className={styles.legendDot}
                style={{
                  background: PALETTE[index % PALETTE.length],
                }}
              />

              <span className={styles.legendName}>{entry.name}</span>

              <span className={styles.legendPct}>
                {formatPercentage(entry.percentage, {
                  isRatio: false,
                })}
              </span>

              <span className={styles.legendValue}>
                {formatCurrency(entry.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
