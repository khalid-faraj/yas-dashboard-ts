import styles from './RankingList.module.css';

export interface RankingListItem {
  name: string;
  displayValue: string;
  percentOfTop: number;
}

export type RankingListAccent = 'primary' | 'danger';

export interface RankingListProps {
  title: string;
  items: RankingListItem[];
  emptyLabel?: string;
  accent?: RankingListAccent;
}

/**
 * Generic ranked list with a progress bar per row.
 */
export default function RankingList({
  title,
  items,
  emptyLabel = 'لا توجد بيانات',
  accent = 'primary',
}: RankingListProps): JSX.Element {
  return (
    <div className={styles.card}>
      <div className={styles.header}>{title}</div>

      {items.length === 0 ? (
        <div className={styles.empty}>{emptyLabel}</div>
      ) : (
        <ul className={styles.list}>
          {items.map((item, idx) => (
            <li key={item.name} className={styles.row}>
              <div className={styles.rank}>{idx + 1}</div>
              <div className={styles.rowBody}>
                <div className={styles.rowTop}>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.value}>{item.displayValue}</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${
                      accent === 'danger' ? styles.barFillDanger : ''
                    }`}
                    style={{ width: `${Math.max(item.percentOfTop, 3)}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
