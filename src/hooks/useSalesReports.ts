import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cancelSalesReportImport,
  confirmSalesReportImport,
  getSalesReportImport,
  getSalesReportImportErrors,
  getSalesReportImports,
  uploadSalesReport,
  type SalesReportImportsQueryParams,
  type SalesReportImportStatus,
} from "@/lib/api/salesReports";

const IN_FLIGHT_STATUSES: SalesReportImportStatus[] = ["validating", "processing"];

export const salesReportKeys = {
  all: () => ["sales-report-imports"] as const,
  lists: () => ["sales-report-imports", "list"] as const,
  list: (params?: SalesReportImportsQueryParams) => [
    "sales-report-imports",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.store_id ?? null,
    params?.status ?? null,
  ] as const,
  detail: (id: number) => ["sales-report-imports", "detail", id] as const,
  errors: (id: number) => ["sales-report-imports", "errors", id] as const,
};

export function useSalesReportImports(params?: SalesReportImportsQueryParams) {
  return useQuery({
    queryKey: salesReportKeys.list(params),
    queryFn: () => getSalesReportImports(params),
  });
}

/** Polls while the batch is still validating/processing; stops once it settles. */
export function useSalesReportImport(id: number | null) {
  return useQuery({
    queryKey: salesReportKeys.detail(id ?? -1),
    queryFn: () => getSalesReportImport(id as number),
    enabled: id !== null && id > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      return status && IN_FLIGHT_STATUSES.includes(status) ? 2500 : false;
    },
  });
}

export function useSalesReportImportErrors(id: number | null) {
  return useQuery({
    queryKey: salesReportKeys.errors(id ?? -1),
    queryFn: () => getSalesReportImportErrors(id as number),
    enabled: id !== null && id > 0,
  });
}

export function useUploadSalesReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, storeId }: { file: File; storeId: number }) =>
      uploadSalesReport(file, storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesReportKeys.lists() });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to upload report");
    },
  });
}

export function useConfirmSalesReportImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => confirmSalesReportImport(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: salesReportKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: salesReportKeys.lists() });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to confirm import");
    },
  });
}

export function useCancelSalesReportImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelSalesReportImport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesReportKeys.lists() });
      toast.success("Import cancelled");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to cancel import");
    },
  });
}
