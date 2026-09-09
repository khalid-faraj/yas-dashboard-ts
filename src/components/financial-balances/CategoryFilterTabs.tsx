import styles from './CategoryFilterTabs.module.css';
import type { BalanceCategoryFilter } from '../../types/financialBalances';

export interface CategoryFilterTabsProps {
  active: BalanceCategoryFilter;
  onChange: (value: BalanceCategoryFilter) => void;
}

interface TabOption {
  value: BalanceCategoryFilter;
  label: string;
  icon: string;
}

// Order chosen so that, in this RTL layout, "الكل" renders on the far
// right and "المحافظ" renders on the far left — matching the reference design.
const TABS: TabOption[] = [
  { value: 'all', label: 'الكل', icon: '📇' },
  { value: 'treasury', label: 'الخزائن', icon: '🗄️' },
  { value: 'bank', label: 'البنوك', icon: '🏦' },
  { value: 'wallet', label: 'المحافظ', icon: '📱' },
];

export default function CategoryFilterTabs({
  active,
  onChange,
}: CategoryFilterTabsProps): JSX.Element {
  return (
    <div className={styles.row}>
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`${styles.tab} ${active === tab.value ? styles.tabActive : ''}`}
          onClick={() => onChange(tab.value)}
        >
          <span>{tab.label}</span>
          <span>{tab.icon}</span>
        </button>
      ))}
    </div>
  );
}
