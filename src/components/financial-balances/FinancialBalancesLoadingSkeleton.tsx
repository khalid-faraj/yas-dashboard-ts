import styles from './FinancialBalancesLoadingSkeleton.module.css';

export default function FinancialBalancesLoadingSkeleton(): JSX.Element {
  return (
    <div>
      <div className={styles.summaryGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`skeleton ${styles.summaryCard}`} />
        ))}
      </div>

      <div className={styles.tabsRow}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`skeleton ${styles.tab}`} />
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={styles.section}>
          <div className={`skeleton ${styles.sectionHeader}`} />
          <div className={styles.cardsRow}>
            <div className={`skeleton ${styles.card}`} />
            <div className={`skeleton ${styles.card}`} />
            <div className={`skeleton ${styles.card}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
