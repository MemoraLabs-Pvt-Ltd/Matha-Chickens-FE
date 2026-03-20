import { useQuery } from "@tanstack/react-query";
import {
  getOrder,
  getOrders,
  type OrdersQueryParams,
} from "@/lib/api/orders";

export const orderKeys = {
  all: () => ["orders"] as const,
  lists: () => ["orders", "list"] as const,
  list: (params?: OrdersQueryParams) => [
    "orders",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["orders", "detail", id] as const,
};

export function useOrders(params?: OrdersQueryParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrder(id),
    enabled: id > 0,
  });
}
