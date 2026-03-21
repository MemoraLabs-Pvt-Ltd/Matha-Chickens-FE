import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import { LayoutDashboard, Receipt, Package, ShoppingBag, FileText } from "lucide-react";
import { StoreSidebar } from "@/components/common/layout/StoreSidebar";
import { Watermark } from "@/components/ui/watermark";
import { useAuth } from "@/hooks/useAuth";

interface StoreLayoutProps {
  title: string;
  storeName?: string;
  storeStatus?: "Active" | "Inactive";
  avatarInitial?: string;
  disableScroll?: boolean;
  children: React.ReactNode;
}

const storeNavItems: { icon: IconType; label: string; href: string }[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/store/dashboard" },
  { icon: Receipt, label: "Manual Billing", href: "/store/billing" },
  { icon: Package, label: "Item Availability", href: "/store/items" },
  { icon: ShoppingBag, label: "Online Orders", href: "/store/orders" },
  { icon: FileText, label: "Offline Bills", href: "/store/bills" },
];

export function StoreLayout({
  title,
  storeName = "Matha Chickens - MG Road",
  storeStatus = "Active",
  avatarInitial = "S",
  disableScroll = false,
  children,
}: StoreLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background-secondary">
      <StoreSidebar
        navItems={storeNavItems}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="bg-card border-b border-border h-[85px] px-8 py-4 shrink-0 z-10">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Welcome back</p>
              <h1 className="text-2xl font-semibold text-foreground tracking-wide">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {storeName}
                </p>
                <p className="text-xs text-[#00a63e]">
                  ● {storeStatus}
                </p>
              </div>
              <div className="bg-store rounded-full size-10 flex items-center justify-center">
                <span className="text-base font-semibold text-white">
                  {avatarInitial}
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className={disableScroll ? "flex-1 p-6 overflow-hidden z-10" : "flex-1 p-6 overflow-auto z-10"}>
          {children}
          <Watermark />
        </div>
      </div>
    </div>
  );
}
