import { NavLink } from "react-router-dom";
import type { IconType } from "react-icons";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LogoMetal from "@/assets/LogoMetal.png";

interface NavItem {
  icon: IconType;
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarProps {
  navItems: NavItem[];
  onLogout?: () => void;
  bgColor?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  navItems,
  onLogout,
  bgColor = "bg-white",
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        bgColor,
        "relative flex shrink-0 flex-col border-r transition-[width] duration-200 ease-out",
        "sticky top-0 h-screen min-h-0",
        collapsed ? "w-[72px]" : "w-[256px]",
      )}
    >
      <div className="relative shrink-0 border-b border-[rgba(0,0,0,0.1)] px-3 pb-4 pt-4">
        {onToggleCollapse && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "absolute z-10 h-8 w-8 text-muted-foreground hover:text-foreground",
              collapsed ? "right-1 top-3" : "right-2 top-3",
            )}
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        )}
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center pr-6" : "px-3",
          )}
        >
          <img
            src={LogoMetal}
            alt="Matha Chickens"
            className={cn(
              "rounded-lg",
              collapsed ? "h-9 w-9 object-contain" : "h-12 w-[85px]",
            )}
          />
        </div>
        {!collapsed && (
          <p className="mt-4 px-3 text-xs text-[#525252]">Admin Portal</p>
        )}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center rounded-xl text-sm font-medium transition-colors",
                collapsed ? "justify-center px-0" : "gap-3 pl-4",
                isActive || item.active
                  ? "bg-admin text-white"
                  : "text-black hover:bg-muted",
              )
            }
          >
            <item.icon className="size-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-[rgba(0,0,0,0.1)] px-2 py-[17px]">
        <Button
          type="button"
          variant="ghost"
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "h-9 w-full text-sm font-medium text-black hover:bg-muted",
            collapsed ? "justify-center px-0" : "justify-start gap-3 pl-3",
          )}
          onClick={onLogout}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
