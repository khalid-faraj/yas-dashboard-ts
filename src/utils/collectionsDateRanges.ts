import type {
  CollectionsDateTimeInputs,
  ResolvedDateTimeRange,
} from '../types/employeeCollections';

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

/** `<input type="datetime-local">` value format: `YYYY-MM-DDTHH:mm`. */
function toDateTimeLocalString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/** API format: `YYYY-MM-DD HH:MM:SS` (space-separated, not ISO). */
function toApiDateTimeString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/** "اليوم" — today, 00:00:00 through 23:59:59. */
export function getTodayRange(): ResolvedDateTimeRange {
  const now = new Date();
  return { from: startOfDay(now), to: endOfDay(now) };
}

/** "أمس" — yesterday, 00:00:00 through 23:59:59. */
export function getYesterdayRange(): ResolvedDateTimeRange {
  const yesterday = addDays(new Date(), -1);
  return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
}

/**
 * "آخر أسبوع" — the most recently *completed* Saturday→Friday week, not
 * the Saturday→Friday range that today happens to fall inside.
 */
export function getLastWeekRange(): ResolvedDateTimeRange {
  const today = new Date();

  // JS getDay(): 0=Sun,1=Mon,...,6=Sat. Week starts on Saturday here.
  const dayOfWeek = today.getDay();
  const daysSinceThisWeekSaturday = (dayOfWeek - 6 + 7) % 7;

  const thisWeekSaturday = addDays(startOfDay(today), -daysSinceThisWeekSaturday);
  const lastWeekSaturday = addDays(thisWeekSaturday, -7);
  const lastWeekFriday = addDays(thisWeekSaturday, -1);

  return {
    from: startOfDay(lastWeekSaturday),
    to: endOfDay(lastWeekFriday),
  };
}

/** "الشهر الحالي" — from the 1st of the current month through right now. */
export function getCurrentMonthRange(): ResolvedDateTimeRange {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  return { from: startOfMonth, to: endOfDay(now) };
}

/** For displaying a resolved range in the (disabled, read-only) datetime inputs. */
export function formatRangeForInputs(
  range: ResolvedDateTimeRange
): CollectionsDateTimeInputs {
  return {
    fromDateTime: toDateTimeLocalString(range.from),
    toDateTime: toDateTimeLocalString(range.to),
  };
}

/** For sending a resolved range to the API. */
export function formatRangeForApi(range: ResolvedDateTimeRange): {
  fromDate: string;
  toDate: string;
} {
  return {
    fromDate: toApiDateTimeString(range.from),
    toDate: toApiDateTimeString(range.to),
  };
}

/**
 * Converts a raw `<input type="datetime-local">` value (e.g.
 * `2026-09-08T14:30`, no seconds) into the API's `YYYY-MM-DD HH:MM:SS`
 * format.
 */
export function toApiDateTimeFromInputValue(value: string): string {
  const date = new Date(value);
  return toApiDateTimeString(date);
}
