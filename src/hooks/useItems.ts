import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createItem,
  deleteItem,
  getItem,
  getItems,
  updateItem,
  type CreateItemInput,
  type ItemsQueryParams,
} from "@/lib/api/items";

export const itemKeys = {
  all: () => ["items"] as const,
  lists: () => ["items", "list"] as const,
  list: (params?: ItemsQueryParams) => [
    "items",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["items", "detail", id] as const,
};

export function useItems(params?: ItemsQueryParams) {
  return useQuery({
    queryKey: itemKeys.list(params),
    queryFn: () => getItems(params),
  });
}

export function useItem(id: number) {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => getItem(id),
    enabled: id > 0,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemInput) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      toast.success("Item created successfully");
    },
    onError: () => {
      toast.error("Failed to create item");
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateItemInput }) =>
      updateItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      toast.success("Item updated successfully");
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      toast.success("Item deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
  });
}
