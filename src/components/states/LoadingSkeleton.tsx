import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton(): JSX.Element {
  return (
    <div>
      <div className={styles.kpiGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`skeleton ${styles.kpiCard}`} />
        ))}
      </div>

      <div className={styles.rankingsGrid}>
        <div className={`skeleton ${styles.panel}`} />
        <div className={`skeleton ${styles.panel}`} />
      </div>

      <div className={`skeleton ${styles.wideChart}`} />

      <div className={styles.rankingsGrid}>
        <div className={`skeleton ${styles.panel}`} />
        <div className={`skeleton ${styles.panel}`} />
      </div>
    </div>
  );
}
