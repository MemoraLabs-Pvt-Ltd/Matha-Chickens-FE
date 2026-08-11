import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useStores } from "@/hooks/useStores";
import { useSales } from "@/hooks/useSales";
import type { SaleChannel } from "@/lib/api/sales";
import type { OrderStatus } from "@/lib/api/orders";
import type { PaymentMode } from "@/lib/api/offlineBills";
import { formatPhoneForDisplay } from "@/lib/display/phone";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

const SALES_PAGE_LIMIT = 20;

const channelStyles: Record<SaleChannel, string> = {
  offline: "bg-muted text-foreground",
  online: "bg-[#dbeafe] text-[#193cb8]",
};

const channelLabels: Record<SaleChannel, string> = {
  offline: "Offline Bill",
  online: "Online Order",
};

const paymentLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  other: "Other",
};

const statusLabels: Record<OrderStatus, string> = {
  order_received: "Order Received",
  out_for_delivery: "Out for Delivery",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default function Sales() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: salesData,
    isLoading,
    isError,
    error,
  } = useSales({
    page: currentPage,
    limit: SALES_PAGE_LIMIT,
    search: searchQuery.trim() || undefined,
  });

  const { data: storesData } = useStores({ limit: 100 });
  const storeNameById = useMemo(
    () => new Map((storesData?.data ?? []).map((store) => [store.id, store.name])),
    [storesData?.data],
  );

  const sales = salesData?.data ?? [];
  const totalPages = Math.max(salesData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = salesData?.pagination?.page ?? currentPage;

  return (
    <AdminLayout title="Sales">
      <div className="bg-[#fafafa]">
        <p className="text-base text-[#525252] mb-6">
          All sales across offline bills and online orders in one place
        </p>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] px-4 py-3 mb-6">
          <div className="relative max-w-md">
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
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Channel
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Store
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Customer
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Subtotal
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Discount
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Tax
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Total
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Payment / Status
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
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                    ]}
                    renderCell={(columnIndex) => {
                      if (columnIndex === 0 || columnIndex === 8) {
                        return <Skeleton className="h-6 w-20 rounded-lg" />;
                      }
                      return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                    }}
                  />
                )}

                {isError && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-12 text-center text-sm text-destructive">
                      {error instanceof Error ? error.message : "Failed to load sales"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && sales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                      No sales found
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  sales.map((sale) => {
                    const createdAt = splitIsoDateTime(sale.created_at);
                    const storeName =
                      storeNameById.get(sale.store_id) ?? `Store #${sale.store_id}`;

                    return (
                      <TableRow
                        key={`${sale.channel}-${sale.id}`}
                        className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                      >
                        <TableCell className="py-3 pl-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              channelStyles[sale.channel]
                            }`}
                          >
                            {channelLabels[sale.channel]}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {storeName}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          <div>{sale.customer_name || "-"}</div>
                          <div className="text-xs text-muted-foreground">
                            {sale.customer_phone ? formatPhoneForDisplay(sale.customer_phone) : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pl-2">
                          <div className="text-sm text-foreground">
                            <p>{createdAt.date}</p>
                            <p className="text-muted-foreground">{createdAt.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {formatInr(sale.subtotal)}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-emerald-600">
                          -{formatInr(sale.discount)}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {formatInr(sale.tax)}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm font-semibold text-foreground">
                          {formatInr(sale.total_amount)}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {sale.channel === "offline"
                            ? sale.payment_mode
                              ? paymentLabels[sale.payment_mode]
                              : "-"
                            : sale.status
                              ? statusLabels[sale.status]
                              : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

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
  );
}
