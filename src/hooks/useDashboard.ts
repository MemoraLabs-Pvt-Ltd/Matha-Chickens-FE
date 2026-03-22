import { useQuery } from "@tanstack/react-query";
import {
  getAdminDashboard,
  getStoreDashboard,
  type DashboardQueryParams,
} from "@/lib/api/dashboard";

export const dashboardKeys = {
  all: () => ["dashboard"] as const,
  admin: (params?: DashboardQueryParams) =>
    ["dashboard", "admin", params?.date ?? "today"] as const,
  store: (params?: DashboardQueryParams) =>
    ["dashboard", "store", params?.date ?? "today"] as const,
};

export function useAdminDashboard(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: dashboardKeys.admin(params),
    queryFn: () => getAdminDashboard(params),
  });
}

export function useStoreDashboard(params?: DashboardQueryParams) {
  return useQuery({
    queryKey: dashboardKeys.store(params),
    queryFn: () => getStoreDashboard(params),
  });
}
