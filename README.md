# لوحة تحكم المبيعات — Sales Dashboard

A production-ready, RTL Arabic sales analytics dashboard built with React + Vite. It fetches sales records for a selected date range from a backend reporting API and derives every metric on the client — no dashboard statistic is ever hardcoded.

## 1. Project Description

This dashboard answers the core questions a sales team needs at a glance: gross sales, returns, net sales, invoice count, best sellers, best customers, top products, category breakdown, return hotspots, and the sales trend over the selected period — all computed from real API data.

## 2. Features

- Arabic RTL interface using the Tajawal font
- Date-range reporting with quick presets (اليوم، أمس، آخر 7 أيام، آخر 30 يوم، هذا الشهر، الشهر الماضي) and a custom range
- Fetch-on-submit only — no requests fire on every keystroke
- Automatic internal pagination — the UI never exposes page size or page numbers
- Correct handling of returns: negative `count` values are treated as returns, never as positive sales
- Gross Sales / Returns / Net Sales reported as three distinct, clearly labeled metrics
- Unique invoice counting (not record counting)
- Top 5 sellers, top 5 customers, top 10 products, sales-by-category donut chart
- Dedicated returns analysis (top 5 customers and sellers by return value)
- Sales trend chart (gross, returns, net) built with Recharts
- Skeleton loading state, empty state, and error state with retry
- Fully responsive: desktop sidebar, tablet reflow, mobile drawer + stacked cards
- Centralized formatting utilities (currency, numbers, percentages, dates)
- Clean layered architecture: API service → data hooks → analytics utilities → presentational components

## 3. Tech Stack

- React 18
- Vite 5
- **TypeScript 5** (strict mode — see `tsconfig.app.json`)
- Axios
- Recharts
- React Router (HashRouter)
- Plain CSS Modules (no UI framework dependency)

## 4. Installation

```bash
npm install
```

## 5. Environment Variables

Create a `.env.local` file in the project root:

```env
# Base URL of the backend API
VITE_API_BASE_URL=https://yas.it.com

# API Access Token
VITE_ACCESS_TOKEN=

## 6. API Configuration

The dashboard talks to a single endpoint:

```
GET {VITE_API_BASE_URL}/api/v2/reports-accounts/product-sales/
```

Records are read from `response.data.data.results`, and the code in `src/api/salesApi.ts` reads this defensively (missing/null fields never crash the app).

### Mandatory parameter

**Every** request to this endpoint automatically includes:

```
type_sale_in=sale%2Creturn_sale%2Cservice_sale
```

(i.e. the raw value `sale,return_sale,service_sale`, URL-encoded by Axios). This is centralized in `src/api/salesApi.ts` and is **not** exposed as a configurable option anywhere in the UI or component tree — no component can accidentally omit or modify it.

### Internal pagination

If the backend paginates responses, `getSalesReport()` walks `page=1, 2, 3, …` automatically until all records for the selected date range have been retrieved. The user never sees or controls `page_size`.

## 7. Running Locally

```bash
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## 8. Production Build

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

The build output goes to `dist/`.

## 9. API Response Expectations

Each record may include (not all fields are guaranteed to be present):

```
s_price, count, invoice_pk, employee__name, client__name,
category_name, invoice_number, date_invoice, type_sale,
warehouse_name, container_code, description
```

The dashboard degrades gracefully when optional fields are missing or null — it never fabricates names, categories, or product identifiers.

## 10. Return Calculations Explained

For every record:

```
lineValue = s_price * count
```

- `count > 0` → a normal sale; contributes to **Gross Sales**.
- `count < 0` → a return; its absolute value contributes to **Returns**.

Example: `s_price = 6140, count = -1` → `lineValue = -6140` → this is a return of `6140`, displayed as a positive number in the Returns metric while the underlying signed value stays negative for calculation purposes.

```
grossSales = sum(lineValue where count > 0)
returns    = abs(sum(lineValue where count < 0))
netSales   = grossSales - returns   (equivalently: sum of all lineValue, signed)
```

Invoices are counted by unique `invoice_pk`, never by record count — a single invoice with 10 line items still counts as one invoice.

## 11. Explanation of `type_sale_in`

The backend distinguishes three transaction types:

- `sale` — a normal sale
- `return_sale` — a returned sale
- `service_sale` — a service-based sale

Omitting any of these three values from a request produces an **incomplete** dashboard (e.g. missing returns would make Net Sales look artificially high). For this reason, the parameter is hardcoded as a constant inside `src/api/salesApi.ts` and applied to every request automatically — it cannot be changed from the UI, and no other part of the codebase constructs sales-report requests directly.

## Project Structure

```
src/
  api/            → salesApi.ts (endpoint, mandatory params, pagination)
  services/        → httpClient.ts (Axios instance, auth-ready interceptors)
  hooks/           → useSalesReport.ts (fetch + memoized analytics)
  utils/           → analytics.ts, formatters.ts, dateRanges.ts
  types/            → api.ts, analytics.ts, sales.ts, common.ts, css-modules.d.ts
  components/
    layout/         → Sidebar, AppLayout, DashboardHeader
    filters/         → DateRangeFilter, MonthRangeFilter
    kpi/             → KpiCard, KpiGrid
    rankings/        → RankingList + TopSellers/TopCustomers/TopProducts/ReturnsCustomers/ReturnsSellers
    states/          → LoadingSkeleton, EmptyState, ErrorState
  charts/           → SalesTrendChart, SalesByCategory (donut), MonthlyNetSalesChart
  pages/            → SalesDashboardPage.tsx, MonthlySalesStatsPage.tsx
```

## TypeScript

The project is 100% TypeScript/TSX — no `.js`/`.jsx` remain under `src/`. Shared domain types live in `src/types/` and are reused across the API layer, the `useSalesReport` hook, the analytics utilities, and every chart/component that consumes them (no duplicated shape definitions, no `any`).

Validate at any time with:

```bash
npx tsc -b      # strict type-check, no emit
npm run build   # type-check + production bundle
npm run lint    # ESLint with @typescript-eslint
```

## Authentication

No token is wired in by default. `src/services/httpClient.ts` has a commented-out Axios request interceptor ready to activate the moment a token source (e.g. localStorage, an auth context) is introduced — no component-level changes will be needed.

## Notes on Mock Data

There is no mock-data mode included by default; the app always calls the real API. If you need one for local UI development, add a clearly separated file (e.g. `src/api/mockSalesData.ts`) and gate it behind an explicit environment flag — never let it run in production silently.
