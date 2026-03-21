import { useState } from "react";
import { Search } from "lucide-react";
import { StoreLayout } from "@/components/common/layout";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  useStoreItemAvailability,
  useUpdateStoreItemAvailability,
} from "@/hooks/useStoreItemUnavailability";

const AVAILABILITY_PAGE_LIMIT = 20;

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }

  pages.push(1);
  if (currentPage > 3) pages.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);

  return pages;
}

export default function ItemAvailabilityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);

  const {
    data: availabilityData,
    isLoading,
    isError,
    error,
  } = useStoreItemAvailability({
    page: currentPage,
    limit: AVAILABILITY_PAGE_LIMIT,
    search: searchQuery.trim() || undefined,
  });

  const updateAvailabilityMutation = useUpdateStoreItemAvailability();

  const items = availabilityData?.data ?? [];
  const totalPages = Math.max(availabilityData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = availabilityData?.pagination?.page ?? currentPage;

  const toggleAvailability = async (itemId: number, nextAvailable: boolean) => {
    setPendingItemId(itemId);
    try {
      await updateAvailabilityMutation.mutateAsync({
        available: nextAvailable ? [itemId] : [],
        unavailable: nextAvailable ? [] : [itemId],
      });
    } finally {
      setPendingItemId(null);
    }
  };

  return (
    <StoreLayout title="Item Availability">
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-medium text-foreground">
            Manage item availability for your store
          </h2>
          <p className="text-sm text-muted-foreground italic">
            Items marked as "Out of Stock" will be hidden from customers in the
            mobile app
          </p>
        </div>

        <div className="bg-card border border-border rounded-[10px] p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search item..."
              className="pl-9 bg-muted border-transparent rounded-lg h-9"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Item Name
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Category
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Price
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Availability Status
                </TableHead>
                <TableHead className="text-right py-3 pr-4 text-sm font-medium text-foreground">
                  Toggle
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableBodySkeleton
                  rows={8}
                  columns={5}
                  rowClassName="border-b border-border"
                  cellClassNames={["py-4 pl-4", "py-4 pl-4", "py-4 pl-4", "py-4 pl-4", "py-4 pr-4"]}
                  renderCell={(columnIndex) => {
                    if (columnIndex === 4) {
                      return (
                        <div className="flex justify-end">
                          <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                      );
                    }

                    if (columnIndex === 3) {
                      return <Skeleton className="h-6 w-24 rounded-lg" />;
                    }

                    return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                  }}
                />
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-destructive">
                    {error instanceof Error
                      ? error.message
                      : "Failed to load item availability"}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    No items found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                items.map((item) => {
                  const isToggling =
                    updateAvailabilityMutation.isPending &&
                    pendingItemId === item.id;

                  return (
                    <TableRow key={item.id} className="border-b border-border">
                      <TableCell className="py-3 pl-4">
                        <span className="text-sm font-medium text-foreground">
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pl-4">
                        <span className="text-sm text-foreground">
                          {item.category_id ? `Category #${item.category_id}` : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pl-4">
                        <span className="text-sm text-foreground">
                          ₹{Number(item.price).toFixed(2)}/{item.unit}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pl-4">
                        {item.available ? (
                          <span className="inline-flex items-center px-2 py-1 bg-[#dcfce7] rounded text-xs font-medium text-[#016630]">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 bg-[#ffe2e2] rounded text-xs font-medium text-[#9f0712]">
                            Out of Stock
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 pr-4">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-sm text-muted-foreground">
                            {isToggling
                              ? "Updating..."
                              : item.available
                                ? "Available"
                                : "Out of Stock"}
                          </span>
                          <Switch
                            checked={item.available}
                            disabled={isToggling}
                            onCheckedChange={(checked) =>
                              toggleAvailability(item.id, checked)
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        <div className="bg-[#eff6ff] border border-[#bedbff] rounded-[10px] px-4 py-4">
          <p className="text-sm text-[#1c398e]">
            <span className="font-semibold">Note:</span>{" "}
            <span className="font-normal">
              When you mark an item as "Out of Stock", it will immediately
              disappear from the customer app for your store. The item will
              still be visible to Admin and can be made available again by
              toggling the switch.
            </span>
          </p>
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
        )}
      </div>
    </StoreLayout>
  );
}
