import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client";
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

/** Active global discount row for billing (same as server `getActiveDiscount` / `public.discounts`). */
export type ActiveCampaignDiscount = {
  id: number;
  title: string;
  discount_type: DiscountType;
  discount_value: number;
};

export type ActiveCampaignDiscountResponse = ApiResponse<ActiveCampaignDiscount | null>;

export interface DiscountsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isDiscountActive?: boolean;
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
  if (params?.isDiscountActive === true) searchParams.set("isDiscountActive", "true");

  const query = searchParams.toString();
  return apiGet<DiscountListResponse>(`/discounts${query ? `?${query}` : ""}`);
}

export async function getDiscount(id: number): Promise<DiscountResponse> {
  return apiGet<DiscountResponse>(`/discounts/${id}`);
}

export async function getActiveCampaignDiscount(): Promise<ActiveCampaignDiscountResponse> {
  const res = await getDiscounts({ page: 1, limit: 1, isDiscountActive: true });
  const row = res.data?.[0];
  if (!row || row.discount_type === "none") {
    return {
      message: res.message,
      success: res.success,
      data: null,
    };
  }
  return {
    message: res.message,
    success: res.success,
    data: {
      id: row.id,
      title: row.title,
      discount_type: row.discount_type,
      discount_value: Number(row.discount_value),
    },
  };
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
