import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export interface Category {
  id: number;
  name: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse extends ApiResponse<Category[]> {
  pagination: PaginationMeta;
}

export type CategoryResponse = ApiResponse<Category>;

export interface CreateCategoryInput {
  name: string;
  status?: "active" | "inactive";
}

export interface CategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getCategories(params?: CategoriesQueryParams): Promise<CategoryListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<CategoryListResponse>(`/categories${query ? `?${query}` : ""}`);
}

export async function createCategory(data: CreateCategoryInput): Promise<CategoryResponse> {
  return apiPost<CategoryResponse>("/categories", data);
}

export async function getCategory(id: number): Promise<CategoryResponse> {
  return apiGet<CategoryResponse>(`/categories/${id}`);
}

export async function updateCategory(
  id: number,
  data: CreateCategoryInput
): Promise<CategoryResponse> {
  return apiPut<CategoryResponse>(`/categories/${id}`, data);
}

export async function deleteCategory(id: number): Promise<CategoryResponse> {
  return apiDelete<CategoryResponse>(`/categories/${id}`);
}
