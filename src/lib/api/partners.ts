import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export type PartnerStatus = "active" | "inactive";

export interface Partner {
  id: number;
  store_id: number;
  name: string;
  gstin: string | null;
  phone: string | null;
  address: string | null;
  running_balance: number;
  status: PartnerStatus;
  created_at: string;
  updated_at: string;
}

export interface PartnerListResponse extends ApiResponse<Partner[]> {
  pagination: PaginationMeta;
}

export type PartnerResponse = ApiResponse<Partner>;

export interface PartnersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreatePartnerInput {
  store_id: number;
  name: string;
  gstin?: string;
  phone?: string;
  address?: string;
  status: PartnerStatus;
}

export interface UpdatePartnerInput {
  name: string;
  gstin?: string;
  phone?: string;
  address?: string;
  status: PartnerStatus;
}

export async function getPartners(params?: PartnersQueryParams): Promise<PartnerListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<PartnerListResponse>(`/partners${query ? `?${query}` : ""}`);
}

export async function getPartner(id: number): Promise<PartnerResponse> {
  return apiGet<PartnerResponse>(`/partners/${id}`);
}

export async function createPartner(data: CreatePartnerInput): Promise<PartnerResponse> {
  return apiPost<PartnerResponse>("/partners", data);
}

export async function updatePartner(id: number, data: UpdatePartnerInput): Promise<PartnerResponse> {
  return apiPut<PartnerResponse>(`/partners/${id}`, data);
}

export async function deletePartner(id: number): Promise<PartnerResponse> {
  return apiDelete<PartnerResponse>(`/partners/${id}`);
}
