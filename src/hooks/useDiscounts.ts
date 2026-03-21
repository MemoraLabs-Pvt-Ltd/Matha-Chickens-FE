import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createDiscount,
  deleteDiscount,
  getDiscount,
  getDiscounts,
  updateDiscount,
  type CreateDiscountInput,
  type DiscountsQueryParams,
} from "@/lib/api/discounts";

export const discountKeys = {
  all: () => ["discounts"] as const,
  lists: () => ["discounts", "list"] as const,
  list: (params?: DiscountsQueryParams) => [
    "discounts",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["discounts", "detail", id] as const,
};

export function useDiscounts(params?: DiscountsQueryParams) {
  return useQuery({
    queryKey: discountKeys.list(params),
    queryFn: () => getDiscounts(params),
  });
}

export function useDiscount(id: number) {
  return useQuery({
    queryKey: discountKeys.detail(id),
    queryFn: () => getDiscount(id),
    enabled: id > 0,
  });
}

export function useCreateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDiscountInput) => createDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountKeys.lists() });
      toast.success("Discount created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create discount");
    },
  });
}

export function useUpdateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateDiscountInput }) =>
      updateDiscount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: discountKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: discountKeys.lists() });
      toast.success("Discount updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update discount");
    },
  });
}

export function useDeleteDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDiscount(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: discountKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: discountKeys.lists() });
      toast.success("Discount deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete discount");
    },
  });
}
