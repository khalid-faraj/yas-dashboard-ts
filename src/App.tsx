import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import SalesDashboardPage from "./pages/SalesDashboardPage";
import MonthlySalesStatsPage from "./pages/MonthlySalesStatsPage";
import FinancialBalancesPage from "./pages/FinancialBalancesPage";
import EmployeeCollectionsPage from "./pages/EmployeeCollectionsPage";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route
            path="/cpanel/dashboard"
            element={<Navigate to="/cpanel/dashboard/sales" replace />}
          />
          <Route
            path="/cpanel/dashboard/sales"
            element={<SalesDashboardPage />}
          />
          <Route
            path="/cpanel/dashboard/sales/monthly"
            element={<MonthlySalesStatsPage />}
          />
          <Route
            path="/cpanel/dashboard/financial-balances"
            element={<FinancialBalancesPage />}
          />
          <Route
            path="/cpanel/dashboard/employee-collections"
            element={<EmployeeCollectionsPage />}
          />
          <Route
            path="*"
            element={<Navigate to="/cpanel/dashboard/sales" replace />}
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
