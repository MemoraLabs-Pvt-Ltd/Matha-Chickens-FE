import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import LoginLanding from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/Dashboard";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ItemManagement from "./pages/admin/ItemManagement";
import SupplierManagement from "./pages/admin/SupplierManagement";
import StoreManagement from "./pages/admin/StoreManagement";
import TaxManagement from "./pages/admin/TaxManagement";
import OnlineOrders from "./pages/admin/OnlineOrders";
import OfflineBills from "./pages/admin/OfflineBills";
import Vendors from "./pages/admin/Vendors";
import NotFound from "./pages/NotFound";
import RootLayout from "@/layouts/RootLayout";

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<LoginLanding />} />
            <Route path="/admin/login" element={<LoginPage />} />
          </Route>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/items" element={<ItemManagement />} />
          <Route path="/admin/suppliers" element={<SupplierManagement />} />
          <Route path="/admin/stores" element={<StoreManagement />} />
          <Route path="/admin/taxes" element={<TaxManagement />} />
          <Route path="/admin/orders" element={<OnlineOrders />} />
          <Route path="/admin/bills" element={<OfflineBills />} />
          <Route path="/admin/vendors" element={<Vendors />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
