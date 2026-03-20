import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createOfflineBill,
  getOfflineBill,
  getOfflineBills,
  type CreateOfflineBillInput,
  type OfflineBillsQueryParams,
} from "@/lib/api/offlineBills";

export const offlineBillKeys = {
  all: () => ["offline-bills"] as const,
  lists: () => ["offline-bills", "list"] as const,
  list: (params?: OfflineBillsQueryParams) => [
    "offline-bills",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["offline-bills", "detail", id] as const,
};

export function useOfflineBills(params?: OfflineBillsQueryParams) {
  return useQuery({
    queryKey: offlineBillKeys.list(params),
    queryFn: () => getOfflineBills(params),
  });
}

export function useOfflineBill(id: number) {
  return useQuery({
    queryKey: offlineBillKeys.detail(id),
    queryFn: () => getOfflineBill(id),
    enabled: id > 0,
  });
}

export function useCreateOfflineBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOfflineBillInput) => createOfflineBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offlineBillKeys.lists() });
      toast.success("Offline bill created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create offline bill");
    },
  });
}
