// src/lib/auth.ts
import type { AuthRole } from "@/types/auth";

export function getDashboardPath(role: AuthRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "store_owner":
      return "/store/dashboard";
    case "user":
      return "/portal";
  }
}