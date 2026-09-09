import styles from './StateCard.module.css';

export interface ErrorStateProps {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={`${styles.icon} ${styles.iconDanger}`}>⚠️</div>
      <div className={styles.title}>حدث خطأ أثناء تحميل بيانات المبيعات</div>
      <p className={styles.message}>
        يرجى التحقق من الاتصال أو المحاولة مرة أخرى.
      </p>
      <button type="button" className={styles.retryBtn} onClick={onRetry}>
        إعادة المحاولة
      </button>
    </div>
  );
}
