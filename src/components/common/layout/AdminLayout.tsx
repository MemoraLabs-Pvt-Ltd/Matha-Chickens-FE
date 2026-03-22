import { Header } from "@/components/common/layout/Header";
import { Sidebar } from "@/components/common/layout/Sidebar";
import { Watermark } from "@/components/ui/watermark";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { getDisplayForLoggedInUser } from "@/lib/display/authDisplay";
import {
  AlertTriangle,
  Box,
  FileText,
  Percent,
  Receipt,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { LuBox, LuLayoutDashboard, LuTag, LuTruck } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

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
  { icon: LuTag, label: "Categories", href: "/admin/categories" },
  { icon: LuBox, label: "Items", href: "/admin/items" },
  { icon: LuTruck, label: "Suppliers", href: "/admin/suppliers" },
  { icon: Box, label: "Stock Management", href: "/admin/stocks" },
  { icon: AlertTriangle, label: "Stock alerts", href: "/admin/stock-alerts" },
  { icon: Users, label: "Vendors", href: "/admin/vendors" },
  { icon: Store, label: "Stores", href: "/admin/stores" },
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
  const { user, logout, isLoading: authLoading } = useAuth();
  const { collapsed: sidebarCollapsed, toggle: toggleSidebar } =
    useSidebarCollapsed("matha-admin-sidebar-collapsed");
  const fromAuth = getDisplayForLoggedInUser(user);

  const userName = userNameOverride ?? fromAuth?.displayName ?? "User";
  const userEmail = userEmailOverride ?? user?.email ?? "";
  const roleLabel = fromAuth?.roleLabel ?? "—";

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        navItems={adminNavItems}
        onLogout={handleLogout}
        bgColor={bgColor}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <Header
          title={title}
          userName={userName}
          userEmail={userEmail}
          roleLabel={roleLabel}
          isLoading={authLoading && !userNameOverride}
          onLogout={handleLogout}
        />
        <div className="flex-1 p-8 overflow-auto z-10">{children}</div>
        <Watermark />
      </div>
    </div>
  );
}
