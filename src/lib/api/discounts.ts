import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export type DiscountType = "none" | "percentage" | "flat";
export type DiscountStatus = "active" | "inactive";

export interface Discount {
  id: number;
  title: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  start_date: string;
  end_date: string;
  banner_url: string | null;
  status: DiscountStatus;
  created_at: string;
  updated_at: string;
}

export interface DiscountListResponse extends ApiResponse<Discount[]> {
  pagination: PaginationMeta;
}

export type DiscountResponse = ApiResponse<Discount>;

export interface DiscountsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateDiscountInput {
  title: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  start_date: string;
  end_date: string;
  banner_url?: string;
  status?: DiscountStatus;
}

export async function getDiscounts(params?: DiscountsQueryParams): Promise<DiscountListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<DiscountListResponse>(`/discounts${query ? `?${query}` : ""}`);
}

export async function getDiscount(id: number): Promise<DiscountResponse> {
  return apiGet<DiscountResponse>(`/discounts/${id}`);
}

export async function createDiscount(data: CreateDiscountInput): Promise<DiscountResponse> {
  return apiPost<DiscountResponse>("/discounts", data);
}

export async function updateDiscount(id: number, data: CreateDiscountInput): Promise<DiscountResponse> {
  return apiPut<DiscountResponse>(`/discounts/${id}`, data);
}

export async function deleteDiscount(id: number): Promise<DiscountResponse> {
  return apiDelete<DiscountResponse>(`/discounts/${id}`);
}
