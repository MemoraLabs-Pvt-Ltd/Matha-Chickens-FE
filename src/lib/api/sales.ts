import { apiGet } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";
import type { PaymentMode } from "@/lib/api/offlineBills";
import type { OrderStatus } from "@/lib/api/orders";

export type SaleChannel = "offline" | "online";

export interface Sale {
  id: number;
  channel: SaleChannel;
  store_id: number;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_mode: PaymentMode | null;
  status: OrderStatus | null;
  created_at: string;
}

export interface SalesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SaleListResponse extends ApiResponse<Sale[]> {
  pagination: PaginationMeta;
}

function toPositiveInt(value: number | undefined, fallback: number): number {
  if (!value || !Number.isFinite(value)) return fallback;
  const rounded = Math.floor(value);
  return rounded > 0 ? rounded : fallback;
}

function toSafeLimit(value: number | undefined): number {
  const parsed = toPositiveInt(value, 20);
  return Math.min(parsed, 100);
}

export async function getSales(params?: SalesQueryParams): Promise<SaleListResponse> {
  const page = toPositiveInt(params?.page, 1);
  const limit = toSafeLimit(params?.limit);
  const search = params?.search?.trim();

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  if (search) searchParams.set("search", search);

  return apiGet<SaleListResponse>(`/sales?${searchParams.toString()}`);
}
