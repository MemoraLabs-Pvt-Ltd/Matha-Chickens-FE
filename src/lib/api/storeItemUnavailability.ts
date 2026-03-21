import { apiGet, apiPut } from "@/lib/api";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export interface UnavailableStockItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  status: string;
  category_id: number;
}

export interface UnavailableStockStore {
  id: number;
  name: string;
  login_id: string;
  enable_discount: boolean;
  is_tax_applicable: boolean;
}

export interface UnavailableStockEntry {
  item: UnavailableStockItem;
  store: UnavailableStockStore;
}

export interface UnavailableStockListResponse
  extends ApiResponse<UnavailableStockEntry[]> {
  pagination: PaginationMeta;
}

export interface UnavailableStockQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface StoreItemAvailability {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  unit: string;
  status: string | null;
  category_id?: number;
  available: boolean;
}

export interface StoreItemAvailabilityQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  store_id?: number;
}

export interface StoreItemAvailabilityUpdateInput {
  available: number[];
  unavailable: number[];
}

export interface StoreItemAvailabilityListResponse
  extends ApiResponse<StoreItemAvailability[]> {
  pagination: PaginationMeta;
}

export type StoreItemAvailabilityUpdateResponse =
  ApiResponse<StoreItemAvailability[]>;

export async function getUnavailableStock(
  params?: UnavailableStockQueryParams,
): Promise<UnavailableStockListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<UnavailableStockListResponse>(
    `/store_item_unavailability/unavailable${query ? `?${query}` : ""}`,
  );
}

export async function getStoreItemAvailability(
  params?: StoreItemAvailabilityQueryParams,
): Promise<StoreItemAvailabilityListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.store_id) searchParams.set("store_id", String(params.store_id));

  const query = searchParams.toString();
  return apiGet<StoreItemAvailabilityListResponse>(
    `/store_item_unavailability${query ? `?${query}` : ""}`,
  );
}

export async function updateStoreItemAvailability(
  data: StoreItemAvailabilityUpdateInput,
): Promise<StoreItemAvailabilityUpdateResponse> {
  return apiPut<StoreItemAvailabilityUpdateResponse>(
    "/store_item_unavailability",
    data,
  );
}
