import { UserProfileDropdown } from "./UserProfileDropdown";

interface HeaderProps {
  title: string;
  userName?: string;
  userEmail?: string;
  roleLabel: string;
  isLoading?: boolean;
  onLogout: () => void;
}

export function Header({
  title,
  userName,
  userEmail,
  roleLabel,
  isLoading,
  onLogout,
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
    <header className="h-[85px] shrink-0 border-b border-[#e5e5e5] bg-white px-4 py-4 sm:px-6 md:px-8 z-10">
      <div className="flex h-full items-center justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold leading-tight tracking-wide text-[#171717] sm:text-xl md:text-2xl">
            <span className="sr-only sm:not-sr-only sm:mb-1 sm:block sm:text-xs sm:font-normal sm:text-[#737373] sm:leading-normal">
              Welcome back
            </span>
            <span className="block truncate">{title}</span>
          </h1>
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
