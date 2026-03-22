import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { UserProfileDropdown } from "./UserProfileDropdown";

interface HeaderProps {
  title: string;
  userName?: string;
  userEmail?: string;
  roleLabel: string;
  isLoading?: boolean;
  onLogout: () => void;
  /** When set, shows a menu control below `md` (admin layout mobile nav). */
  onMenuClick?: () => void;
}

export function Header({
  title,
  userName,
  userEmail,
  roleLabel,
  isLoading,
  onLogout,
  onMenuClick,
}: HeaderProps) {
  const displayName = userName ?? "User";
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  return (
    <header className="min-h-[85px] shrink-0 border-b border-[#e5e5e5] bg-white px-4 py-4 md:h-[85px] md:px-8 z-10">
      <div className="flex h-full items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {onMenuClick && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 md:hidden"
              aria-label="Open menu"
              onClick={onMenuClick}
            >
              <Menu className="size-5" />
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold leading-tight tracking-wide text-[#171717] sm:text-xl md:text-2xl">
              <span className="sr-only sm:not-sr-only sm:mb-1 sm:block sm:text-xs sm:font-normal sm:text-[#737373] sm:leading-normal">
                Welcome back
              </span>
              <span className="block truncate">{title}</span>
            </h1>
          </div>
        </div>
        <UserProfileDropdown
          variant="admin"
          headerPrimary={displayName}
          headerSecondary={userEmail || undefined}
          accountName={displayName}
          accountEmail={userEmail ?? ""}
          roleLabel={roleLabel}
          avatarInitials={initials}
          isLoading={isLoading}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
