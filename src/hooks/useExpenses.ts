import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  updateExpense,
  type CreateExpenseInput,
  type ExpensesQueryParams,
} from "@/lib/api/expenses";

export const expenseKeys = {
  all: () => ["expenses"] as const,
  lists: () => ["expenses", "list"] as const,
  list: (params?: ExpensesQueryParams) => [
    "expenses",
    "list",
    params?.page ?? null,
    params?.limit ?? null,
    params?.search ?? "",
  ] as const,
  detail: (id: number) => ["expenses", "detail", id] as const,
};

export function useExpenses(params?: ExpensesQueryParams) {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: () => getExpenses(params),
  });
}

export function useExpense(id: number) {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => getExpense(id),
    enabled: id > 0,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseInput) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      toast.success("Expense created successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create expense");
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateExpenseInput }) =>
      updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      toast.success("Expense updated successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update expense");
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      toast.success("Expense deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete expense");
    },
  });
}
