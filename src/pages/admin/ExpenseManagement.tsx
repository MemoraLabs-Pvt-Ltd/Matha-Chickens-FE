import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ExpenseDialog } from "@/components/admin/dialogs/expenses/ExpenseDialog";
import { DeleteExpenseDialog } from "@/components/admin/dialogs/expenses/DeleteExpenseDialog";
import { useDeleteExpense, useExpenses } from "@/hooks/useExpenses";
import type { Expense } from "@/lib/api/expenses";
import { formatInr, formatIsoDateEnGbNumeric } from "@/lib/display/formatting";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

const EXPENSES_PAGE_LIMIT = 20;

export default function ExpenseManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const { data, isLoading, isError, error } = useExpenses({
    page: currentPage,
    limit: EXPENSES_PAGE_LIMIT,
    search: searchQuery.trim() || undefined,
  });
  const deleteExpense = useDeleteExpense();

  const expenses = data?.data ?? [];
  const totalPages = Math.max(data?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = data?.pagination?.page ?? currentPage;

  useEffect(() => {
    if (searchParams.get("new") !== "1") return;

    setAddDialogOpen(true);
    setSearchParams(
      (params) => {
        params.delete("new");
        return params;
      },
      { replace: true },
    );
  }, [searchParams, setSearchParams]);

  const handleEdit = (id: number) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setEditingExpense(expense);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setDeletingExpense(expense);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingExpense) return;

    deleteExpense.mutate(deletingExpense.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setDeletingExpense(null);
      },
    });
  };

  return (
    <AdminLayout title="Expense Management">
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[rgba(0,0,0,0.1)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-base text-muted-foreground">
            Track shop expenses
          </p>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-admin px-4 text-sm font-medium text-white transition-colors hover:bg-admin/90 sm:w-auto"
          >
            <Plus className="size-4" />
            <span>Add Expense</span>
          </Button>
        </div>

        <div className="px-4 py-4 sm:px-6">
          <div className="relative min-w-0 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
            <Input
              placeholder="Search by title, category or notes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-[#f3f3f5] border-0 rounded-lg h-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                  Title
                </TableHead>
                <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                  Category
                </TableHead>
                <TableHead className="text-right py-3 pl-6 text-sm font-medium text-foreground">
                  Amount
                </TableHead>
                <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                  Date
                </TableHead>
                <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                  Notes
                </TableHead>
                <TableHead className="text-right py-3 pr-6 text-sm font-medium text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableBodySkeleton
                  rows={6}
                  columns={6}
                  rowClassName="border-[rgba(0,0,0,0.1)]"
                  cellClassNames={[
                    "py-3 pl-6",
                    "py-3 pl-6",
                    "py-3 pl-6 text-right",
                    "py-3 pl-6",
                    "py-3 pl-6",
                    "py-3 pr-6",
                  ]}
                  renderCell={(columnIndex) => {
                    if (columnIndex < 5) {
                      return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                    }

                    return (
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    );
                  }}
                />
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-destructive">
                    {error instanceof Error ? error.message : "Failed to load expenses"}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No expenses found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                expenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                  >
                    <TableCell className="py-3 pl-6 text-sm font-medium text-foreground">
                      {expense.title}
                    </TableCell>
                    <TableCell className="py-3 pl-6 text-sm text-foreground">
                      {expense.category || "-"}
                    </TableCell>
                    <TableCell className="py-3 pl-6 text-sm font-semibold text-foreground text-right">
                      {formatInr(expense.amount)}
                    </TableCell>
                    <TableCell className="py-3 pl-6 text-sm text-foreground">
                      {formatIsoDateEnGbNumeric(expense.expense_date)}
                    </TableCell>
                    <TableCell className="py-3 pl-6 text-sm text-muted-foreground">
                      {expense.notes || "-"}
                    </TableCell>
                    <TableCell className="py-3 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(expense.id)}
                          className="size-8 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Pencil className="size-4 text-[#525252]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(expense.id)}
                          className="size-8 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="py-4 px-6 border-t border-[rgba(0,0,0,0.1)]">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    className={
                      safeCurrentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {getPaginationPageNumbers(safeCurrentPage, totalPages).map((page, index) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={safeCurrentPage === page}
                        onClick={() => setCurrentPage(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    className={
                      safeCurrentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <ExpenseDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />
      {editingExpense && (
        <ExpenseDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          expense={editingExpense}
        />
      )}
      {deletingExpense && (
        <DeleteExpenseDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          expenseTitle={deletingExpense.title}
          onDelete={handleConfirmDelete}
        />
      )}
    </AdminLayout>
  );
}
