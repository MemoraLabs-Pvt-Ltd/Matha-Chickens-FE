import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import { LayoutDashboard, Receipt, Package, ShoppingBag, FileText } from "lucide-react";
import { StoreSidebar } from "@/components/common/layout/StoreSidebar";
import { Watermark } from "@/components/ui/watermark";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getDisplayForLoggedInUser } from "@/lib/display/authDisplay";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

interface StoreLayoutProps {
  title: string;
  /** Overrides auth-derived display name in the header. */
  storeName?: string;
  /** Overrides auth-derived subtitle (default: role label, e.g. Store owner). */
  headerSubtitle?: string;
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
  storeName: storeNameOverride,
  headerSubtitle: headerSubtitleOverride,
  avatarInitial: avatarInitialOverride,
  disableScroll = false,
  children,
}: StoreLayoutProps) {
  const navigate = useNavigate();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { collapsed: sidebarCollapsed, toggle: toggleSidebar } =
    useSidebarCollapsed("matha-store-sidebar-collapsed");

  const fromAuth = getDisplayForLoggedInUser(user);
  const headerLoading = authLoading && !storeNameOverride;

  const storeName = storeNameOverride ?? fromAuth?.displayName ?? "Store";
  const headerSubtitle =
    headerSubtitleOverride ?? fromAuth?.roleLabel ?? "—";
  const avatarInitial =
    avatarInitialOverride ?? fromAuth?.avatarInitial ?? "?";

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background-secondary">
      <StoreSidebar
        navItems={storeNavItems}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
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
              <div className="text-right min-w-[120px]">
                {headerLoading ? (
                  <>
                    <Skeleton className="h-4 w-40 ml-auto mb-2 rounded-md" />
                    <Skeleton className="h-3 w-16 ml-auto rounded-md" />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">
                      {storeName}
                    </p>
                    <p className="text-xs text-[#00a63e]">
                      ● {headerSubtitle}
                    </p>
                  </>
                )}
              </div>
              <div className="bg-store rounded-full size-10 flex items-center justify-center shrink-0">
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
