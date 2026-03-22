import LogoMetal from "@/assets/LogoMetal.png";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import type { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface NavItem {
  icon: IconType;
  label: string;
  href: string;
  active?: boolean;
}

interface StoreSidebarProps {
  navItems: NavItem[];
  onLogout?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function StoreSidebar({
  navItems,
  onLogout,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
}: StoreSidebarProps) {
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const effectiveCollapsed = collapsed && isMdUp;

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-card transition-[transform,width] duration-200 ease-out",
        "h-screen min-h-0",
        isMdUp
          ? cn(
              "sticky top-0 translate-x-0",
              effectiveCollapsed ? "w-[72px]" : "w-[256px]",
            )
          : cn(
              "fixed inset-y-0 left-0 z-50 w-[min(256px,85vw)] max-w-[280px] shadow-xl",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            ),
      )}
    >
      <div className="relative shrink-0 border-b border-border px-3 pb-4 pt-4">
        {onToggleCollapse && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "absolute z-10 hidden h-8 w-8 text-muted-foreground hover:text-foreground md:flex",
              effectiveCollapsed ? "right-1 top-3" : "right-2 top-3",
            )}
            onClick={onToggleCollapse}
            aria-expanded={!effectiveCollapsed}
            aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {effectiveCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        )}
        <div
          className={cn(
            "flex items-center",
            effectiveCollapsed ? "justify-center pr-6" : "px-3",
          )}
        >
          <img
            src={LogoMetal}
            alt="Matha Chickens"
            className={cn(
              "rounded-lg",
              effectiveCollapsed ? "h-9 w-9 object-contain" : "h-12 w-[85px]",
            )}
          />
        </div>
        {!effectiveCollapsed && (
          <p className="mt-4 px-3 text-xs text-muted-foreground">Store Portal</p>
        )}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            title={effectiveCollapsed ? item.label : undefined}
            onClick={() => onMobileClose?.()}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center rounded-xl text-sm font-medium transition-colors",
                effectiveCollapsed ? "justify-center px-0" : "gap-3 pl-4",
                isActive || item.active
                  ? "bg-store text-white shadow-sm"
                  : "text-foreground hover:bg-muted",
              )
            }
          >
            <item.icon className="size-5 shrink-0" />
            {!effectiveCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-border px-2 py-[17px]">
        <Button
          type="button"
          variant="ghost"
          title={effectiveCollapsed ? "Logout" : undefined}
          className={cn(
            "h-9 w-full text-sm font-medium text-foreground hover:bg-muted",
            effectiveCollapsed ? "justify-center px-0" : "justify-start gap-3 pl-3",
          )}
          onClick={() => {
            onLogout?.();
            onMobileClose?.();
          }}
        >
          <LogOut className="size-4 shrink-0" />
          {!effectiveCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
