import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPartner,
  deletePartner,
  getPartner,
  getPartners,
  updatePartner,
  type CreatePartnerInput,
  type PartnersQueryParams,
  type UpdatePartnerInput,
} from "@/lib/api/partners";

export const partnerKeys = {
  all: () => ["partners"] as const,
  lists: () => ["partners", "list"] as const,
  list: (params?: PartnersQueryParams) => [
    "partners",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["partners", "detail", id] as const,
};

export function usePartners(params?: PartnersQueryParams) {
  return useQuery({
    queryKey: partnerKeys.list(params),
    queryFn: () => getPartners(params),
  });
}

/** Loads every partner across pages — the API caps a single request at 100 rows. */
export function useAllPartners() {
  return useQuery({
    queryKey: [...partnerKeys.lists(), "all"] as const,
    queryFn: async () => {
      const limit = 100;
      const first = await getPartners({ page: 1, limit });
      const totalPages = first.pagination?.totalPages ?? 1;
      const rest = await Promise.all(
        Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) =>
          getPartners({ page: i + 2, limit }),
        ),
      );
      return [first, ...rest].flatMap((res) => res.data);
    },
  });
}

export function usePartner(id: number) {
  return useQuery({
    queryKey: partnerKeys.detail(id),
    queryFn: () => getPartner(id),
    enabled: id > 0,
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartnerInput) => createPartner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.lists() });
      toast.success("Partner created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create partner");
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePartnerInput }) =>
      updatePartner(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: partnerKeys.lists() });
      toast.success("Partner updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update partner");
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePartner(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: partnerKeys.lists() });
      toast.success("Partner deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete partner");
    },
  });
}
