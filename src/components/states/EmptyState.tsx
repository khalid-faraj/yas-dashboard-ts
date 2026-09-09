import styles from './StateCard.module.css';

export default function EmptyState(): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>📭</div>
      <div className={styles.title}>لا توجد بيانات مبيعات</div>
      <p className={styles.message}>
        لم يتم العثور على عمليات خلال الفترة المحددة.
        <br />
        جرّب اختيار فترة زمنية أخرى.
      </p>
    </div>
  );
}
