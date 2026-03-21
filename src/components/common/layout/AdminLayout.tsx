import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard, LuTag, LuBox, LuTruck } from "react-icons/lu";
import {
  Store,
  Receipt,
  ShoppingCart,
  FileText,
  Users,
  Box,
  Percent,
  AlertTriangle,
} from "lucide-react";
import { Sidebar } from "@/components/common/layout/Sidebar";
import { Header } from "@/components/common/layout/Header";
import { Watermark } from "@/components/ui/watermark";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  title: string;
  userName?: string;
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
  { icon: AlertTriangle, label: "Out of Stock Alerts", href: "/admin/out-of-stock" },
  { icon: Users, label: "Vendors", href: "/admin/vendors" },
  { icon: Store, label: "Stores", href: "/admin/stores" },
  { icon: Receipt, label: "Taxes", href: "/admin/taxes" },
  { icon: Percent, label: "Discounts", href: "/admin/discounts" },
  { icon: ShoppingCart, label: "Online Orders", href: "/admin/orders" },
  { icon: FileText, label: "Offline Bills", href: "/admin/bills" },
];

export function AdminLayout({
  title,
  userName = "Admin User",
  userEmail = "admin@mathachickens.com",
  children,
  bgColor = "bg-white",
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar navItems={adminNavItems} onLogout={handleLogout} bgColor={bgColor} />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <Header title={title} userName={userName} userEmail={userEmail} />
        <div className="flex-1 p-8 overflow-auto z-10">{children}</div>
        <Watermark />
      </div>
    </div>
  );
}
