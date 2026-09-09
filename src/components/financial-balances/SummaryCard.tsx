import { formatCurrency } from '../../utils/formatters';
import styles from './SummaryCard.module.css';
import type { BalanceCategory } from '../../types/financialBalances';

export type SummaryCardTone = BalanceCategory | 'total';

export interface SummaryCardProps {
  tone: SummaryCardTone;
  icon: string;
  title: string;
  value: number;
  /** Shown as a small pill in the top corner, e.g. "3 حسابات". */
  badge: string;
  /**
   * 0–100. Only used for category cards: renders a thin accent bar whose
   * width reflects this category's share of the grand total.
   */
  proportion?: number;
}

export default function SummaryCard({
  tone,
  icon,
  title,
  value,
  badge,
  proportion,
}: SummaryCardProps): JSX.Element {
  const isTotal = tone === 'total';

  return (
    <div className={`${styles.card} ${styles[`tone_${tone}`]}`}>
      <div className={styles.topRow}>
        <span className={styles.iconWrap}>{icon}</span>
        <span className={styles.badge}>{badge}</span>
      </div>

      <div className={styles.title}>{title}</div>
      <div className={styles.value}>{formatCurrency(value, { compact: false })}</div>

      {isTotal ? (
        <div className={styles.status}>
          <span className={styles.statusDot} />
          محدث الآن
        </div>
      ) : (
        <div className={styles.barTrack}>
          <div
            className={`${styles.barFill} ${styles[`bar_${tone}`]}`}
            style={{ width: `${Math.max(proportion ?? 0, 3)}%` }}
          />
        </div>
      )}
    </div>
  );
}
