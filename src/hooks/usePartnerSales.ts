import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPartnerSale,
  getPartnerSale,
  getPartnerSales,
  type CreatePartnerSaleInput,
  type PartnerSalesQueryParams,
} from "@/lib/api/partnerSales";
import { partnerKeys } from "@/hooks/usePartners";

export const partnerSaleKeys = {
  all: () => ["partner-sales"] as const,
  lists: () => ["partner-sales", "list"] as const,
  list: (params?: PartnerSalesQueryParams) => [
    "partner-sales",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
    params?.partner_id ?? null,
  ] as const,
  detail: (id: number) => ["partner-sales", "detail", id] as const,
};

export function usePartnerSales(params?: PartnerSalesQueryParams) {
  return useQuery({
    queryKey: partnerSaleKeys.list(params),
    queryFn: () => getPartnerSales(params),
  });
}

export function usePartnerSale(id: number) {
  return useQuery({
    queryKey: partnerSaleKeys.detail(id),
    queryFn: () => getPartnerSale(id),
    enabled: id > 0,
  });
}

export function useCreatePartnerSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartnerSaleInput) => createPartnerSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerSaleKeys.lists() });
      // A new sale changes the partner's running_balance too.
      queryClient.invalidateQueries({ queryKey: partnerKeys.lists() });
      toast.success("Sale recorded successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to record sale");
    },
  });
}
