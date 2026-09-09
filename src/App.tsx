import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import SalesDashboardPage from './pages/SalesDashboardPage';
import MonthlySalesStatsPage from './pages/MonthlySalesStatsPage';
import FinancialBalancesPage from './pages/FinancialBalancesPage';
import EmployeeCollectionsPage from './pages/EmployeeCollectionsPage';

export default function App(): JSX.Element {
  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/sales" replace />} />
          <Route path="/sales" element={<SalesDashboardPage />} />
          <Route path="/sales/monthly" element={<MonthlySalesStatsPage />} />
          <Route
            path="/financial-balances"
            element={<FinancialBalancesPage />}
          />
          <Route
            path="/employee-collections"
            element={<EmployeeCollectionsPage />}
          />
          <Route path="*" element={<Navigate to="/sales" replace />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
}
