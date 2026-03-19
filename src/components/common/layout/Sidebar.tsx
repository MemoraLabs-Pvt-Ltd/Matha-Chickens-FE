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

interface SidebarProps {
  navItems: NavItem[];
  onLogout?: () => void;
  bgColor?: string;
}

export function Sidebar({
  navItems,
  onLogout,
  bgColor = "bg-white",
}: SidebarProps) {
  return (
    <aside className={cn(bgColor, "w-[256px] shrink-0 sticky top-0 h-screen border-r")}>
      <div className="border-b border-[rgba(0,0,0,0.1)] h-[121px] px-6 pt-6">
        <img src={LogoMetal} alt="Matha Chickens" className="h-12 w-[85px] rounded-lg" />
        <p className="text-xs text-[#525252] mt-4">Admin Portal</p>
      </div>

      <nav className="flex flex-col gap-1 px-4 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 h-10 pl-4 rounded-xl text-sm font-medium transition-colors",
                isActive || item.active
                  ? "bg-admin text-white"
                  : "text-black hover:bg-muted"
              )
            }
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-[256px] px-4 py-[17px] border-t border-[rgba(0,0,0,0.1)]">
        <Button
          variant="ghost"
          className="flex items-center gap-3 h-9 w-full text-sm font-medium text-black hover:bg-muted rounded-lg pl-3 justify-start"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
