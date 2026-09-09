import { formatCurrency } from '../../utils/formatters';
import BalanceCard from './BalanceCard';
import styles from './BalanceSection.module.css';
import type { BalanceCategoryGroup } from '../../types/financialBalances';

export interface BalanceSectionProps {
  group: BalanceCategoryGroup;
}

export default function BalanceSection({ group }: BalanceSectionProps): JSX.Element {
  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <div className={styles.headerMain}>
          <div className={`${styles.headerIcon} ${styles[`accent_${group.category}`]}`}>
            {group.icon}
          </div>

          <div className={styles.headerText}>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>{group.label}</h2>
              <span className={`${styles.countBadge} ${styles[`accent_${group.category}`]}`}>
                {group.count}
              </span>
            </div>
            <p className={styles.description}>{group.description}</p>
          </div>
        </div>

        <div className={styles.totalBadge}>
          <span className={styles.totalLabel}>الإجمالي</span>
          <span className={styles.totalValue}>
            {formatCurrency(group.total, { compact: false })}
          </span>
        </div>
      </div>

      {group.items.length === 0 ? (
        <div className={styles.empty}>لا توجد حسابات في هذا القسم</div>
      ) : (
        <div className={styles.grid}>
          {group.items.map((item) => (
            <BalanceCard key={item.pk} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
