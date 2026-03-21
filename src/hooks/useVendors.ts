import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createVendor,
  deleteVendor,
  getVendor,
  getVendors,
  updateVendor,
  type CreateVendorInput,
  type UpdateVendorInput,
  type VendorsQueryParams,
} from "@/lib/api/vendors";

export const vendorKeys = {
  all: () => ["vendors"] as const,
  lists: () => ["vendors", "list"] as const,
  list: (params?: VendorsQueryParams) => [
    "vendors",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["vendors", "detail", id] as const,
};

export function useVendors(params?: VendorsQueryParams) {
  return useQuery({
    queryKey: vendorKeys.list(params),
    queryFn: () => getVendors(params),
  });
}

export function useVendor(id: number) {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => getVendor(id),
    enabled: id > 0,
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVendorInput) => createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      toast.success("Vendor created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create vendor");
    },
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVendorInput }) =>
      updateVendor(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      toast.success("Vendor updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update vendor");
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteVendor(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      toast.success("Vendor deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete vendor");
    },
  });
}
