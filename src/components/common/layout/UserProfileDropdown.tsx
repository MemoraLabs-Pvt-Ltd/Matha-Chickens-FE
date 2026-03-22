import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type UserProfileDropdownVariant = "admin" | "store";

interface UserProfileDropdownProps {
  variant: UserProfileDropdownVariant;
  headerPrimary: string;
  headerSecondary?: string;
  headerSecondaryClassName?: string;
  accountName: string;
  accountEmail: string;
  roleLabel: string;
  avatarInitials: string;
  isLoading?: boolean;
  onLogout: () => void;
}

const avatarRing: Record<UserProfileDropdownVariant, string> = {
  admin: "bg-admin",
  store: "bg-store",
};

export function UserProfileDropdown({
  variant,
  headerPrimary,
  headerSecondary,
  headerSecondaryClassName,
  accountName,
  accountEmail,
  roleLabel,
  avatarInitials,
  isLoading,
  onLogout,
}: UserProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-auto shrink-0 gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/80 md:gap-3 md:px-2"
          aria-label="Open profile menu"
        >
          <div className="min-w-0 max-w-[min(200px,42vw)] text-right sm:max-w-none sm:min-w-[120px] md:min-w-[140px]">
            {isLoading ? (
              <>
                <Skeleton className="mb-1.5 ml-auto h-4 w-32 rounded-md" />
                <Skeleton className="ml-auto h-3 w-24 rounded-md" />
              </>
            ) : (
              <>
                <p className="truncate text-sm font-medium text-foreground">
                  {headerPrimary}
                </p>
                {headerSecondary ? (
                  <p
                    className={cn(
                      "truncate text-xs",
                      variant === "admin" && "text-muted-foreground",
                      variant === "store" && "text-[#00a63e]",
                      headerSecondaryClassName,
                    )}
                  >
                    {variant === "store"
                      ? `● ${headerSecondary}`
                      : headerSecondary}
                  </p>
                ) : null}
              </>
            )}
          </div>
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              avatarRing[variant],
            )}
          >
            {isLoading ? (
              <Skeleton className="size-10 rounded-full bg-white/20" />
            ) : (
              <span className="text-base font-semibold text-white">
                {avatarInitials}
              </span>
            )}
          </div>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[16rem] p-0">
        <div className="border-b border-border px-3 py-3">
          <DropdownMenuLabel className="p-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Signed in as
          </DropdownMenuLabel>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">
            {isLoading ? "…" : accountName}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {isLoading ? "…" : accountEmail || "—"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Role:{" "}
            <span className="font-medium text-foreground">{roleLabel}</span>
          </p>
        </div>
        <div className="p-1">
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => {
              void onLogout();
            }}
          >
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
