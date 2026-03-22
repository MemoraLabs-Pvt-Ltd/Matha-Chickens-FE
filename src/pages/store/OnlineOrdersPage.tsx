import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { StoreLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
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
import { useOrders } from "@/hooks/useOrders";
import { OrderDetailsSheet } from "./OrderDetailsSheet";
import type { OrderStatus } from "@/lib/api/orders";
import { formatPhoneForDisplay } from "@/lib/display/phone";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

const ORDERS_PAGE_LIMIT = 20;

const statusStyles: Record<OrderStatus, { bg: string; text: string }> = {
  order_received: { bg: "bg-[#dbeafe]", text: "text-[#193cb8]" },
  dispatched: { bg: "bg-[#fef3c6]", text: "text-[#973c00]" },
  delivered: { bg: "bg-[#dcfce7]", text: "text-[#016630]" },
};

const statusLabels: Record<OrderStatus, string> = {
  order_received: "Order Received",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export default function OnlineOrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | OrderStatus>("all");

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

  const orders = ordersData?.data ?? [];
  const totalPages = Math.max(ordersData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = ordersData?.pagination?.page ?? currentPage;

  const filteredOrders = useMemo(() => {
    if (selectedStatus === "all") return orders;
    return orders.filter((order) => order.status === selectedStatus);
  }, [orders, selectedStatus]);

  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsSheetOpen(true);
  };

  return (
    <StoreLayout title="Online Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by customer name or phone..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-muted border-transparent rounded-lg h-9"
            />
          </div>

          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as "all" | OrderStatus)}
          >
            <SelectTrigger className="w-48 h-9 bg-muted border-transparent rounded-lg">
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

        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Order ID
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Customer
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Phone
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Date & Time
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Total
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right py-3 pr-4 text-sm font-medium text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableBodySkeleton
                  rows={8}
                  columns={7}
                  rowClassName="border-b border-border"
                  cellClassNames={[
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pr-4",
                  ]}
                  renderCell={(columnIndex) => {
                    if (columnIndex === 6) {
                      return (
                        <div className="flex justify-end">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                      );
                    }

                    if (columnIndex === 5) {
                      return <Skeleton className="h-6 w-24 rounded-lg" />;
                    }

                    return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                  }}
                />
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-destructive">
                    {error instanceof Error ? error.message : "Failed to load orders"}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
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
                    <TableRow key={order.id} className="border-b border-border">
                      <TableCell className="py-4 pl-4">
                        <span className="text-sm font-medium text-foreground">
                          #{order.id}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        <span className="text-sm text-foreground">
                          {order.customer_name}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        <span className="text-sm text-foreground">
                          {formatPhoneForDisplay(order.customer_phone)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        <div className="text-sm text-foreground">{createdAt.date}</div>
                        <div className="text-xs text-muted-foreground">{createdAt.time}</div>
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        <span className="text-sm font-semibold text-foreground">
                          {formatInr(order.total_amount)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pr-4 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 hover:bg-muted"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye className="size-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        {totalPages >= 1 && (
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
        )}
      </div>
      <OrderDetailsSheet
        orderId={selectedOrderId}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </StoreLayout>
  );
}
