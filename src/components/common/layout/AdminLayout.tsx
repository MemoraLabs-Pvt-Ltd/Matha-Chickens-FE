import { Header } from "@/components/common/layout/Header";
import { Sidebar } from "@/components/common/layout/Sidebar";
import { Watermark } from "@/components/ui/watermark";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { getDisplayForLoggedInUser } from "@/lib/display/authDisplay";
import {
  AlertTriangle,
  BarChart3,
  Box,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Handshake,
  Percent,
  Receipt,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { LuBox, LuLayoutDashboard, LuTag, LuTruck } from "react-icons/lu";
import { useEffect, startTransition, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  title: string;
  /** Override auth-derived display name in the header. */
  userName?: string;
  /** Override auth email line in the header. */
  userEmail?: string;
  children: React.ReactNode;
  bgColor?: string;
}

const adminNavItems = [
  { icon: LuLayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: TrendingUp, label: "Sales", href: "/admin/sales" },
  { icon: Handshake, label: "Partners", href: "/admin/partners" },
  { icon: ClipboardList, label: "Partner Sales", href: "/admin/partner-sales" },
  { icon: FileSpreadsheet, label: "Sales Report Import", href: "/admin/sales-reports" },
  { icon: LuTag, label: "Categories", href: "/admin/categories" },
  { icon: LuBox, label: "Items", href: "/admin/items" },
  { icon: LuTruck, label: "Suppliers", href: "/admin/suppliers" },
  { icon: Box, label: "Stock Management", href: "/admin/stocks" },
  { icon: Wallet, label: "Expenses", href: "/admin/expenses" },
  { icon: AlertTriangle, label: "Stock alerts", href: "/admin/stock-alerts" },
  { icon: Users, label: "Vendors", href: "/admin/vendors" },
  { icon: Store, label: "Stores", href: "/admin/stores" },
  { icon: BarChart3, label: "Billing insights", href: "/admin/billing-insights" },
  { icon: Receipt, label: "Taxes", href: "/admin/taxes" },
  { icon: Percent, label: "Discounts", href: "/admin/discounts" },
  { icon: ShoppingCart, label: "Online Orders", href: "/admin/orders" },
  { icon: FileText, label: "Offline Bills", href: "/admin/bills" },
];

export function AdminLayout({
  title,
  userName: userNameOverride,
  userEmail: userEmailOverride,
  children,
  bgColor = "bg-white",
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { collapsed: sidebarCollapsed, toggle: toggleSidebar } =
    useSidebarCollapsed("matha-admin-sidebar-collapsed");
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const fromAuth = getDisplayForLoggedInUser(user);

  const userName = userNameOverride ?? fromAuth?.displayName ?? "User";
  const userEmail = userEmailOverride ?? user?.email ?? "";
  const roleLabel = fromAuth?.roleLabel ?? "—";

  useEffect(() => {
    startTransition(() => {
      setMobileNavOpen(false);
    });
  }, [location.pathname, isMdUp]);

  useEffect(() => {
    if (mobileNavOpen && !isMdUp) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileNavOpen, isMdUp]);

  const handleLogout = async () => {
    await logout();
    navigate("/portal", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {mobileNavOpen && !isMdUp && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <Sidebar
        navItems={adminNavItems}
        onLogout={handleLogout}
        bgColor={bgColor}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col min-h-screen overflow-y-auto">
        <Header
          title={title}
          userName={userName}
          userEmail={userEmail}
          roleLabel={roleLabel}
          isLoading={authLoading && !userNameOverride}
          onLogout={handleLogout}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <div className="flex-1 overflow-auto z-10 p-4 md:p-8">{children}</div>
        <Watermark />
      </div>
    </div>
  );
}
