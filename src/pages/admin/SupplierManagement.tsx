import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
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
import { SupplierDialog } from "@/components/admin/dialogs/suppliers/SupplierDialog";
import { DeleteSupplierDialog } from "@/components/admin/dialogs/suppliers/DeleteSupplierDialog";
import { useDeleteSupplier, useSuppliers } from "@/hooks/useSuppliers";
import type { Supplier } from "@/lib/api/suppliers";
import { formatPhoneForDisplay } from "@/lib/display/phone";

export default function SupplierManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(
    null,
  );

  const { data, isLoading, isError, error } = useSuppliers({ limit: 100 });
  const deleteSupplier = useDeleteSupplier();

  const suppliers = data?.data ?? [];

  const handleEdit = (id: number) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      setEditingSupplier(supplier);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      setDeletingSupplier(supplier);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingSupplier) return;

    deleteSupplier.mutate(deletingSupplier.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setDeletingSupplier(null);
      },
    });
  };

  return (
    <AdminLayout title="Supplier Management">
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[rgba(0,0,0,0.1)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-base text-muted-foreground">
            Manage supplier information
          </p>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-admin px-4 text-sm font-medium text-white transition-colors hover:bg-admin/90 sm:w-auto"
          >
            <Plus className="size-4" />
            <span>Add Supplier</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Supplier Name
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Phone Number
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Address
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
                columns={4}
                rowClassName="border-[rgba(0,0,0,0.1)]"
                cellClassNames={["py-3 pl-6", "py-3 pl-6", "py-3 pl-6", "py-3 pr-6"]}
                renderCell={(columnIndex) => {
                  if (columnIndex < 3) {
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
                <TableCell colSpan={4} className="py-12 text-center text-sm text-destructive">
                  {error instanceof Error ? error.message : "Failed to load suppliers"}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && suppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                  No suppliers found
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && suppliers.map((supplier) => (
              <TableRow
                key={supplier.id}
                className="border-b border-[rgba(0,0,0,0.1)]"
              >
                <TableCell className="py-3 pl-6 text-sm font-medium text-foreground">
                  {supplier.name}
                </TableCell>
                <TableCell className="py-3 pl-6 text-sm text-foreground">
                  {formatPhoneForDisplay(supplier.phone_number)}
                </TableCell>
                <TableCell className="py-3 pl-6 text-sm text-foreground">
                  {supplier.address}
                </TableCell>
                <TableCell className="py-3 pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(supplier.id)}
                      className="size-8 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Pencil className="size-4 text-[#525252]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(supplier.id)}
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

      <SupplierDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />
      {editingSupplier && (
        <SupplierDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          supplier={editingSupplier}
        />
      )}
      {deletingSupplier && (
        <DeleteSupplierDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          supplierName={deletingSupplier.name}
          onDelete={handleConfirmDelete}
        />
      )}
    </AdminLayout>
  );
}
