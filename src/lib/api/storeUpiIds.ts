import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";

export interface StoreUpiId {
  id: number;
  store_id: number;
  label: string | null;
  upi_id: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type StoreUpiIdListResponse = ApiResponse<StoreUpiId[]>;
export type StoreUpiIdResponse = ApiResponse<StoreUpiId>;

export interface CreateStoreUpiIdInput {
  label?: string;
  upi_id: string;
  is_default?: boolean;
}

export interface UpdateStoreUpiIdInput {
  label?: string;
  upi_id: string;
  is_default?: boolean;
}

export async function getStoreUpiIds(): Promise<StoreUpiIdListResponse> {
  return apiGet<StoreUpiIdListResponse>("/store-upi-ids");
}

export async function createStoreUpiId(
  data: CreateStoreUpiIdInput,
): Promise<StoreUpiIdResponse> {
  return apiPost<StoreUpiIdResponse>("/store-upi-ids", data);
}

export async function updateStoreUpiId(
  id: number,
  data: UpdateStoreUpiIdInput,
): Promise<StoreUpiIdResponse> {
  return apiPut<StoreUpiIdResponse>(`/store-upi-ids/${id}`, data);
}

export async function deleteStoreUpiId(id: number): Promise<StoreUpiIdResponse> {
  return apiDelete<StoreUpiIdResponse>(`/store-upi-ids/${id}`);
}
