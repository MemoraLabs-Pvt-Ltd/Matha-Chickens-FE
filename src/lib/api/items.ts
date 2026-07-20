import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api/client';
import type { ApiResponse, PaginationMeta } from '@/lib/api/types';

export const UNIT_OPTIONS = ['Kg', 'Nos', 'Tray', 'Bird', 'Pcs'] as const;

export interface Item {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  gst_percent: number;
  discount_type: string;
  discount_value: number;
  image_url: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItemListResponse extends ApiResponse<Item[]> {
  pagination: PaginationMeta;
}

export type ItemResponse = ApiResponse<Item>;

export interface ItemsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateItemInput {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  unit?: string;
  gst_percent?: number;
  discount_type?: string;
  discount_value?: number;
  image_url?: string;
  status?: string;
}

export async function getItems(
  params?: ItemsQueryParams,
): Promise<ItemListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.search) searchParams.set('search', params.search);

  const query = searchParams.toString();
  return apiGet<ItemListResponse>(`/items${query ? `?${query}` : ''}`);
}

export async function getItem(id: number): Promise<ItemResponse> {
  return apiGet<ItemResponse>(`/items/${id}`);
}

export async function createItem(data: CreateItemInput): Promise<ItemResponse> {
  return apiPost<ItemResponse>('/items', data);
}

export async function updateItem(
  id: number,
  data: CreateItemInput,
): Promise<ItemResponse> {
  return apiPut<ItemResponse>(`/items/${id}`, data);
}

export async function deleteItem(id: number): Promise<ItemResponse> {
  return apiDelete<ItemResponse>(`/items/${id}`);
}
