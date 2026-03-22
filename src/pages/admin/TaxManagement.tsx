import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import { TaxDialog } from "@/components/admin/dialogs/taxes/TaxDialog";
import { DeleteTaxDialog } from "@/components/admin/dialogs/taxes/DeleteTaxDialog";
import { useDeleteTax, useTaxes } from "@/hooks/useTaxes";
import type { Tax } from "@/lib/api/taxes";

export default function TaxManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [deletingTax, setDeletingTax] = useState<Tax | null>(null);

  const { data, isLoading, isError, error } = useTaxes({ limit: 100 });
  const deleteTax = useDeleteTax();

  const taxes = data?.data ?? [];

  const handleEdit = (id: number) => {
    const tax = taxes.find((t) => t.id === id);
    if (tax) {
      setEditingTax(tax);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const tax = taxes.find((t) => t.id === id);
    if (tax) {
      setDeletingTax(tax);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingTax) return;

    deleteTax.mutate(deletingTax.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setDeletingTax(null);
      },
    });
  };

  return (
    <AdminLayout title="Tax Management">
      <div className="bg-[#fafafa]">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[rgba(0,0,0,0.1)] px-4 py-[18px] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-base text-[#525252]">
              Manage tax types and rates
            </p>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-admin px-4 text-sm font-medium text-white transition-colors hover:bg-admin/90 sm:w-auto"
            >
              <Plus className="size-4" />
              <span>Add Tax Type</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Tax Name
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Percentage
                </TableHead>
                <TableHead className="text-right py-[10px] pr-2 text-sm font-medium text-[#0a0a0a]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableBodySkeleton
                  rows={6}
                  columns={3}
                  rowClassName="border-[rgba(0,0,0,0.1)]"
                  cellClassNames={["py-3 pl-2", "py-3 pl-2", "py-3 pr-2"]}
                  renderCell={(columnIndex) => {
                    if (columnIndex <= 1) {
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
                  <TableCell colSpan={3} className="py-12 text-center text-sm text-destructive">
                    {error instanceof Error ? error.message : "Failed to load taxes"}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && taxes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-12 text-center text-sm text-muted-foreground">
                    No taxes found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && taxes.map((tax) => (
                <TableRow
                  key={tax.id}
                  className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                >
                  <TableCell className="py-3 pl-2 text-sm font-medium text-[#0a0a0a]">
                    {tax.name}
                  </TableCell>
                  <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                    {tax.percentage}%
                  </TableCell>
                  <TableCell className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tax.id)}
                        className="size-8 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Pencil className="size-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tax.id)}
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
        </div>

        <p className="mt-5 ml-1 text-sm italic text-[#737373]">
          Note: One tax type per store, applied after discount. 0% is allowed.
        </p>
      </div>

      <TaxDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} mode="add" />
      {editingTax && (
        <TaxDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          tax={editingTax}
        />
      )}
      {deletingTax && (
        <DeleteTaxDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          taxName={deletingTax.name}
          onDelete={handleConfirmDelete}
        />
      )}
    </AdminLayout>
  );
}
