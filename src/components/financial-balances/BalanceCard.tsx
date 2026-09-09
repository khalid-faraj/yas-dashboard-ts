import { formatCurrency } from '../../utils/formatters';
import styles from './BalanceCard.module.css';
import type { FinancialBalanceItem } from '../../types/financialBalances';

export interface BalanceCardProps {
  item: FinancialBalanceItem;
}

function getInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed[0] : '؟';
}

export default function BalanceCard({ item }: BalanceCardProps): JSX.Element {
  const isNegative = item.rest < 0;

  return (
    <div className={`${styles.card} ${styles[`accent_${item.category}`]}`}>
      <div className={styles.top}>
        <div className={styles.name}>{item.name.trim()}</div>
        <div className={`${styles.avatar} ${styles[`avatar_${item.category}`]}`}>
          {getInitial(item.name)}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.balanceLabel}>الرصيد الحالي</div>
        <div className={`${styles.balanceValue} ${isNegative ? styles.negative : ''}`}>
          {formatCurrency(item.rest, { compact: false })}
        </div>
      </div>
    </div>
  );
}
