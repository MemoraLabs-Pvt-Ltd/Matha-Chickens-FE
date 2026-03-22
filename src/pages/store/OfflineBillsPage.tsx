import { StoreLayout } from "@/components/common/layout";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOfflineBills } from "@/hooks/useOfflineBills";
import type { PaymentMode } from "@/lib/api/offlineBills";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";
import { getPaginationPageNumbers } from "@/lib/display/pagination";
import { Eye, Search } from "lucide-react";
import { useState } from "react";
import { BillDetailsSheet } from "./BillDetailsSheet";

const OFFLINE_BILLS_PAGE_LIMIT = 20;

const paymentLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  other: "Other",
};

export default function OfflineBillsPage() {
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
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

  const bills = billsData?.data ?? [];
  const totalPages = Math.max(billsData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = billsData?.pagination?.page ?? currentPage;

  const handleViewBill = (billId: number) => {
    setSelectedBillId(billId);
    setIsSheetOpen(true);
  };

  return (
    <StoreLayout title="Offline Bills History">
      <div className="space-y-6">
        <div className="relative max-w-md">
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

        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Bill Number
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Date & Time
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Subtotal
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Discount
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Tax
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Total
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Payment
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
                  columns={8}
                  rowClassName="border-b border-border"
                  cellClassNames={[
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pl-4",
                    "py-4 pr-4",
                  ]}
                  renderCell={(columnIndex) => {
                    if (columnIndex === 7) {
                      return (
                        <div className="flex justify-end">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                      );
                    }

                    if (columnIndex === 6) {
                      return <Skeleton className="h-6 w-16 rounded-lg" />;
                    }

                    return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                  }}
                />
              )}

              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-sm text-destructive"
                  >
                    {error instanceof Error
                      ? error.message
                      : "Failed to load offline bills"}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && bills.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No offline bills found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                bills.map((bill) => {
                  const createdAt = splitIsoDateTime(bill.created_at);
                  return (
                    <TableRow key={bill.id} className="border-b border-border">
                      <TableCell className="py-4 pl-4">
                        <span className="text-sm font-medium text-foreground">
                          #{bill.id}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        <div className="text-sm text-foreground">
                          {createdAt.date}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {createdAt.time}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 pl-4 text-sm text-foreground">
                        {formatInr(bill.subtotal)}
                      </TableCell>
                      <TableCell className="py-4 pl-4 text-sm text-[#00a63e]">
                        -{formatInr(bill.discount)}
                      </TableCell>
                      <TableCell className="py-4 pl-4 text-sm text-foreground">
                        {formatInr(bill.tax)}
                      </TableCell>
                      <TableCell className="py-4 pl-4 text-sm font-semibold text-foreground">
                        {formatInr(bill.total_amount)}
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        <span className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs text-foreground">
                          {paymentLabels[bill.payment_mode]}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 pr-4 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 hover:bg-muted"
                          onClick={() => handleViewBill(bill.id)}
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
        </div>

        {totalPages >= 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className={
                    safeCurrentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {getPaginationPageNumbers(safeCurrentPage, totalPages).map(
                (page, index) =>
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

      <BillDetailsSheet
        billId={selectedBillId}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        subtitle="Offline bill transaction"
      />
    </StoreLayout>
  );
}
