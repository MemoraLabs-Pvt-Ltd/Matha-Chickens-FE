import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export interface Expense {
  id: number;
  title: string;
  category: string | null;
  amount: number;
  expense_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseListResponse extends ApiResponse<Expense[]> {
  pagination: PaginationMeta;
}

export type ExpenseResponse = ApiResponse<Expense>;

export interface ExpensesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateExpenseInput {
  title: string;
  category?: string;
  amount: number;
  expense_date?: string;
  notes?: string;
}

export async function getExpenses(params?: ExpensesQueryParams): Promise<ExpenseListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return apiGet<ExpenseListResponse>(`/expenses${query ? `?${query}` : ""}`);
}

export async function getExpense(id: number): Promise<ExpenseResponse> {
  return apiGet<ExpenseResponse>(`/expenses/${id}`);
}

export async function createExpense(data: CreateExpenseInput): Promise<ExpenseResponse> {
  return apiPost<ExpenseResponse>("/expenses", data);
}

export async function updateExpense(id: number, data: CreateExpenseInput): Promise<ExpenseResponse> {
  return apiPut<ExpenseResponse>(`/expenses/${id}`, data);
}

export async function deleteExpense(id: number): Promise<ExpenseResponse> {
  return apiDelete<ExpenseResponse>(`/expenses/${id}`);
}
