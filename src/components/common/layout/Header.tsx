interface HeaderProps {
  title: string;
  userName?: string;
  userEmail?: string;
}

export function Header({ title, userName, userEmail }: HeaderProps) {
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  return (
    <header className="bg-white border-b border-[#e5e5e5] h-[85px] px-8 py-4 shrink-0 z-10">
      <div className="flex items-center justify-between h-full">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-[#737373]">Welcome back</p>
          <h1 className="text-2xl font-semibold text-[#171717] tracking-wide">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-[#171717]">
              {userName}
            </p>
            {userEmail && (
              <p className="text-xs text-[#737373]">{userEmail}</p>
            )}
          </div>
          <div className="bg-admin rounded-full size-10 flex items-center justify-center">
            <span className="text-base font-semibold text-white">
              {initials}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
