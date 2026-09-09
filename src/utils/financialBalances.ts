import type {
  BalanceCategory,
  BalanceCategoryGroup,
  FinancialBalanceItem,
  FinancialBalancesSummary,
  SubAccountRecord,
} from '../types/financialBalances';

/**
 * These two sub-accounts are intentionally excluded from the whole page —
 * they don't belong to any of the three sections and are not counted in
 * any total (confirmed by the user):
 *
 * - خزنة عملات اجنبيه       (pk 450)
 * - خزينة المصروفات الفرعية (pk 115)
 */
const EXCLUDED_PKS = new Set<number>([450, 115]);

const CATEGORY_META: Record<
  BalanceCategory,
  { label: string; description: string; icon: string }
> = {
  treasury: {
    label: 'الخزائن',
    description: 'إدارة نقدية يومية للفروع',
    icon: '🗄️',
  },
  bank: {
    label: 'البنوك',
    description: 'حسابات جارية وتوفير بالعملات',
    icon: '🏦',
  },
  wallet: {
    label: 'المحافظ الإلكترونية',
    description: 'محافظ رقمية للتحصيل الفوري',
    icon: '📱',
  },
};

/**
 * Classifies a single sub-account into one of the three sections, or
 * `null` if it should be excluded from the page entirely.
 *
 * Order matters: "محفظة بنك مصر الياسين" contains the word "بنك" but must
 * be classified as a wallet, so the wallet check runs before the bank
 * fallback.
 */
function classify(record: SubAccountRecord): BalanceCategory | null {
  if (EXCLUDED_PKS.has(record.pk)) {
    return null;
  }

  const name = record.name;

  if (name.includes('محفظة')) {
    return 'wallet';
  }

  if (name.includes('خزينة') || name.includes('خزنة')) {
    return 'treasury';
  }

  // Everything else (all the "بنك" sub-accounts) is a bank account.
  return 'bank';
}

function buildGroup(
  category: BalanceCategory,
  items: FinancialBalanceItem[]
): BalanceCategoryGroup {
  const meta = CATEGORY_META[category];

  return {
    category,
    label: meta.label,
    description: meta.description,
    icon: meta.icon,
    items,
    count: items.length,
    total: items.reduce((sum, item) => sum + item.rest, 0),
  };
}

/**
 * Classifies every sub-account, groups them into the three sections, and
 * computes each section's subtotal plus the page-wide grand total.
 *
 * The grand total only ever sums what's actually shown in the three
 * sections — excluded sub-accounts never affect it.
 */
export function buildFinancialBalancesSummary(
  records: SubAccountRecord[]
): FinancialBalancesSummary {
  const treasuryItems: FinancialBalanceItem[] = [];
  const bankItems: FinancialBalanceItem[] = [];
  const walletItems: FinancialBalanceItem[] = [];

  for (const record of records) {
    const category = classify(record);

    if (category === null) {
      continue;
    }

    const item: FinancialBalanceItem = { ...record, category };

    if (category === 'treasury') {
      treasuryItems.push(item);
    } else if (category === 'bank') {
      bankItems.push(item);
    } else {
      walletItems.push(item);
    }
  }

  const treasury = buildGroup('treasury', treasuryItems);
  const bank = buildGroup('bank', bankItems);
  const wallet = buildGroup('wallet', walletItems);

  return {
    treasury,
    bank,
    wallet,
    grandTotal: treasury.total + bank.total + wallet.total,
  };
}
