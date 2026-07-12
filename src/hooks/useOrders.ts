import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getOrder,
  getOrders,
  updateOrderStatus,
  type OrdersQueryParams,
  type OrderStatus,
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

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      cancel_reason,
    }: {
      id: number;
      status: OrderStatus;
      cancel_reason?: string;
    }) => updateOrderStatus(id, { status, cancel_reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success("Order status updated");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update order status");
    },
  });
}
