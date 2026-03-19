import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import LoginLanding from './pages/LandingPage';
import LoginPage from './pages/admin/LoginPage';
import ForgotPasswordPage from './pages/admin/ForgotPasswordPage';
// import ResetPasswordPage from './pages/admin/ResetPasswordPage';
import StoreLoginPage from './pages/store/StoreLoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import CategoryManagement from './pages/admin/CategoryManagement';
import ItemManagement from './pages/admin/ItemManagement';
import SupplierManagement from './pages/admin/SupplierManagement';
import StoreManagement from './pages/admin/StoreManagement';
import TaxManagement from './pages/admin/TaxManagement';
import OnlineOrders from './pages/admin/OnlineOrders';
import OfflineBills from './pages/admin/OfflineBills';
import Vendors from './pages/admin/Vendors';
import StockManagement from './pages/admin/StockManagement';
import StoreDashboard from './pages/store/Dashboard';
import ManualBillingPage from './pages/store/ManualBillingPage';
import ItemAvailabilityPage from './pages/store/ItemAvailabilityPage';
import OnlineOrdersPage from './pages/store/OnlineOrdersPage';
import OfflineBillsPage from './pages/store/OfflineBillsPage';
import NotFound from './pages/NotFound';
import UnauthorizedPage from './pages/UnauthorizedPage';
import RootLayout from '@/layouts/RootLayout';

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>
  );
}

function StoreRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['store_owner']}>{children}</ProtectedRoute>
  );
}

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<LoginLanding />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
            <Route path="/store/login" element={<StoreLoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <CategoryManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/items"
            element={
              <AdminRoute>
                <ItemManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/suppliers"
            element={
              <AdminRoute>
                <SupplierManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <AdminRoute>
                <StoreManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/taxes"
            element={
              <AdminRoute>
                <TaxManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OnlineOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bills"
            element={
              <AdminRoute>
                <OfflineBills />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <AdminRoute>
                <Vendors />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/stocks"
            element={
              <AdminRoute>
                <StockManagement />
              </AdminRoute>
            }
          />

          <Route
            path="/store/dashboard"
            element={
              <StoreRoute>
                <StoreDashboard />
              </StoreRoute>
            }
          />
          <Route
            path="/store/billing"
            element={
              <StoreRoute>
                <ManualBillingPage />
              </StoreRoute>
            }
          />
          <Route
            path="/store/items"
            element={
              <StoreRoute>
                <ItemAvailabilityPage />
              </StoreRoute>
            }
          />
          <Route
            path="/store/orders"
            element={
              <StoreRoute>
                <OnlineOrdersPage />
              </StoreRoute>
            }
          />
          <Route
            path="/store/bills"
            element={
              <StoreRoute>
                <OfflineBillsPage />
              </StoreRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
