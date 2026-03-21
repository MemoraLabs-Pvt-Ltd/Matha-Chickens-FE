import { useMemo, useState } from "react";
import { AlertTriangle, PackageX, Search, Store } from "lucide-react";
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
import { usePagination } from "@/hooks/usePagination";
import { useUnavailableStocks } from "@/hooks/useStoreItemUnavailability";

export default function OutOfStockAlerts() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: unavailableStockData,
    isLoading,
    isError,
    error,
  } = useUnavailableStocks({
    limit: 100,
    search: searchQuery.trim() || undefined,
  });

  const entries = unavailableStockData?.data ?? [];
  const { currentPage, setCurrentPage, totalPages, currentItems, getPageNumbers } =
    usePagination(entries, { itemsPerPage: 10 });

  const stats = useMemo(() => {
    return {
      totalEntries: entries.length,
      uniqueItems: new Set(entries.map((entry) => entry.item.id)).size,
      uniqueStores: new Set(entries.map((entry) => entry.store.id)).size,
    };
  }, [entries]);

  return (
    <AdminLayout title="Out of Stock Alerts">
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-[14px] border-2 border-red-200 bg-red-50 p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#525252]">Out of Stock Entries</p>
                <AlertTriangle className="size-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#b91c1c]">{stats.totalEntries}</p>
              <p className="mt-1 text-xs text-[#525252]">Total store-item pairs</p>
            </div>
          </div>

          <div className="rounded-[14px] border-2 border-orange-200 bg-orange-50 p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#525252]">Affected Items</p>
                <PackageX className="size-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#c2410c]">{stats.uniqueItems}</p>
              <p className="mt-1 text-xs text-[#525252]">Unique items unavailable</p>
            </div>
          </div>

          <div className="rounded-[14px] border-2 border-blue-200 bg-blue-50 p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#525252]">Affected Stores</p>
                <Store className="size-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#1d4ed8]">{stats.uniqueStores}</p>
              <p className="mt-1 text-xs text-[#525252]">Stores with unavailable items</p>
            </div>
          </div>
        </div>

        <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#717182]" />
            <Input
              placeholder="Search by item or store..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="h-9 rounded-lg border-0 bg-[#f3f3f5] pl-10"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white">
          <div className="border-b border-[rgba(0,0,0,0.1)] px-6 py-4">
            <h3 className="text-base font-medium text-[#0a0a0a]">
              Store Unavailability Overview
            </h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Item
                </TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Store
                </TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Price
                </TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Unit
                </TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableBodySkeleton
                  rows={8}
                  columns={5}
                  rowClassName="border-[rgba(0,0,0,0.1)]"
                  cellClassNames={["py-4", "py-4", "py-4", "py-4", "py-4"]}
                  renderCell={() => <Skeleton className="h-4 w-3/4 rounded-lg" />}
                />
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-destructive">
                    {error instanceof Error
                      ? error.message
                      : "Failed to load unavailable stock data"}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    No out-of-stock entries found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                currentItems.map((entry) => (
                  <TableRow
                    key={`${entry.store.id}-${entry.item.id}`}
                    className="border-b border-[rgba(0,0,0,0.1)]"
                  >
                    <TableCell className="py-4">
                      <div>
                        <p className="text-sm font-medium text-[#0a0a0a]">{entry.item.name}</p>
                        {entry.item.description && (
                          <p className="text-xs text-muted-foreground">{entry.item.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <p className="text-sm text-[#0a0a0a]">{entry.store.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.store.login_id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-[#0a0a0a]">
                      ₹{entry.item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-[#0a0a0a]">
                      {entry.item.unit}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex items-center rounded-lg bg-[#fee2e2] px-2 py-1 text-xs font-medium text-[#991b1b]">
                        Unavailable
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-end border-t border-[rgba(0,0,0,0.1)] px-6 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      className={
                        currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                      }
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
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      className={
                        currentPage === totalPages
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
