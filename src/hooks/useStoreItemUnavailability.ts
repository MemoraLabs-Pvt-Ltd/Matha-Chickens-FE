import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getStoreItemAvailability,
  getUnavailableStock,
  updateStoreItemAvailability,
  type StoreItemAvailabilityQueryParams,
  type StoreItemAvailabilityUpdateInput,
  type UnavailableStockQueryParams,
} from "@/lib/api/storeItemUnavailability";

export const storeItemUnavailabilityKeys = {
  all: () => ["store-item-unavailability"] as const,
  availabilityLists: () => ["store-item-unavailability", "availability-list"] as const,
  availabilityList: (params?: StoreItemAvailabilityQueryParams) => [
    "store-item-unavailability",
    "availability-list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
    params?.store_id ?? null,
  ] as const,
  unavailableLists: () => ["store-item-unavailability", "unavailable-list"] as const,
  unavailableList: (params?: UnavailableStockQueryParams) => [
    "store-item-unavailability",
    "unavailable-list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
};

export function useUnavailableStocks(params?: UnavailableStockQueryParams) {
  return useQuery({
    queryKey: storeItemUnavailabilityKeys.unavailableList(params),
    queryFn: () => getUnavailableStock(params),
  });
}

export function useStoreItemAvailability(params?: StoreItemAvailabilityQueryParams) {
  return useQuery({
    queryKey: storeItemUnavailabilityKeys.availabilityList(params),
    queryFn: () => getStoreItemAvailability(params),
  });
}

export function useUpdateStoreItemAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StoreItemAvailabilityUpdateInput) =>
      updateStoreItemAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: storeItemUnavailabilityKeys.availabilityLists(),
      });
      queryClient.invalidateQueries({
        queryKey: storeItemUnavailabilityKeys.unavailableLists(),
      });
      toast.success("Item availability updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update item availability",
      );
    },
  });
}
