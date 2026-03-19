import { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
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

interface Item {
  id: string;
  name: string;
  category: string;
  price: string;
  status: "active" | "inactive";
}

const categories = [
  { id: "1", name: "Broiler Chicken" },
  { id: "2", name: "Country Chicken" },
  { id: "3", name: "Eggs" },
];

const items: Item[] = [
  { id: "1", name: "Fresh Chicken Breast", category: "Broiler Chicken", price: "₹280.00/kg", status: "active" },
  { id: "2", name: "Whole Roast Chicken", category: "Broiler Chicken", price: "₹450.00/kg", status: "active" },
  { id: "3", name: "Crispy Fried Chicken", category: "Broiler Chicken", price: "₹320.00/kg", status: "active" },
  { id: "4", name: "Country Chicken - Whole", category: "Country Chicken", price: "₹550.00/kg", status: "active" },
  { id: "5", name: "Country Chicken - Cut Pieces", category: "Country Chicken", price: "₹580.00/kg", status: "active" },
  { id: "6", name: "Farm Fresh Eggs (12 pcs)", category: "Eggs", price: "₹84.00/dozen", status: "active" },
  { id: "7", name: "Farm Fresh Eggs (30 pcs)", category: "Eggs", price: "₹195.00/dozen", status: "active" },
  { id: "8", name: "Chicken Wings", category: "Broiler Chicken", price: "₹240.00/kg", status: "active" },
  { id: "9", name: "Chicken Drumsticks", category: "Broiler Chicken", price: "₹260.00/kg", status: "active" },
  { id: "10", name: "Chicken Liver", category: "Broiler Chicken", price: "₹150.00/kg", status: "inactive" },
  { id: "11", name: "Chicken Gizzard", category: "Broiler Chicken", price: "₹180.00/kg", status: "active" },
  { id: "12", name: "Tandoori Chicken", category: "Broiler Chicken", price: "₹380.00/kg", status: "active" },
  { id: "13", name: "Chicken Tikka", category: "Broiler Chicken", price: "₹400.00/kg", status: "active" },
  { id: "14", name: "Chicken Keema", category: "Broiler Chicken", price: "₹350.00/kg", status: "active" },
  { id: "15", name: "Chicken Lolipop", category: "Broiler Chicken", price: "₹300.00/kg", status: "active" },
];

export default function ItemManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const { currentPage, setCurrentPage, totalPages, currentItems, getPageNumbers } = usePagination(items);

  const handleEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setEditingItem(item);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setDeletingItem(item);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    console.log("Deleting item:", deletingItem?.id);
    setDeleteDialogOpen(false);
    setDeletingItem(null);
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
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-9 w-[192px] bg-muted border-transparent rounded-lg text-sm font-medium text-foreground">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 w-[192px] bg-muted border-transparent rounded-lg text-sm font-medium text-foreground">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
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
            {currentItems.map((item) => (
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
                  )
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
