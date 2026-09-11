import { useState } from "react";
import { Upload } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
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
import { UploadSalesReportDialog } from "@/components/admin/dialogs/sales-reports/UploadSalesReportDialog";
import { useSalesReportImports } from "@/hooks/useSalesReports";
import { useStores } from "@/hooks/useStores";
import type { SalesReportImportStatus } from "@/lib/api/salesReports";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

const IMPORTS_PAGE_LIMIT = 20;

const statusStyles: Record<SalesReportImportStatus, string> = {
  validating: "bg-muted text-foreground",
  pending_confirmation: "bg-[#fef9c3] text-[#854d0e]",
  processing: "bg-[#dbeafe] text-[#193cb8]",
  completed: "bg-[#dcfce7] text-[#166534]",
  completed_with_errors: "bg-[#ffedd5] text-[#9a3412]",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-[#f3f4f6] text-[#4b5563]",
};

const statusLabels: Record<SalesReportImportStatus, string> = {
  validating: "Validating",
  pending_confirmation: "Pending Confirmation",
  processing: "Processing",
  completed: "Completed",
  completed_with_errors: "Completed (with errors)",
  failed: "Failed",
  cancelled: "Cancelled",
};

export default function SalesReportImport() {
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const {
    data: importsData,
    isLoading,
    isError,
    error,
  } = useSalesReportImports({ page: currentPage, limit: IMPORTS_PAGE_LIMIT });

  const { data: storesData } = useStores({ limit: 100 });
  const storeNameById = new Map((storesData?.data ?? []).map((store) => [store.id, store.name]));

  const imports = importsData?.data ?? [];
  const totalPages = Math.max(importsData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = importsData?.pagination?.page ?? currentPage;

  return (
    <AdminLayout title="Sales Report Import">
      <div className="bg-[#fafafa]">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-[#525252]">
            Upload Excel sales reports to backfill partner sales history
          </p>
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-admin px-4 text-sm font-medium text-white transition-colors hover:bg-admin/90 sm:w-auto"
          >
            <Upload className="size-4" />
            <span>Upload Report</span>
          </Button>
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                  <TableHead className="text-left py-[10px] pl-4 text-sm font-medium text-foreground">
                    File
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Store
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Uploaded
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Total Amount
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Rows (in / skip / fail)
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Status
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
                      "py-3 pl-4",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                    ]}
                    renderCell={(columnIndex) => {
                      if (columnIndex === 5) {
                        return <Skeleton className="h-6 w-24 rounded-lg" />;
                      }
                      return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                    }}
                  />
                )}

                {isError && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-destructive">
                      {error instanceof Error ? error.message : "Failed to load import history"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && imports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      No sales reports uploaded yet
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  imports.map((item) => {
                    const uploaded = splitIsoDateTime(item.created_at);
                    const storeName = storeNameById.get(item.store_id) ?? `Store #${item.store_id}`;

                    return (
                      <TableRow
                        key={item.id}
                        className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                      >
                        <TableCell className="py-3 pl-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                              {item.file_name}
                            </span>
                            {item.report_date_from && item.report_date_to && (
                              <span className="text-xs text-muted-foreground">
                                {item.report_date_from} – {item.report_date_to}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {storeName}
                        </TableCell>
                        <TableCell className="py-3 pl-2">
                          <div className="text-sm text-foreground">
                            <p>{uploaded.date}</p>
                            <p className="text-muted-foreground">{uploaded.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {item.total_amount != null ? formatInr(item.total_amount) : "-"}
                        </TableCell>
                        <TableCell className="py-3 pl-2 text-sm text-foreground">
                          {item.inserted_rows} / {item.skipped_duplicate_rows} /{" "}
                          <span className={item.failed_rows > 0 ? "text-destructive" : undefined}>
                            {item.failed_rows}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 pl-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${statusStyles[item.status]}`}
                          >
                            {statusLabels[item.status]}
                          </span>
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

      <UploadSalesReportDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </AdminLayout>
  );
}
