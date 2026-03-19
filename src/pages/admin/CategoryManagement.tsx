import { useState } from "react";
import { Plus } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CategoryRow } from "@/components/common/dashboard";
import { CategoryDialog } from "@/components/admin/dialogs/categories/CategoryDialog";
import { DeleteCategoryDialog } from "@/components/admin/dialogs/categories/DeleteCategoryDialog";

interface Category {
  id: string;
  name: string;
  status: "active" | "inactive";
}

const categories: Category[] = [
  { id: "1", name: "Broiler Chicken", status: "active" },
  { id: "2", name: "Country Chicken", status: "active" },
  { id: "3", name: "Eggs", status: "active" },
  { id: "4", name: "Processed Products", status: "inactive" },
];

export default function CategoryManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setEditingCategory(category);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setDeletingCategory(category);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    // TODO: Implement API call
    console.log("Deleting category:", deletingCategory?.id);
    setDeleteDialogOpen(false);
    setDeletingCategory(null);
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
            {categories.map((category) => (
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
