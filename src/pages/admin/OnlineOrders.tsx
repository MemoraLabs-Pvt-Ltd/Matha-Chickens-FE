import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { ViewOrderSheet } from "@/components/admin/orders/ViewOrderSheet";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
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
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import { useOrders } from "@/hooks/useOrders";
import { useStores } from "@/hooks/useStores";
import type { OrderStatus } from "@/lib/api/orders";
import { formatPhoneForDisplay } from "@/lib/display/phone";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

const ORDERS_PAGE_LIMIT = 20;

const statusStyles: Record<OrderStatus, string> = {
  order_received: "bg-[#dbeafe] text-[#193cb8]",
  dispatched: "bg-[#fef3c6] text-[#973c00]",
  delivered: "bg-[#dcfce7] text-[#016630]",
};

const statusLabels: Record<OrderStatus, string> = {
  order_received: "Order Received",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export default function OnlineOrders() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const {
    data: ordersData,
    isLoading,
    isError,
    error,
  } = useOrders({
    page: currentPage,
    limit: ORDERS_PAGE_LIMIT,
    search: searchQuery.trim() || undefined,
  });

  const { data: storesData } = useStores({ limit: 100 });

  const orders = ordersData?.data ?? [];
  const stores = storesData?.data ?? [];
  const totalPages = Math.max(ordersData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = ordersData?.pagination?.page ?? currentPage;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const storeMatch =
        selectedStore === "all" || String(order.store_id) === selectedStore;
      const statusMatch =
        selectedStatus === "all" || order.status === selectedStatus;
      return storeMatch && statusMatch;
    });
  }, [orders, selectedStore, selectedStatus]);

  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setSheetOpen(true);
  };

  return (
    <>
      <ViewOrderSheet
        orderId={sheetOpen ? selectedOrderId : null}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
      <AdminLayout title="Online Orders">
        <div className="bg-[#fafafa]">
          <p className="text-base text-[#525252] mb-6">
            Monitor and manage online orders from customers
          </p>

          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] px-4 py-3 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name or phone..."
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 bg-[#f3f3f5] border-transparent rounded-lg h-9"
                />
              </div>

              <Select
                value={selectedStore}
                onValueChange={(value) => {
                  setSelectedStore(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[192px] bg-[#f3f3f5] border-transparent rounded-lg h-9 text-sm font-medium text-[#0a0a0a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={String(store.id)}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[192px] bg-[#f3f3f5] border-transparent rounded-lg h-9 text-sm font-medium text-[#0a0a0a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="order_received">Order Received</SelectItem>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Store and status filters apply to current page results.
            </p>
          </div>

          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                    Order ID
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                    Store
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                    Customer
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                    Phone
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                    Total
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
                    columns={8}
                    rowClassName="border-[rgba(0,0,0,0.1)]"
                    cellClassNames={[
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pr-2",
                    ]}
                    renderCell={(columnIndex) => {
                      if (columnIndex === 7) {
                        return (
                          <div className="flex items-center justify-end">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        );
                      }

                      if (columnIndex === 6) {
                        return <Skeleton className="h-6 w-24 rounded-lg" />;
                      }

                      return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                    }}
                  />
                )}

                {isError && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-sm text-destructive">
                      {error instanceof Error ? error.message : "Failed to load orders"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                      {orders.length > 0
                        ? "No matching orders on this page"
                        : "No orders found"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  filteredOrders.map((order) => {
                    const createdAt = splitIsoDateTime(order.created_at);

                    return (
                      <TableRow
                        key={order.id}
                        className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                      >
                        <TableCell className="py-3 pl-2 text-sm font-medium text-[#0a0a0a]">
                          #{order.id}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                          {order.store_name}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                          {order.customer_name}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                          {formatPhoneForDisplay(order.customer_phone)}
                        </TableCell>
                        <TableCell className="py-3 pl-2">
                          <div className="text-sm text-[#0a0a0a]">
                            <p>{createdAt.date}</p>
                            <p className="text-muted-foreground">{createdAt.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm font-semibold text-[#0a0a0a]">
                          {formatInr(order.total_amount)}
                        </TableCell>
                        <TableCell className="py-3 pl-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${
                              statusStyles[order.status]
                            }`}
                          >
                            {statusLabels[order.status]}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 pr-2">
                          <div className="flex items-center justify-end">
                            <button
                              className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                              onClick={() => handleViewOrder(order.id)}
                            >
                              <Eye className="size-4 text-muted-foreground" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="py-4 px-4 border-t border-[rgba(0,0,0,0.1)]">
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
        </div>
      </AdminLayout>
    </>
  );
}
