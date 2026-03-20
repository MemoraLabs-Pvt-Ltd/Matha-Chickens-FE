import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export interface StockReceipt {
  id: number;
  receipt_code: string;
  supplier_id: number;
  item_id: number;
  quantity: number;
  unit: string;
  price_per_unit: number;
  notes: string | null;
  created_at: string;
}

export interface StockReceiptListResponse extends ApiResponse<StockReceipt[]> {
  pagination: PaginationMeta;
}

export type StockReceiptResponse = ApiResponse<StockReceipt>;

export interface StockReceiptsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateStockReceiptInput {
  receipt_code: string;
  supplier_id: number;
  item_id: number;
  quantity: number;
  unit?: string;
  price_per_unit: number;
  notes?: string;
}

export async function getStockReceipts(
  params?: StockReceiptsQueryParams,
): Promise<StockReceiptListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<StockReceiptListResponse>(`/stock_receipts${query ? `?${query}` : ""}`);
}

export async function getStockReceipt(id: number): Promise<StockReceiptResponse> {
  return apiGet<StockReceiptResponse>(`/stock_receipts/${id}`);
}

export async function createStockReceipt(
  data: CreateStockReceiptInput,
): Promise<StockReceiptResponse> {
  return apiPost<StockReceiptResponse>("/stock_receipts", data);
}

export async function updateStockReceipt(
  id: number,
  data: CreateStockReceiptInput,
): Promise<StockReceiptResponse> {
  return apiPut<StockReceiptResponse>(`/stock_receipts/${id}`, data);
}

export async function deleteStockReceipt(id: number): Promise<StockReceiptResponse> {
  return apiDelete<StockReceiptResponse>(`/stock_receipts/${id}`);
}
