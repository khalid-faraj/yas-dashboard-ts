import type { ReactNode } from 'react';
import { formatCurrency } from '../../utils/formatters';
import styles from './CollectionsSection.module.css';

export interface CollectionsSectionProps {
  title: string;
  icon: string;
  totalLabel?: string;
  total?: number;
  children: ReactNode;
}

export default function CollectionsSection({
  title,
  icon,
  totalLabel,
  total,
  children,
}: CollectionsSectionProps): JSX.Element {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>{icon}</div>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {totalLabel !== undefined && total !== undefined && (
        <div className={styles.totalCard}>
          <span className={styles.totalLabel}>{totalLabel}</span>
          <span className={styles.totalValue}>
            {formatCurrency(total, { compact: false })}
          </span>
        </div>
      )}

      <div className={styles.chartCard}>{children}</div>
    </section>
  );
}