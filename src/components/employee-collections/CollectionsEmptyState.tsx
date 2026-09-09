import styles from '../states/StateCard.module.css';

export default function CollectionsEmptyState(): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>💵</div>
      <div className={styles.title}>لا توجد تحصيلات في هذه الفترة</div>
      <p className={styles.message}>جرّب اختيار فترة زمنية أخرى.</p>
    </div>
  );
}
