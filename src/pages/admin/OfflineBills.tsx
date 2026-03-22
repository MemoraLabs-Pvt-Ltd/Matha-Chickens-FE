import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { ViewBillSheet } from "@/components/admin/bills/ViewBillSheet";
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
import { useOfflineBills } from "@/hooks/useOfflineBills";
import type { PaymentMode } from "@/lib/api/offlineBills";
import { formatPhoneForDisplay } from "@/lib/display/phone";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

const OFFLINE_BILLS_PAGE_LIMIT = 20;

const paymentStyles: Record<PaymentMode, string> = {
  cash: "bg-muted text-foreground",
  upi: "bg-muted text-foreground",
  card: "bg-muted text-foreground",
  other: "bg-muted text-foreground",
};

const paymentLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  other: "Other",
};

export default function OfflineBills() {
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: billsData,
    isLoading,
    isError,
    error,
  } = useOfflineBills({
    page: currentPage,
    limit: OFFLINE_BILLS_PAGE_LIMIT,
    search: searchQuery.trim() || undefined,
  });

  const { data: storesData } = useStores({ limit: 100 });
  const storeNameById = useMemo(
    () => new Map((storesData?.data ?? []).map((store) => [store.id, store.name])),
    [storesData?.data],
  );

  const bills = billsData?.data ?? [];
  const totalPages = Math.max(billsData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = billsData?.pagination?.page ?? currentPage;

  const handleViewBill = (billId: number) => {
    setSelectedBillId(billId);
    setSheetOpen(true);
  };

  return (
    <>
      <ViewBillSheet
        billId={sheetOpen ? selectedBillId : null}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
      <AdminLayout title="Offline Bills">
        <div className="bg-[#fafafa]">
          <p className="text-base text-[#525252] mb-6">
            View all offline bills from store manual billing
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
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Bill ID
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
                    Payment
                  </TableHead>
                  <TableHead className="text-right py-[10px] pr-2 text-sm font-medium text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableBodySkeleton
                    rows={6}
                    columns={10}
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
                      "py-3 pr-2",
                    ]}
                    renderCell={(columnIndex) => {
                      if (columnIndex === 9) {
                        return (
                          <div className="flex items-center justify-end">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        );
                      }

                      if (columnIndex === 8) {
                        return <Skeleton className="h-6 w-16 rounded-lg" />;
                      }

                      return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                    }}
                  />
                )}

                {isError && (
                  <TableRow>
                    <TableCell colSpan={10} className="py-12 text-center text-sm text-destructive">
                      {error instanceof Error ? error.message : "Failed to load offline bills"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && bills.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                      No offline bills found
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  bills.map((bill) => {
                    const createdAt = splitIsoDateTime(bill.created_at);
                    const storeName =
                      storeNameById.get(bill.store_id) ?? `Store #${bill.store_id}`;

                    return (
                      <TableRow
                        key={bill.id}
                        className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                      >
                        <TableCell className="py-3 pl-2 text-sm font-medium text-foreground">
                          #{bill.id}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {storeName}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          <div>{bill.customer_name || "-"}</div>
                          <div className="text-xs text-muted-foreground">
                            {bill.customer_phone ? formatPhoneForDisplay(bill.customer_phone) : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pl-2">
                          <div className="text-sm text-foreground">
                            <p>{createdAt.date}</p>
                            <p className="text-muted-foreground">{createdAt.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {formatInr(bill.subtotal)}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-emerald-600">
                          -{formatInr(bill.discount)}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {formatInr(bill.tax)}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm font-semibold text-foreground">
                          {formatInr(bill.total_amount)}
                        </TableCell>
                        <TableCell className="py-3 pl-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              paymentStyles[bill.payment_mode]
                            }`}
                          >
                            {paymentLabels[bill.payment_mode]}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 pr-2">
                          <div className="flex items-center justify-end">
                            <button
                              className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                              onClick={() => handleViewBill(bill.id)}
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
