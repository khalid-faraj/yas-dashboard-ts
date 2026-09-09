import styles from '../states/StateCard.module.css';

export interface FinancialBalancesErrorStateProps {
  onRetry: () => void;
}

export default function FinancialBalancesErrorState({
  onRetry,
}: FinancialBalancesErrorStateProps): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={`${styles.icon} ${styles.iconDanger}`}>⚠️</div>
      <div className={styles.title}>حدث خطأ أثناء تحميل الأرصدة المالية</div>
      <p className={styles.message}>
        يرجى التحقق من الاتصال أو المحاولة مرة أخرى.
      </p>
      <button type="button" className={styles.retryBtn} onClick={onRetry}>
        إعادة المحاولة
      </button>
    </div>
  );
}
