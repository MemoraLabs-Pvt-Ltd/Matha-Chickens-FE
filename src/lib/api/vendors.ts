import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export type VendorBillingMode = "online" | "offline";
export type VendorDiscountType = "none" | "percentage" | "flat";
export type VendorStatus = "active" | "inactive";

export interface Vendor {
  id: number;
  business_name: string;
  contact_person: string;
  phone: string;
  email: string | null;
  address: string | null;
  login_id: string | null;
  billing_mode: VendorBillingMode;
  discount_type: VendorDiscountType;
  discount_value: number;
  status: VendorStatus;
  created_at: string;
  updated_at: string;
}

export interface VendorsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface VendorListResponse extends ApiResponse<Vendor[]> {
  pagination: PaginationMeta;
}

export type VendorResponse = ApiResponse<Vendor>;

export interface CreateVendorInput {
  business_name: string;
  contact_person: string;
  phone: string;
  email?: string;
  address?: string;
  login_id: string;
  password: string;
  billing_mode: VendorBillingMode;
  discount_type: VendorDiscountType;
  discount_value: number;
  status: VendorStatus;
}

export interface UpdateVendorInput {
  business_name: string;
  contact_person: string;
  phone: string;
  email?: string;
  address?: string;
  login_id: string;
  password?: string;
  billing_mode: VendorBillingMode;
  discount_type: VendorDiscountType;
  discount_value: number;
  status: VendorStatus;
}

export async function getVendors(params?: VendorsQueryParams): Promise<VendorListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<VendorListResponse>(`/vendors${query ? `?${query}` : ""}`);
}

export async function getVendor(id: number): Promise<VendorResponse> {
  return apiGet<VendorResponse>(`/vendors/${id}`);
}

export async function createVendor(data: CreateVendorInput): Promise<VendorResponse> {
  return apiPost<VendorResponse>("/vendors", data);
}

export async function updateVendor(id: number, data: UpdateVendorInput): Promise<VendorResponse> {
  return apiPut<VendorResponse>(`/vendors/${id}`, data);
}

export async function deleteVendor(id: number): Promise<VendorResponse> {
  return apiDelete<VendorResponse>(`/vendors/${id}`);
}
