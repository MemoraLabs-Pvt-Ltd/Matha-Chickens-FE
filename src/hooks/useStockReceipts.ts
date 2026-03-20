import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createStockReceipt,
  deleteStockReceipt,
  getStockReceipt,
  getStockReceipts,
  updateStockReceipt,
  type CreateStockReceiptInput,
  type StockReceiptsQueryParams,
} from "@/lib/api/stockReceipts";

export const stockReceiptKeys = {
  all: () => ["stock-receipts"] as const,
  lists: () => ["stock-receipts", "list"] as const,
  list: (params?: StockReceiptsQueryParams) => [
    "stock-receipts",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["stock-receipts", "detail", id] as const,
};

export function useStockReceipts(params?: StockReceiptsQueryParams) {
  return useQuery({
    queryKey: stockReceiptKeys.list(params),
    queryFn: () => getStockReceipts(params),
  });
}

export function useStockReceipt(id: number) {
  return useQuery({
    queryKey: stockReceiptKeys.detail(id),
    queryFn: () => getStockReceipt(id),
    enabled: id > 0,
  });
}

export function useCreateStockReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStockReceiptInput) => createStockReceipt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockReceiptKeys.lists() });
      toast.success("Stock receipt created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create stock receipt");
    },
  });
}

export function useUpdateStockReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateStockReceiptInput }) =>
      updateStockReceipt(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: stockReceiptKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: stockReceiptKeys.lists() });
      toast.success("Stock receipt updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update stock receipt");
    },
  });
}

export function useDeleteStockReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteStockReceipt(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: stockReceiptKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: stockReceiptKeys.lists() });
      toast.success("Stock receipt deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete stock receipt");
    },
  });
}
