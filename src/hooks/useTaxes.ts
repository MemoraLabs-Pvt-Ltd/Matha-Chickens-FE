import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTax,
  deleteTax,
  getTax,
  getTaxes,
  updateTax,
  type CreateTaxInput,
  type TaxesQueryParams,
} from "@/lib/api/taxes";

export const taxKeys = {
  all: () => ["taxes"] as const,
  lists: () => ["taxes", "list"] as const,
  list: (params?: TaxesQueryParams) => [
    "taxes",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["taxes", "detail", id] as const,
};

export function useTaxes(params?: TaxesQueryParams) {
  return useQuery({
    queryKey: taxKeys.list(params),
    queryFn: () => getTaxes(params),
  });
}

export function useTax(id: number) {
  return useQuery({
    queryKey: taxKeys.detail(id),
    queryFn: () => getTax(id),
    enabled: id > 0,
  });
}

export function useCreateTax() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaxInput) => createTax(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      toast.success("Tax created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create tax");
    },
  });
}

export function useUpdateTax() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateTaxInput }) =>
      updateTax(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taxKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      toast.success("Tax updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update tax");
    },
  });
}

export function useDeleteTax() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTax(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: taxKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taxKeys.lists() });
      toast.success("Tax deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete tax");
    },
  });
}
