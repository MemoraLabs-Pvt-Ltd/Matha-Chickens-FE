import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export interface Supplier {
  id: number;
  name: string;
  phone_number: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierListResponse extends ApiResponse<Supplier[]> {
  pagination: PaginationMeta;
}

export type SupplierResponse = ApiResponse<Supplier>;

export interface SuppliersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateSupplierInput {
  name: string;
  phone_number: string;
  address: string;
}

export async function getSuppliers(params?: SuppliersQueryParams): Promise<SupplierListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<SupplierListResponse>(`/suppliers${query ? `?${query}` : ""}`);
}

export async function getSupplier(id: number): Promise<SupplierResponse> {
  return apiGet<SupplierResponse>(`/suppliers/${id}`);
}

export async function createSupplier(data: CreateSupplierInput): Promise<SupplierResponse> {
  return apiPost<SupplierResponse>("/suppliers", data);
}

export async function updateSupplier(id: number, data: CreateSupplierInput): Promise<SupplierResponse> {
  return apiPut<SupplierResponse>(`/suppliers/${id}`, data);
}

export async function deleteSupplier(id: number): Promise<SupplierResponse> {
  return apiDelete<SupplierResponse>(`/suppliers/${id}`);
}
