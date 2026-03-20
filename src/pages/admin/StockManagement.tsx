import { useEffect, useMemo, useState } from "react";
import { formatCreatedAt, exportReceiptsToCSV } from "@/lib/csv";
import {
  Plus,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
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
import { StockReceiptDialog } from "@/components/admin/dialogs/stock/StockReceiptDialog";
import { DeleteStockReceiptDialog } from "@/components/admin/dialogs/stock/DeleteStockReceiptDialog";
import { useItems } from "@/hooks/useItems";
import {
  useDeleteStockReceipt,
  useStockReceipts,
} from "@/hooks/useStockReceipts";
import { useSuppliers } from "@/hooks/useSuppliers";
import type { StockReceipt } from "@/lib/api/stockReceipts";

const STOCK_PAGE_LIMIT = 20;

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }
  return pages;
}

export default function StockManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [currentTimeMs, setCurrentTimeMs] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<StockReceipt | null>(
    null,
  );
  const [deletingReceipt, setDeletingReceipt] = useState<StockReceipt | null>(
    null,
  );

  const {
    data: stockReceiptsData,
    isLoading,
    isError,
    error,
  } = useStockReceipts({
    page: currentPage,
    limit: STOCK_PAGE_LIMIT,
    search: searchQuery.trim() || undefined,
  });
  const { data: suppliersData } = useSuppliers({ limit: 100 });
  const { data: itemsData } = useItems({ limit: 100 });
  const deleteStockReceipt = useDeleteStockReceipt();

  const receipts = stockReceiptsData?.data ?? [];
  const suppliers = suppliersData?.data ?? [];
  const items = itemsData?.data ?? [];

  const supplierNameById = useMemo(
    () => new Map(suppliers.map((supplier) => [supplier.id, supplier.name])),
    [suppliers],
  );
  const itemNameById = useMemo(
    () => new Map(items.map((item) => [item.id, item.name])),
    [items],
  );

  const filteredReceipts = useMemo(() => {
    if (selectedSupplier === "all") return receipts;

    const supplierId = Number(selectedSupplier);
    if (!Number.isFinite(supplierId)) return receipts;

    return receipts.filter((receipt) => receipt.supplier_id === supplierId);
  }, [receipts, selectedSupplier]);

  const totalReceipts =
    selectedSupplier === "all"
      ? (stockReceiptsData?.pagination?.totalData ?? filteredReceipts.length)
      : filteredReceipts.length;
  const totalQuantity = filteredReceipts.reduce(
    (sum, receipt) => sum + receipt.quantity,
    0,
  );
  const totalValue = filteredReceipts.reduce(
    (sum, receipt) => sum + receipt.quantity * receipt.price_per_unit,
    0,
  );

  useEffect(() => {
    const updateCurrentTime = () => setCurrentTimeMs(Date.now());

    updateCurrentTime();
    const timer = window.setInterval(updateCurrentTime, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const recentReceipts = filteredReceipts.filter((receipt) => {
    if (currentTimeMs === null) return false;
    const createdAt = new Date(receipt.created_at).getTime();
    if (!Number.isFinite(createdAt)) return false;
    return currentTimeMs - createdAt <= 24 * 60 * 60 * 1000;
  }).length;
  const totalPages = Math.max(stockReceiptsData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = stockReceiptsData?.pagination?.page ?? currentPage;

  const handleEdit = (id: number) => {
    const receipt = receipts.find((entry) => entry.id === id);
    if (!receipt) return;
    setEditingReceipt(receipt);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const receipt = receipts.find((entry) => entry.id === id);
    if (!receipt) return;
    setDeletingReceipt(receipt);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingReceipt) return;

    deleteStockReceipt.mutate(deletingReceipt.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setDeletingReceipt(null);
      },
    });
  };

  return (
    <AdminLayout title="Stock Management">
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-base text-muted-foreground">
            Track stock received from suppliers
          </p>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="bg-green-600 hover:bg-green-600/90 text-white rounded-lg h-9 px-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stock Receipt
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-[14px] p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#525252]">
                  Total Receipts
                </p>
                <Package className="w-5 h-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#1447e6]">
                {totalReceipts}
              </p>
              <p className="text-xs text-[#525252] mt-1">All time</p>
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-[14px] p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#525252]">
                  Total Quantity
                </p>
                <TrendingUp className="w-5 h-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#8200db]">
                {totalQuantity.toLocaleString()}
              </p>
              <p className="text-xs text-[#525252] mt-1">Units received</p>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-[14px] p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#525252]">Total Value</p>
                <DollarSign className="w-5 h-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#008236]">
                ₹{Math.round(totalValue).toLocaleString()}
              </p>
              <p className="text-xs text-[#525252] mt-1">Stock value</p>
            </div>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-[14px] p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#525252]">Recent (24h)</p>
                <Calendar className="w-5 h-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#ca3500]">
                {recentReceipts}
              </p>
              <p className="text-xs text-[#525252] mt-1">Last 24 hours</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
              <Input
                placeholder="Search by receipt code or notes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-[#f3f3f5] border-0 rounded-lg h-9"
              />
            </div>

            <Select
              value={selectedSupplier}
              onValueChange={(value) => {
                setSelectedSupplier(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[220px] bg-[#f3f3f5] border-0 rounded-lg h-9">
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={String(supplier.id)}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-border rounded-lg h-9 px-4"
              onClick={() =>
                exportReceiptsToCSV(filteredReceipts, supplierNameById, itemNameById)
              }
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-base font-medium text-[#0a0a0a]">
              Stock Receipt History
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Receipt Code
                </TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Date
                </TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Supplier
                </TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Item
                </TableHead>
                <TableHead className="text-right text-sm font-semibold text-[#404040]">
                  Quantity
                </TableHead>
                <TableHead className="text-right text-sm font-semibold text-[#404040]">
                  Price/Unit
                </TableHead>
                <TableHead className="text-right text-sm font-semibold text-[#404040]">
                  Total
                </TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Notes
                </TableHead>
                <TableHead className="text-right text-sm font-semibold text-[#404040]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableBodySkeleton
                  rows={6}
                  columns={9}
                  rowClassName="border-[rgba(0,0,0,0.1)]"
                  cellClassNames={[
                    "py-4",
                    "py-4",
                    "py-4",
                    "py-4",
                    "py-4 text-right",
                    "py-4 text-right",
                    "py-4 text-right",
                    "py-4",
                    "py-4 text-right",
                  ]}
                  renderCell={(columnIndex) => {
                    if (columnIndex < 8) {
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
                  <TableCell
                    colSpan={9}
                    className="py-12 text-center text-sm text-destructive"
                  >
                    {error instanceof Error
                      ? error.message
                      : "Failed to load stock receipts"}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && filteredReceipts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No stock receipts found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                filteredReceipts.map((receipt) => {
                  const supplierName =
                    supplierNameById.get(receipt.supplier_id) ??
                    `Supplier #${receipt.supplier_id}`;
                  const itemName =
                    itemNameById.get(receipt.item_id) ??
                    `Item #${receipt.item_id}`;
                  const createdAt = formatCreatedAt(receipt.created_at);

                  return (
                    <TableRow
                      key={receipt.id}
                      className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                    >
                      <TableCell className="py-4">
                        <span className="font-mono font-bold text-[#155dfc] text-sm">
                          {receipt.receipt_code}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#171717]">
                            {createdAt.date}
                          </span>
                          <span className="text-xs text-[#737373]">
                            {createdAt.time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-medium text-[#171717]">
                          {supplierName}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-medium text-[#171717]">
                          {itemName}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="text-sm font-semibold text-[#8200db]">
                          {receipt.quantity} {receipt.unit}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="text-sm text-[#404040]">
                          ₹{receipt.price_per_unit.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="text-sm font-bold text-[#008236]">
                          ₹
                          {Math.round(
                            receipt.quantity * receipt.price_per_unit,
                          ).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm text-[#525252]">
                          {receipt.notes || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(receipt.id)}
                            className="size-8 rounded-lg hover:bg-muted transition-colors"
                          >
                            <Pencil className="size-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(receipt.id)}
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
                  {getPageNumbers(safeCurrentPage, totalPages).map((page, index) =>
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
      </div>

      <StockReceiptDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
        suppliers={suppliers}
        items={items}
      />

      {editingReceipt && (
        <StockReceiptDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingReceipt(null);
          }}
          mode="edit"
          receipt={editingReceipt}
          suppliers={suppliers}
          items={items}
        />
      )}

      {deletingReceipt && (
        <DeleteStockReceiptDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) setDeletingReceipt(null);
          }}
          receiptCode={deletingReceipt.receipt_code}
          onDelete={handleConfirmDelete}
          isPending={deleteStockReceipt.isPending}
        />
      )}
    </AdminLayout>
  );
}
