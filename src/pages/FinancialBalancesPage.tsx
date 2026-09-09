import { useMemo, useState } from 'react';

import DashboardHeader from '../components/layout/DashboardHeader';
import SummaryCard from '../components/financial-balances/SummaryCard';
import CategoryFilterTabs from '../components/financial-balances/CategoryFilterTabs';
import BalanceSection from '../components/financial-balances/BalanceSection';
import FinancialBalancesLoadingSkeleton from '../components/financial-balances/FinancialBalancesLoadingSkeleton';
import FinancialBalancesEmptyState from '../components/financial-balances/FinancialBalancesEmptyState';
import FinancialBalancesErrorState from '../components/financial-balances/FinancialBalancesErrorState';

import { useFinancialBalances } from '../hooks/useFinancialBalances';
import type { BalanceCategoryFilter } from '../types/financialBalances';

import styles from './FinancialBalancesPage.module.css';

/** Share of the grand total this category represents, 0–100. */
function proportionOf(categoryTotal: number, grandTotal: number): number {
  return grandTotal > 0 ? (categoryTotal / grandTotal) * 100 : 0;
}

export default function FinancialBalancesPage(): JSX.Element {
  const { isLoading, isError, isEmpty, hasData, summary, retry } =
    useFinancialBalances();

  const [activeFilter, setActiveFilter] = useState<BalanceCategoryFilter>('all');

  const totalAccountsCount = useMemo(
    () => summary.treasury.count + summary.bank.count + summary.wallet.count,
    [summary]
  );

  const visibleGroups = useMemo(() => {
    const groups = [summary.treasury, summary.bank, summary.wallet];

    if (activeFilter === 'all') {
      return groups;
    }

    return groups.filter((group) => group.category === activeFilter);
  }, [summary, activeFilter]);

  return (
    <div>
      <DashboardHeader
        title="الأرصدة المالية"
        subtitle="نظرة عامة على أرصدة الخزائن والبنوك والمحافظ الإلكترونية"
      />

      {isLoading && <FinancialBalancesLoadingSkeleton />}

      {!isLoading && isError && (
        <FinancialBalancesErrorState onRetry={retry} />
      )}

      {!isLoading && !isError && isEmpty && <FinancialBalancesEmptyState />}

      {!isLoading && !isError && hasData && (
        <>
          {/* Top summary row: total (right) → treasury → bank → wallet (left) */}
          <div className={styles.summaryGrid}>
            <SummaryCard
              tone="total"
              icon="💳"
              title="إجمالي السيولة"
              value={summary.grandTotal}
              badge={`${totalAccountsCount} حساب`}
            />

            <SummaryCard
              tone="treasury"
              icon={summary.treasury.icon}
              title={summary.treasury.label}
              value={summary.treasury.total}
              badge={`${summary.treasury.count} حسابات`}
              proportion={proportionOf(summary.treasury.total, summary.grandTotal)}
            />

            <SummaryCard
              tone="bank"
              icon={summary.bank.icon}
              title={summary.bank.label}
              value={summary.bank.total}
              badge={`${summary.bank.count} حسابات`}
              proportion={proportionOf(summary.bank.total, summary.grandTotal)}
            />

            <SummaryCard
              tone="wallet"
              icon={summary.wallet.icon}
              title={summary.wallet.label}
              value={summary.wallet.total}
              badge={`${summary.wallet.count} حسابات`}
              proportion={proportionOf(summary.wallet.total, summary.grandTotal)}
            />
          </div>

          <CategoryFilterTabs active={activeFilter} onChange={setActiveFilter} />

          {visibleGroups.map((group) => (
            <BalanceSection key={group.category} group={group} />
          ))}
        </>
      )}
    </div>
  );
}
