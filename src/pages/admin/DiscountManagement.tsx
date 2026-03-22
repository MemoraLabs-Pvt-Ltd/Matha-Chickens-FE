import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import { DiscountDialog } from "@/components/admin/dialogs/discounts/DiscountDialog";
import { DeleteDiscountDialog } from "@/components/admin/dialogs/discounts/DeleteDiscountDialog";
import { useDeleteDiscount, useDiscounts } from "@/hooks/useDiscounts";
import type { Discount, DiscountStatus, DiscountType } from "@/lib/api/discounts";
import { formatDateRange } from "@/lib/display/formatting";

const typeLabels: Record<DiscountType, string> = {
  none: "None",
  percentage: "Percentage",
  flat: "Flat",
};

const statusStyles: Record<DiscountStatus, string> = {
  active: "bg-[#dcfce7] text-[#166534]",
  inactive: "bg-[#f4f4f5] text-[#52525b]",
};

export default function DiscountManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [deletingDiscount, setDeletingDiscount] = useState<Discount | null>(null);

  const { data, isLoading, isError, error } = useDiscounts({
    limit: 100,
    search: searchQuery.trim() || undefined,
  });
  const deleteDiscount = useDeleteDiscount();

  const discounts = useMemo(() => data?.data ?? [], [data?.data]);

  const handleEdit = (id: number) => {
    const discount = discounts.find((value) => value.id === id);
    if (discount) {
      setEditingDiscount(discount);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const discount = discounts.find((value) => value.id === id);
    if (discount) {
      setDeletingDiscount(discount);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingDiscount) return;

    deleteDiscount.mutate(deletingDiscount.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setDeletingDiscount(null);
      },
    });
  };

  return (
    <AdminLayout title="Discount Management">
      <div className="bg-[#fafafa]">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-[18px] border-b border-[rgba(0,0,0,0.1)]">
            <p className="text-base text-[#525252]">
              Manage global campaign discounts
            </p>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="flex items-center gap-2 h-9 px-4 bg-admin text-white text-sm font-medium rounded-lg hover:bg-admin/90 transition-colors"
            >
              <Plus className="size-4" />
              <span>Add Discount</span>
            </Button>
          </div>

          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.1)]">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9 bg-[#f3f3f5] border-transparent rounded-lg h-9"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Title
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Type
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Value
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Active Window
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Status
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
                  columns={6}
                  rowClassName="border-[rgba(0,0,0,0.1)]"
                  cellClassNames={[
                    "py-3 pl-2",
                    "py-3 pl-2",
                    "py-3 pl-2",
                    "py-3 pl-2",
                    "py-3 pl-2",
                    "py-3 pr-2",
                  ]}
                  renderCell={(columnIndex) => {
                    if (columnIndex <= 3) {
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
                    {error instanceof Error ? error.message : "Failed to load discounts"}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && discounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No discounts found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                discounts.map((discount) => (
                  <TableRow
                    key={discount.id}
                    className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                  >
                    <TableCell className="py-3 pl-2 text-sm font-medium text-[#0a0a0a]">
                      <div>{discount.title}</div>
                      {discount.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {discount.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                      {typeLabels[discount.discount_type]}
                    </TableCell>
                    <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                      {discount.discount_type === "percentage"
                        ? `${discount.discount_value}%`
                        : discount.discount_type === "flat"
                          ? `₹${discount.discount_value}`
                          : "0"}
                    </TableCell>
                    <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                      {formatDateRange(discount.start_date, discount.end_date)}
                    </TableCell>
                    <TableCell className="py-3 pl-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${
                          statusStyles[discount.status]
                        }`}
                      >
                        {discount.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(discount.id)}
                          className="size-8 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Pencil className="size-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(discount.id)}
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

      <DiscountDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} mode="add" />
      {editingDiscount && (
        <DiscountDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          discount={editingDiscount}
        />
      )}
      {deletingDiscount && (
        <DeleteDiscountDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          discountTitle={deletingDiscount.title}
          onDelete={handleConfirmDelete}
        />
      )}
    </AdminLayout>
  );
}
