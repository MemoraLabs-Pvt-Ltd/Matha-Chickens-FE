import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export interface Store {
  id: number;
  name: string;
  phone: string;
  address: string;
  login_id: string;
  enable_discount: boolean;
  discount_percent: number;
  is_tax_applicable: boolean;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreListResponse extends ApiResponse<Store[]> {
  pagination: PaginationMeta;
}

export type StoreResponse = ApiResponse<Store>;

export interface StoresQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateStoreInput {
  name: string;
  phone: string;
  address: string;
  login_id: string;
  password: string;
  enable_discount?: boolean;
  discount_percent?: number;
  is_tax_applicable?: boolean;
  status?: string;
}

export interface UpdateStoreInput {
  name: string;
  phone: string;
  address: string;
  login_id: string;
  password?: string;
  enable_discount?: boolean;
  discount_percent?: number;
  is_tax_applicable?: boolean;
  status?: string;
}

export async function getStores(params?: StoresQueryParams): Promise<StoreListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<StoreListResponse>(`/stores${query ? `?${query}` : ""}`);
}

export async function getStore(id: number): Promise<StoreResponse> {
  return apiGet<StoreResponse>(`/stores/${id}`);
}

export async function createStore(data: CreateStoreInput): Promise<StoreResponse> {
  return apiPost<StoreResponse>("/stores", data);
}

export async function updateStore(id: number, data: UpdateStoreInput): Promise<StoreResponse> {
  return apiPut<StoreResponse>(`/stores/${id}`, data);
}

export async function deleteStore(id: number): Promise<StoreResponse> {
  return apiDelete<StoreResponse>(`/stores/${id}`);
}
