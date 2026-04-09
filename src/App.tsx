import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import HomePage from "./pages/HomePage";
import LoginLanding from "./pages/LandingPage";
import LoginPage from "./pages/admin/LoginPage";
import ForgotPasswordPage from "./pages/admin/ForgotPasswordPage";
import ResetPasswordPage from "./pages/admin/ResetPasswordPage";
import StoreLoginPage from "./pages/store/StoreLoginPage";
import AdminDashboard from "./pages/admin/Dashboard";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ItemManagement from "./pages/admin/ItemManagement";
import SupplierManagement from "./pages/admin/SupplierManagement";
import StoreManagement from "./pages/admin/StoreManagement";
import TaxManagement from "./pages/admin/TaxManagement";
import DiscountManagement from "./pages/admin/DiscountManagement";
import StockAlerts from "./pages/admin/StockAlerts";
import OnlineOrders from "./pages/admin/OnlineOrders";
import OfflineBills from "./pages/admin/OfflineBills";
import BillingInsights from "./pages/admin/BillingInsights";
import Vendors from "./pages/admin/Vendors";
import StockManagement from "./pages/admin/StockManagement";
import StoreDashboard from "./pages/store/Dashboard";
import ManualBillingPage from "./pages/store/ManualBillingPage";
import ItemAvailabilityPage from "./pages/store/ItemAvailabilityPage";
import OnlineOrdersPage from "./pages/store/OnlineOrdersPage";
import OfflineBillsPage from "./pages/store/OfflineBillsPage";
import NotFound from "./pages/NotFound";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import RootLayout from "@/layouts/RootLayout";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
}

function StoreRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["store_owner"]}>{children}</ProtectedRoute>
  );
}

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache(),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30,
            gcTime: 1000 * 60 * 60 * 24,
            retry: 2,
            refetchOnWindowFocus: true,
          },
        },
      }),
  );
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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/portal" element={<LoginLanding />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
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
              path="/admin/billing-insights"
              element={
                <AdminRoute>
                  <BillingInsights />
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
              path="/admin/discounts"
              element={
                <AdminRoute>
                  <DiscountManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/stock-alerts"
              element={
                <AdminRoute>
                  <StockAlerts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/out-of-stock"
              element={<Navigate to="/admin/stock-alerts" replace />}
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
      </QueryClientProvider>
      <SonnerToaster />
    </ErrorBoundary>
  );
}

export default App;
