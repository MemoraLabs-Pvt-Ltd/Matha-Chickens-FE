import { useMemo, useState } from "react";
import { Filter, Plus } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import { ItemRow } from "@/components/common/dashboard/ItemRow";
import { ItemDialog } from "@/components/admin/dialogs/items/ItemDialog";
import { DeleteItemDialog } from "@/components/admin/dialogs/items/DeleteItemDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import { useCategories } from "@/hooks/useCategories";
import { useDeleteItem, useItems } from "@/hooks/useItems";
import type { Item } from "@/lib/api/items";

interface DisplayItem {
  id: number;
  name: string;
  category: string;
  price: string;
  status: "active" | "inactive";
}

export default function ItemManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const {
    data: itemsData,
    isLoading: isItemsLoading,
    isError: isItemsError,
    error: itemsError,
  } = useItems({ limit: 100 });
  const { data: categoriesData } = useCategories({ limit: 100 });
  const deleteItem = useDeleteItem();

  const items = itemsData?.data ?? [];
  const categories = categoriesData?.data ?? [];

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemStatus = item.status === "inactive" ? "inactive" : "active";
      const categoryMatch =
        selectedCategoryId === "all" ||
        String(item.category_id) === selectedCategoryId;
      const statusMatch =
        selectedStatus === "all" || itemStatus === selectedStatus;
      return categoryMatch && statusMatch;
    });
  }, [items, selectedCategoryId, selectedStatus]);

  const displayItems: DisplayItem[] = useMemo(
    () =>
      filteredItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: categoryNameById.get(item.category_id) ?? `Category #${item.category_id}`,
        price: `₹${item.price.toFixed(2)}/${item.unit || "kg"}`,
        status: item.status === "inactive" ? "inactive" : "active",
      })),
    [filteredItems, categoryNameById],
  );

  const { currentPage, setCurrentPage, totalPages, currentItems, getPageNumbers } =
    usePagination(displayItems);

  const handleEdit = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setEditingItem(item);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setDeletingItem(item);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    deleteItem.mutate(deletingItem.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setDeletingItem(null);
      },
    });
  };

  return (
    <AdminLayout title="Item Management">
      <div className="bg-white border border-text-muted rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-text-muted">
          <p className="text-base text-muted-foreground">
            Manage product items
          </p>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2 h-9 px-4 bg-admin text-white text-sm font-medium rounded-lg hover:bg-admin/90 transition-colors"
          >
            <Plus className="size-4" />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="flex items-center gap-4 px-6 py-4 border-b border-text-muted">
          <Filter className="size-5 text-muted-foreground" />
          <div className="flex gap-3">
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger className="h-9 w-[192px] bg-muted border-transparent rounded-lg text-sm font-medium text-foreground">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 w-[192px] bg-muted border-transparent rounded-lg text-sm font-medium text-foreground">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted border-b border-text-muted">
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Item Name
              </TableHead>
              <TableHead className="text-left py-3 text-sm font-medium text-foreground">
                Category
              </TableHead>
              <TableHead className="text-left py-3 text-sm font-medium text-foreground">
                Price
              </TableHead>
              <TableHead className="text-left py-3 text-sm font-medium text-foreground">
                Status
              </TableHead>
              <TableHead className="text-right py-3 pr-6 text-sm font-medium text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isItemsLoading && (
              <TableBodySkeleton
                rows={6}
                columns={5}
                rowClassName="border-[rgba(0,0,0,0.1)]"
                cellClassNames={["py-3 pl-6", "py-3", "py-3", "py-3", "py-3 pr-6"]}
                renderCell={(columnIndex) => {
                  if (columnIndex <= 2) {
                    return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                  }

                  if (columnIndex === 3) {
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

            {isItemsError && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-destructive">
                  {itemsError instanceof Error ? itemsError.message : "Failed to load items"}
                </TableCell>
              </TableRow>
            )}

            {!isItemsLoading && !isItemsError && displayItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            )}

            {!isItemsLoading &&
              !isItemsError &&
              currentItems.map((item) => (
                <ItemRow
                  key={item.id}
                  {...item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
          </TableBody>
        </Table>

        <div className="px-6 py-4 border-t border-text-muted flex items-center justify-between">
          <p className="text-sm text-muted-foreground italic">
            Note: Items are available unless store marks them Out of Stock.
          </p>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {getPageNumbers().map((page, index) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <ItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
        categories={categories}
      />
      {editingItem && (
        <ItemDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          item={editingItem}
          categories={categories}
        />
      )}
      {deletingItem && (
        <DeleteItemDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          itemName={deletingItem.name}
          onDelete={handleConfirmDelete}
        />
      )}
    </AdminLayout>
  );
}
