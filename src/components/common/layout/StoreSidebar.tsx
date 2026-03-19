import { NavLink } from "react-router-dom";
import type { IconType } from "react-icons";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LogoMetal from "@/assets/LogoMetal.png";

interface NavItem {
  icon: IconType;
  label: string;
  href: string;
  active?: boolean;
}

interface StoreSidebarProps {
  navItems: NavItem[];
  onLogout?: () => void;
}

export function StoreSidebar({
  navItems,
  onLogout,
}: StoreSidebarProps) {
  return (
    <aside className="w-[256px] shrink-0 sticky top-0 h-screen bg-card border-r border-border">
      <div className="border-b border-border h-[121px] px-6 pt-6">
        <img src={LogoMetal} alt="Matha Chickens" className="h-12 w-[85px] rounded-lg" />
        <p className="text-xs text-muted-foreground mt-4">Store Portal</p>
      </div>

      <nav className="flex flex-col gap-1 p-5">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 h-10 pl-4 rounded-xl text-sm font-medium transition-colors",
                isActive || item.active
                  ? "bg-store text-white shadow-sm"
                  : "text-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-[256px] px-4 py-[17px] border-t border-border">
        <Button
          variant="ghost"
          className="flex items-center gap-3 h-9 w-full text-sm font-medium text-foreground hover:bg-muted rounded-lg pl-3 justify-start"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
