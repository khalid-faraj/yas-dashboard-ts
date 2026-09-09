import styles from './CollectionsLoadingSkeleton.module.css';

export default function CollectionsLoadingSkeleton(): JSX.Element {
  return (
    <div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className={styles.section}>
          <div className={`skeleton ${styles.headerLine}`} />
          <div className={`skeleton ${styles.totalCard}`} />
          <div className={`skeleton ${styles.chart}`} />
        </div>
      ))}
    </div>
  );
}
