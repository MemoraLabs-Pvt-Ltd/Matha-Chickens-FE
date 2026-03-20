import { useState } from "react";
import { Plus } from "lucide-react";
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
import { CategoryRow } from "@/components/common/dashboard";
import { CategoryDialog } from "@/components/admin/dialogs/categories/CategoryDialog";
import { DeleteCategoryDialog } from "@/components/admin/dialogs/categories/DeleteCategoryDialog";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { type Category } from "@/lib/api/categories";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";

export default function CategoryManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const { data, isLoading, isError, error } = useCategories({ limit: 100 });
  const deleteCategory = useDeleteCategory();

  const categories = data?.data ?? [];

  const handleEdit = (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setEditingCategory(category);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setDeletingCategory(category);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    deleteCategory.mutate(deletingCategory.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setDeletingCategory(null);
      },
    });
  };

  return (
    <AdminLayout title="Category Management">
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.1)]">
          <p className="text-base text-muted-foreground">
            Manage product categories
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 h-9 px-4 bg-admin text-white text-sm font-medium rounded-lg hover:bg-admin/90 transition-colors"
          >
            <Plus className="size-4" />
            <span>Add Category</span>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafa] border-b border-[rgba(0,0,0,0.1)]">
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-primary">
                Category Name
              </TableHead>
              <TableHead className="text-left py-3 text-sm font-medium text-primary">
                Status
              </TableHead>
              <TableHead className="text-right py-3 pr-6 text-sm font-medium text-primary">
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
                cellClassNames={["py-3 pl-6", "py-3", "py-3 pr-6"]}
                renderCell={(columnIndex) => {
                  if (columnIndex === 0) {
                    return (
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-3/4 rounded-lg" />
                      </div>
                    );
                  }

                  if (columnIndex === 1) {
                    return <Skeleton className="h-6 w-24 rounded-lg" />;
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
                  {error instanceof Error ? error.message : "Failed to load categories"}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-12 text-center text-sm text-muted-foreground">
                  No categories found
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && categories.map((category) => (
              <CategoryRow
                key={category.id}
                {...category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode="add"
      />
      {editingCategory && (
        <CategoryDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          category={editingCategory}
        />
      )}
      {deletingCategory && (
        <DeleteCategoryDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          categoryName={deletingCategory.name}
          onDelete={handleConfirmDelete}
        />
      )}
    </AdminLayout>
  );
}
