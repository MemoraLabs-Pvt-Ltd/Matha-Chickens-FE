import { ChevronDown, LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type UserProfileDropdownVariant = "admin" | "store";

interface UserProfileDropdownProps {
  variant: UserProfileDropdownVariant;
  headerPrimary: string;
  headerSecondary?: string;
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
  accountName,
  accountEmail,
  roleLabel,
  avatarInitials,
  isLoading,
  onLogout,
}: UserProfileDropdownProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-auto shrink-0 gap-1.5 rounded-lg px-1.5 py-1.5 hover:bg-muted/80 sm:gap-2"
          aria-label="Open account menu"
        >
          <span className="sr-only">
            {isLoading
              ? "Loading account"
              : [
                  headerPrimary,
                  headerSecondary
                    ? variant === "store"
                      ? `● ${headerSecondary}`
                      : headerSecondary
                    : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
          </span>
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
            className="cursor-pointer"
            onSelect={() => navigate("/delete-account")}
          >
            <Trash2 className="size-4" />
            Delete Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
