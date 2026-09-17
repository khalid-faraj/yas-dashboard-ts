import { formatCurrency } from '../../utils/formatters';
import styles from './EmployeeTotalCard.module.css';

export interface EmployeeTotalCardProps {
  employeeName: string;
  total: number;
}

export default function EmployeeTotalCard({
  employeeName,
  total,
}: EmployeeTotalCardProps): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>👤</div>
      <div className={styles.body}>
        <div className={styles.name}>{employeeName}</div>
        <div className={styles.label}>إجمالي التحصيلات</div>
        <div className={styles.value}>
          {formatCurrency(total, { compact: false })}
        </div>
      </div>
    </div>
  );
}
