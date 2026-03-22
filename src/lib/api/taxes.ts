import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export interface Tax {
  id: number;
  name: string;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export interface TaxListResponse extends ApiResponse<Tax[]> {
  pagination: PaginationMeta;
}

export type TaxResponse = ApiResponse<Tax>;

export interface TaxesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateTaxInput {
  name: string;
  percentage: number;
}

export async function getTaxes(params?: TaxesQueryParams): Promise<TaxListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<TaxListResponse>(`/taxes${query ? `?${query}` : ""}`);
}

export async function getTax(id: number): Promise<TaxResponse> {
  return apiGet<TaxResponse>(`/taxes/${id}`);
}

export async function createTax(data: CreateTaxInput): Promise<TaxResponse> {
  return apiPost<TaxResponse>("/taxes", data);
}

export async function updateTax(id: number, data: CreateTaxInput): Promise<TaxResponse> {
  return apiPut<TaxResponse>(`/taxes/${id}`, data);
}

export async function deleteTax(id: number): Promise<TaxResponse> {
  return apiDelete<TaxResponse>(`/taxes/${id}`);
}
