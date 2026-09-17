import { formatCurrency } from '../../utils/formatters';
import styles from './CollectionsTotalCard.module.css';

export interface CollectionsTotalCardProps {
  label: string;
  total: number;
}

export default function CollectionsTotalCard({
  label,
  total,
}: CollectionsTotalCardProps): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>💰</div>
      <div className={styles.body}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>
          {formatCurrency(total, { compact: false })}
        </div>
      </div>
    </div>
  );
}
