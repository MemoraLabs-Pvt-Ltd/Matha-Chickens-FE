import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import { StoreDialog } from "@/components/admin/dialogs/stores/StoreDialog";
import { DeleteStoreDialog } from "@/components/admin/dialogs/stores/DeleteStoreDialog";
import { useDeleteStore, useStores } from "@/hooks/useStores";
import type { Store } from "@/lib/api/stores";
import { formatPhoneForDisplay } from "@/lib/display/phone";

export default function StoreManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStore, setDeletingStore] = useState<Store | null>(null);

  const { data, isLoading, isError, error } = useStores({ limit: 100 });
  const deleteStore = useDeleteStore();

  const stores = data?.data ?? [];

  const handleEdit = (id: number) => {
    const store = stores.find((s) => s.id === id);
    if (store) {
      setEditingStore(store);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const store = stores.find((s) => s.id === id);
    if (store) {
      setDeletingStore(store);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingStore) return;

    deleteStore.mutate(deletingStore.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setDeletingStore(null);
      },
    });
  };

  return (
    <AdminLayout title="Store Management">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="text-base text-muted-foreground">
            Manage store locations and configuration
          </p>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2 h-9 px-4 bg-admin text-primary-foreground text-sm font-medium rounded-lg hover:bg-admin/90 transition-colors"
          >
            <Plus className="size-4" />
            <span>Create Store</span>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Store Name
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Phone
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Discount
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Tax
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Status
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
                  "py-3 pl-6",
                  "py-3 pl-6",
                  "py-3 pl-6",
                  "py-3 pr-6",
                ]}
                renderCell={(columnIndex) => {
                  if (columnIndex === 0) {
                    return (
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-2/3 rounded-lg" />
                        <Skeleton className="h-3 w-4/5 rounded-lg" />
                      </div>
                    );
                  }

                  if (columnIndex >= 1 && columnIndex <= 3) {
                    return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                  }

                  if (columnIndex === 4) {
                    return <Skeleton className="h-6 w-20 rounded-lg" />;
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
                  {error instanceof Error ? error.message : "Failed to load stores"}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && stores.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  No stores found
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && stores.map((store) => {
              const isActive = store.status !== "inactive";

              return (
                <TableRow key={store.id} className="border-b border-border">
                  <TableCell className="py-3 pl-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {store.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {store.address}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 pl-6 text-sm text-foreground">
                    {formatPhoneForDisplay(store.phone)}
                  </TableCell>

                  <TableCell className="py-3 pl-6 text-sm text-foreground">
                    {store.enable_discount
                      ? `${store.discount_percent}%`
                      : "No Discount"}
                  </TableCell>

                  <TableCell className="py-3 pl-6 text-sm text-foreground">
                    {store.is_tax_applicable ? "Applicable" : "Not Applicable"}
                  </TableCell>

                  <TableCell className="py-3 pl-6">
                    <Badge
                      className={
                        isActive
                          ? "bg-[#dcfce7] text-[#016630] border-transparent"
                          : "bg-[#ffe2e2] text-[#c10007] border-transparent"
                      }
                    >
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(store.id)}
                        className="size-8 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Pencil className="size-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(store.id)}
                        className="size-8 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <StoreDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />

      {editingStore && (
        <StoreDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingStore(null);
          }}
          mode="edit"
          store={editingStore}
        />
      )}

      {deletingStore && (
        <DeleteStoreDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          storeName={deletingStore.name}
          onDelete={handleConfirmDelete}
        />
      )}
    </AdminLayout>
  );
}
