import styles from '../states/StateCard.module.css';

export default function FinancialBalancesEmptyState(): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>💳</div>
      <div className={styles.title}>لا توجد حسابات مالية</div>
      <p className={styles.message}>لم يتم العثور على أي خزائن أو بنوك أو محافظ.</p>
    </div>
  );
}
