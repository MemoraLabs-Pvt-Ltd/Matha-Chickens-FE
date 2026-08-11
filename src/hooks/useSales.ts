import { useQuery } from "@tanstack/react-query";
import { getSales, type SalesQueryParams } from "@/lib/api/sales";

export const salesKeys = {
  all: () => ["sales"] as const,
  lists: () => ["sales", "list"] as const,
  list: (params?: SalesQueryParams) => [
    "sales",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
};

export function useSales(params?: SalesQueryParams) {
  return useQuery({
    queryKey: salesKeys.list(params),
    queryFn: () => getSales(params),
  });
}
