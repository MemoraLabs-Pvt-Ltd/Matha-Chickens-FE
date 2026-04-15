import type { AuthRole, AuthUser } from "@/types/auth";

const ROLE_LABEL: Record<AuthRole, string> = {
  admin: "Admin",
  store_owner: "Store owner",
  user: "User",
};

/**
 * Header / profile text from the current Supabase session user only (no `/stores/me` or other APIs).
 */
export function getDisplayForLoggedInUser(user: AuthUser | null): {
  displayName: string;
  avatarInitial: string;
  roleLabel: string;
} | null {
  if (!user?.email) return null;

  const local = user.email.split("@")[0]?.trim() ?? "";
  const displayName =
    local.length > 0
      ? local
          .split(/[._-]/)
          .filter(Boolean)
          .map(
            (part) =>
              part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
          )
          .join(" ")
      : user.email;

  const avatarInitial = (local[0] ?? user.email[0] ?? "?").toUpperCase();

  return {
    displayName,
    avatarInitial,
    roleLabel: ROLE_LABEL[user.role],
  };
}
