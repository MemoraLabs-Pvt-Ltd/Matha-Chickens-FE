import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createStoreUpiId,
  deleteStoreUpiId,
  getStoreUpiIds,
  updateStoreUpiId,
  type CreateStoreUpiIdInput,
  type UpdateStoreUpiIdInput,
} from "@/lib/api/storeUpiIds";

export const storeUpiIdKeys = {
  all: () => ["store-upi-ids"] as const,
};

export function useStoreUpiIds(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: storeUpiIdKeys.all(),
    queryFn: () => getStoreUpiIds(),
    enabled: options?.enabled ?? true,
  });
}

export function useCreateStoreUpiId() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoreUpiIdInput) => createStoreUpiId(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeUpiIdKeys.all() });
      toast.success("UPI ID added");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add UPI ID");
    },
  });
}

export function useUpdateStoreUpiId() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStoreUpiIdInput }) =>
      updateStoreUpiId(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeUpiIdKeys.all() });
      toast.success("UPI ID updated");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update UPI ID");
    },
  });
}

export function useDeleteStoreUpiId() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteStoreUpiId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeUpiIdKeys.all() });
      toast.success("UPI ID deleted");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete UPI ID");
    },
  });
}
