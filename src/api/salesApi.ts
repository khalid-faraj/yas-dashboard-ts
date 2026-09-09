import { httpClient } from "../services/httpClient";
import type {
  SalesApiPageParams,
  SalesApiResponse,
  SalesRecord,
  SalesReportParams,
} from "../types/api";

const SALES_ENDPOINT = "/api/v2/reports-accounts/product-sales/";

const APP_LABEL = "reports-accounts";
const MODEL_LABEL = "product-sales";

// MUST always include all three types.
const REQUIRED_TYPE_SALE_IN = "sale,return_sale,service_sale";

// Internal API page size.
// The user does not control this.
const PAGE_SIZE = 1000;

const MAX_PAGES_SAFETY_LIMIT = 500;

/**
 * Fetch one page from the sales API.
 */
async function fetchPage({
  transDateGte,
  transDateLte,
  page,
}: SalesApiPageParams): Promise<SalesApiResponse> {
  const response = await httpClient.get<SalesApiResponse>(SALES_ENDPOINT, {
    params: {
      app_label: APP_LABEL,
      model_label: MODEL_LABEL,

      page,
      page_size: PAGE_SIZE,

      // Correct API date filters
      trans_date_gte: transDateGte,
      trans_date_lte: transDateLte,

      // Always send all three sale types
      type_sale_in: REQUIRED_TYPE_SALE_IN,
    },
  });

  return response.data;
}

/**
 * Extract results from API response.
 */
function extractResults(payload: SalesApiResponse | undefined): SalesRecord[] {
  const results = payload?.data?.results;

  return Array.isArray(results) ? results : [];
}

/**
 * Determine whether more pages exist.
 */
function hasNextPage(
  payload: SalesApiResponse | undefined,
  currentPage: number,
  resultsLength: number,
): boolean {
  const data = payload?.data;

  if (!data) {
    return false;
  }

  // DRF-style pagination
  if (typeof data.next !== "undefined") {
    return Boolean(data.next);
  }

  // Count-based pagination
  if (typeof data.count === "number") {
    const seenSoFar = currentPage * PAGE_SIZE;

    return seenSoFar < data.count && resultsLength > 0;
  }

  // Fallback:
  // If we received a full page, there may be another page.
  return resultsLength === PAGE_SIZE;
}

/**
 * Fetch the complete sales report for a selected date/time range.
 */
export async function getSalesReport({
  transDateGte,
  transDateLte,
}: SalesReportParams): Promise<SalesRecord[]> {
  if (!transDateGte || !transDateLte) {
    throw new Error("transDateGte and transDateLte are required");
  }

  let page = 1;
  let allResults: SalesRecord[] = [];
  let safetyCounter = 0;

  // First page
  let payload = await fetchPage({ transDateGte, transDateLte, page });

  let pageResults = extractResults(payload);

  allResults = allResults.concat(pageResults);

  // Remaining pages
  while (
    hasNextPage(payload, page, pageResults.length) &&
    safetyCounter < MAX_PAGES_SAFETY_LIMIT
  ) {
    page += 1;
    safetyCounter += 1;

    // eslint-disable-next-line no-await-in-loop
    payload = await fetchPage({ transDateGte, transDateLte, page });

    pageResults = extractResults(payload);

    if (pageResults.length === 0) {
      break;
    }

    allResults = allResults.concat(pageResults);
  }

  return allResults;
}
