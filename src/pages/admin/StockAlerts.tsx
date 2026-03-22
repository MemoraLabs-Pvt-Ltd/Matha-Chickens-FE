import { useMemo, useState } from "react";
import { AlertTriangle, Info, PackageX, Search, Store } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/usePagination";
import { useUnavailableStocks } from "@/hooks/useStoreItemUnavailability";
import type { ItemAvailability } from "@/lib/api/storeItemUnavailability";

type AvailabilityFilter = "all" | "low_stock" | "out_of_stock";

function availabilityAlertLabel(a: ItemAvailability): string {
  switch (a) {
    case "low_stock":
      return "Low stock";
    case "out_of_stock":
      return "Out of stock";
    case "available":
      return "In stock";
    default: {
      const _x: never = a;
      return _x;
    }
  }
}

function availabilityAlertClass(a: ItemAvailability): string {
  switch (a) {
    case "low_stock":
      return "bg-[#ffedd5] text-[#9a3412]";
    case "out_of_stock":
      return "bg-[#fee2e2] text-[#991b1b]";
    case "available":
      return "bg-[#dcfce7] text-[#166534]";
    default: {
      const _x: never = a;
      return _x;
    }
  }
}

export default function StockAlerts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");

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

  const filteredEntries = useMemo(() => {
    if (availabilityFilter === "all") return entries;
    return entries.filter((e) => e.availability === availabilityFilter);
  }, [entries, availabilityFilter]);

  const { currentPage, setCurrentPage, totalPages, currentItems, getPageNumbers } =
    usePagination(filteredEntries, { itemsPerPage: 10 });

  const counts = useMemo(() => {
    let low = 0;
    let out = 0;
    for (const e of entries) {
      if (e.availability === "low_stock") low += 1;
      else if (e.availability === "out_of_stock") out += 1;
    }
    return { low, out };
  }, [entries]);

  const stats = useMemo(() => {
    return {
      uniqueItems: new Set(filteredEntries.map((entry) => entry.item.id)).size,
      uniqueStores: new Set(filteredEntries.map((entry) => entry.store.id)).size,
    };
  }, [filteredEntries]);

  return (
    <AdminLayout title="Stock alerts">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-foreground" />
          <p>
            This list only includes store–item pairs marked{" "}
            <span className="font-medium text-foreground">low stock</span> or{" "}
            <span className="font-medium text-foreground">out of stock</span>. Items
            still <span className="font-medium text-foreground">in stock</span> do not
            appear here.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-[14px] border-2 border-orange-200 bg-orange-50 p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#525252]">Low stock</p>
                <AlertTriangle className="size-5 text-[#c2410c]" />
              </div>
              <p className="text-3xl font-bold text-[#c2410c]">{counts.low}</p>
              <p className="mt-1 text-xs text-[#525252]">Store–item pairs</p>
            </div>
          </div>

          <div className="rounded-[14px] border-2 border-red-200 bg-red-50 p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#525252]">Out of stock</p>
                <PackageX className="size-5 text-[#b91c1c]" />
              </div>
              <p className="text-3xl font-bold text-[#b91c1c]">{counts.out}</p>
              <p className="mt-1 text-xs text-[#525252]">Store–item pairs</p>
            </div>
          </div>

          <div className="rounded-[14px] border-2 border-orange-200/80 bg-orange-50/80 p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#525252]">Affected items</p>
                <PackageX className="size-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#c2410c]">{stats.uniqueItems}</p>
              <p className="mt-1 text-xs text-[#525252]">Unique items (current filter)</p>
            </div>
          </div>

          <div className="rounded-[14px] border-2 border-blue-200 bg-blue-50 p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-[#525252]">Affected stores</p>
                <Store className="size-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#1d4ed8]">{stats.uniqueStores}</p>
              <p className="mt-1 text-xs text-[#525252]">Stores (current filter)</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative max-w-md flex-1">
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
          <div className="flex flex-col gap-1.5 sm:w-56">
            <span className="text-xs font-medium text-muted-foreground">Status</span>
            <Select
              value={availabilityFilter}
              onValueChange={(v) => {
                setAvailabilityFilter(v as AvailabilityFilter);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 rounded-lg border border-border bg-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All alerts (low + out)</SelectItem>
                <SelectItem value="low_stock">Low stock only</SelectItem>
                <SelectItem value="out_of_stock">Out of stock only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-white">
          <div className="border-b border-[rgba(0,0,0,0.1)] px-6 py-4">
            <h3 className="text-base font-medium text-[#0a0a0a]">
              Store availability overview
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
                      : "Failed to load stock alert data"}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && filteredEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    {entries.length === 0
                      ? "No low-stock or out-of-stock entries found"
                      : "No entries match the current filter"}
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
                      <span
                        className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium ${availabilityAlertClass(entry.availability)}`}
                      >
                        {availabilityAlertLabel(entry.availability)}
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
