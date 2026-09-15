import styles from './RankingList.module.css';
import { useIsMobile } from '../../hooks/useIsMobile';
import { truncateText } from '../../utils/formatters';

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

// On small screens, cap the name at this many characters regardless of
// what the CSS ellipsis manages to do — a guaranteed, layout-independent
// safety net so a long name can never push the card off-screen.
const MOBILE_NAME_MAX_LENGTH = 26;

/**
 * Generic ranked list with a progress bar per row.
 */
export default function RankingList({
  title,
  items,
  emptyLabel = 'لا توجد بيانات',
  accent = 'primary',
}: RankingListProps): JSX.Element {
  const isMobile = useIsMobile();

  return (
    <div className={styles.card}>
      <div className={styles.header}>{title}</div>

      {items.length === 0 ? (
        <div className={styles.empty}>{emptyLabel}</div>
      ) : (
        <ul className={styles.list}>
          {items.map((item, idx) => {
            const displayName = isMobile
              ? truncateText(item.name, MOBILE_NAME_MAX_LENGTH)
              : item.name;

            return (
              <li key={`${item.name}-${idx}`} className={styles.row}>
                <div className={styles.rank}>{idx + 1}</div>
                <div className={styles.rowBody}>
                  <div className={styles.rowTop}>
                    <span className={styles.name} title={item.name}>
                      {displayName}
                    </span>
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
            );
          })}
        </ul>
      )}
    </div>
  );
}
