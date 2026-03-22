import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createStore,
  deleteStore,
  getStore,
  getStores,
  getMyStore,
  updateStore,
  type CreateStoreInput,
  type StoresQueryParams,
  type UpdateStoreInput,
} from "@/lib/api/stores";

export const storeKeys = {
  all: () => ["stores"] as const,
  lists: () => ["stores", "list"] as const,
  list: (params?: StoresQueryParams) => [
    "stores",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["stores", "detail", id] as const,
  me: () => ["stores", "me"] as const,
};

export function useStores(params?: StoresQueryParams) {
  return useQuery({
    queryKey: storeKeys.list(params),
    queryFn: () => getStores(params),
  });
}

export function useStore(id: number) {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => getStore(id),
    enabled: id > 0,
  });
}

export function useMyStore(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: storeKeys.me(),
    queryFn: () => getMyStore(),
    enabled: options?.enabled ?? true,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoreInput) => createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.me() });
      toast.success("Store created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create store");
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStoreInput }) =>
      updateStore(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.me() });
      toast.success("Store updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update store");
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteStore(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.me() });
      toast.success("Store deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete store");
    },
  });
}
