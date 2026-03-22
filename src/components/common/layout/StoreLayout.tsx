import { StoreSidebar } from "@/components/common/layout/StoreSidebar";
import { UserProfileDropdown } from "@/components/common/layout/UserProfileDropdown";
import { Button } from "@/components/ui/button";
import { Watermark } from "@/components/ui/watermark";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { getDisplayForLoggedInUser } from "@/lib/display/authDisplay";
import {
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Receipt,
  ShoppingBag,
} from "lucide-react";
import type { IconType } from "react-icons";
import { useEffect, startTransition, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface StoreLayoutProps {
  title: string;
  storeName?: string;
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
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

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

  const fromAuth = getDisplayForLoggedInUser(user);
  const headerLoading = authLoading && !storeNameOverride;

  const storeName = storeNameOverride ?? fromAuth?.displayName ?? "Store";
  const headerSubtitle = headerSubtitleOverride ?? fromAuth?.roleLabel ?? "—";
  const avatarInitial = avatarInitialOverride ?? fromAuth?.avatarInitial ?? "?";
  const accountDisplayName = fromAuth?.displayName ?? user?.email ?? "User";
  const accountEmail = user?.email ?? "";
  const roleLabel = fromAuth?.roleLabel ?? "—";

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background-secondary">
      {mobileNavOpen && !isMdUp && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <StoreSidebar
        navItems={storeNavItems}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col min-h-screen overflow-y-auto">
        <header className="bg-card border-b border-border min-h-[85px] px-4 py-4 md:h-[85px] md:px-8 shrink-0 z-10">
          <div className="flex h-full items-center justify-between gap-2 sm:gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
                aria-label="Open menu"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="size-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-semibold leading-tight tracking-wide text-foreground sm:text-xl md:text-2xl">
                  <span className="sr-only sm:not-sr-only sm:mb-1 sm:block sm:text-xs sm:font-normal sm:text-muted-foreground sm:leading-normal">
                    Welcome back
                  </span>
                  <span className="block truncate">{title}</span>
                </h1>
              </div>
            </div>
            <UserProfileDropdown
              variant="store"
              headerPrimary={storeName}
              headerSecondary={headerSubtitle}
              accountName={accountDisplayName}
              accountEmail={accountEmail}
              roleLabel={roleLabel}
              avatarInitials={avatarInitial}
              isLoading={headerLoading}
              onLogout={handleLogout}
            />
          </div>
        </header>
        <div
          className={
            disableScroll
              ? "flex-1 p-4 overflow-hidden z-10 md:p-6"
              : "flex-1 p-4 overflow-auto z-10 md:p-6"
          }
        >
          {children}
          <Watermark />
        </div>
      </div>
    </div>
  );
}
