import { apiDelete, apiGet, apiPost, apiPostForm } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export type SalesReportImportStatus =
  | "validating"
  | "pending_confirmation"
  | "processing"
  | "completed"
  | "completed_with_errors"
  | "failed"
  | "cancelled";

export interface SalesReportImport {
  id: number;
  store_id: number;
  uploaded_by: string;
  source: string;
  format_version: string;
  file_name: string;
  file_size_bytes: number;
  report_date_from: string | null;
  report_date_to: string | null;
  status: SalesReportImportStatus;
  total_rows: number;
  inserted_rows: number;
  skipped_duplicate_rows: number;
  failed_rows: number;
  total_amount: number | null;
  error_summary: string | null;
  created_at: string;
  confirmed_at: string | null;
  completed_at: string | null;
}

export interface SalesReportPreviewRow {
  sheet_row: number;
  invoice_no: string;
  partner_name: string;
  date: string;
  total_amount: number;
}

export interface SalesReportPreview {
  date_range: { from: string; to: string } | null;
  total_invoices: number;
  total_amount: number;
  sample_rows: SalesReportPreviewRow[];
  warnings: string[];
  errors: string[];
}

export type SalesReportUploadResult = SalesReportImport & {
  preview: SalesReportPreview;
};

export type SalesReportUploadResponse = ApiResponse<SalesReportUploadResult>;
export type SalesReportImportResponse = ApiResponse<SalesReportImport>;

export interface SalesReportImportListResponse
  extends ApiResponse<SalesReportImport[]> {
  pagination: PaginationMeta;
}

export interface SalesReportImportRow {
  id: number;
  import_id: number;
  sheet_row: number;
  external_invoice_no: string;
  outcome: "inserted" | "skipped_duplicate" | "failed";
  error_message: string | null;
}

export interface SalesReportImportRowListResponse
  extends ApiResponse<SalesReportImportRow[]> {
  pagination: PaginationMeta;
}

export interface SalesReportImportsQueryParams {
  page?: number;
  limit?: number;
  store_id?: number;
  status?: SalesReportImportStatus;
}

export async function uploadSalesReport(
  file: File,
  storeId: number,
): Promise<SalesReportUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("store_id", String(storeId));

  return apiPostForm<SalesReportUploadResponse>("/sales-reports/uploads", formData);
}

export async function confirmSalesReportImport(id: number): Promise<SalesReportImportResponse> {
  return apiPost<SalesReportImportResponse>(`/sales-reports/uploads/${id}/confirm`, {});
}

export async function cancelSalesReportImport(id: number): Promise<SalesReportImportResponse> {
  return apiDelete<SalesReportImportResponse>(`/sales-reports/uploads/${id}`);
}

export async function getSalesReportImport(id: number): Promise<SalesReportImportResponse> {
  return apiGet<SalesReportImportResponse>(`/sales-reports/uploads/${id}`);
}

export async function getSalesReportImports(
  params?: SalesReportImportsQueryParams,
): Promise<SalesReportImportListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.store_id) searchParams.set("store_id", String(params.store_id));
  if (params?.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  return apiGet<SalesReportImportListResponse>(`/sales-reports/uploads${query ? `?${query}` : ""}`);
}

export async function getSalesReportImportErrors(
  id: number,
  params?: { page?: number; limit?: number },
): Promise<SalesReportImportRowListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return apiGet<SalesReportImportRowListResponse>(
    `/sales-reports/uploads/${id}/errors${query ? `?${query}` : ""}`,
  );
}
