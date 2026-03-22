import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export type PaymentMode = "cash" | "card" | "upi" | "other";
export type DiscountType = "none" | "percentage" | "fixed";

export interface OfflineBill {
  id: number;
  store_id: number;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_mode: PaymentMode;
  created_at: string;
}

export interface OfflineBillItem {
  id: number;
  bill_id: number;
  item_id: number;
  item_name: string;
  unit: string;
  price: number;
  gst_percent: number;
  discount_type: DiscountType;
  discount_value: number;
  quantity: number;
  total: number;
}

export interface OfflineBillDetail extends OfflineBill {
  bill_items: OfflineBillItem[];
}

export interface OfflineBillsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateOfflineBillInput {
  customer_name?: string;
  customer_phone?: string;
  payment_mode: PaymentMode;
  items: Array<{
    item_id: number;
    quantity: number;
  }>;
  discount_type?: DiscountType;
  discount_value?: number;
}

export interface OfflineBillListResponse extends ApiResponse<OfflineBill[]> {
  pagination: PaginationMeta;
}

export type OfflineBillResponse = ApiResponse<OfflineBillDetail>;
export type OfflineBillCreateResponse = ApiResponse<{
  bill: OfflineBill;
  bill_items: OfflineBillItem[];
}>;

function toPositiveInt(value: number | undefined, fallback: number): number {
  if (!value || !Number.isFinite(value)) return fallback;
  const rounded = Math.floor(value);
  return rounded > 0 ? rounded : fallback;
}

function toSafeLimit(value: number | undefined): number {
  const parsed = toPositiveInt(value, 20);
  return Math.min(parsed, 100);
}

export async function getOfflineBills(
  params?: OfflineBillsQueryParams,
): Promise<OfflineBillListResponse> {
  const page = toPositiveInt(params?.page, 1);
  const limit = toSafeLimit(params?.limit);
  const search = params?.search?.trim();

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  if (search) searchParams.set("search", search);

  return apiGet<OfflineBillListResponse>(`/offline-bills?${searchParams.toString()}`);
}

export async function getOfflineBill(id: number): Promise<OfflineBillResponse> {
  return apiGet<OfflineBillResponse>(`/offline-bills/${id}`);
}

export async function createOfflineBill(
  data: CreateOfflineBillInput,
): Promise<OfflineBillCreateResponse> {
  return apiPost<OfflineBillCreateResponse>("/offline-bills", data);
}
