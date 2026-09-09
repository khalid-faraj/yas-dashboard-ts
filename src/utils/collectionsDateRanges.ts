import type { CollectionsDateRange } from '../types/employeeCollections';

function toApiDateOnlyString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * "آخر أسبوع" — the most recently *completed* Saturday→Friday week, not
 * the Saturday→Friday range that today happens to fall inside.
 *
 * Example: if today is Wednesday, this returns last Saturday through last
 * Friday (the week before the one we're currently in), matching the
 * confirmed business rule.
 */
export function getLastWeekRange(): CollectionsDateRange {
  const today = new Date();

  // JS getDay(): 0=Sun,1=Mon,...,6=Sat. Week starts on Saturday here.
  const dayOfWeek = today.getDay();
  const daysSinceThisWeekSaturday = (dayOfWeek - 6 + 7) % 7;

  const thisWeekSaturday = new Date(today);
  thisWeekSaturday.setDate(today.getDate() - daysSinceThisWeekSaturday);
  thisWeekSaturday.setHours(0, 0, 0, 0);

  const lastWeekSaturday = new Date(thisWeekSaturday);
  lastWeekSaturday.setDate(thisWeekSaturday.getDate() - 7);

  const lastWeekFriday = new Date(thisWeekSaturday);
  lastWeekFriday.setDate(thisWeekSaturday.getDate() - 1);

  return {
    fromDate: toApiDateOnlyString(lastWeekSaturday),
    toDate: toApiDateOnlyString(lastWeekFriday),
  };
}

/** "الشهر الحالي" — from the 1st of the current month through today. */
export function getCurrentMonthRange(): CollectionsDateRange {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    fromDate: toApiDateOnlyString(startOfMonth),
    toDate: toApiDateOnlyString(today),
  };
}
