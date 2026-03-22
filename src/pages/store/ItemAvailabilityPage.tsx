import { useState } from "react";
import { Search } from "lucide-react";
import { StoreLayout } from "@/components/common/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { ItemAvailability } from "@/lib/api/storeItemUnavailability";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

const AVAILABILITY_PAGE_LIMIT = 20;

const AVAILABILITY_OPTIONS: { value: ItemAvailability; label: string }[] = [
  { value: "available", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
];

function availabilityBadgeClass(availability: ItemAvailability): string {
  switch (availability) {
    case "available":
      return "bg-[#dcfce7] text-[#016630]";
    case "low_stock":
      return "bg-[#ffedd5] text-[#9a3412]";
    case "out_of_stock":
      return "bg-[#ffe2e2] text-[#9f0712]";
    default: {
      const _exhaustive: never = availability;
      return _exhaustive;
    }
  }
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

  const setItemAvailability = async (itemId: number, availability: ItemAvailability) => {
    setPendingItemId(itemId);
    try {
      await updateAvailabilityMutation.mutateAsync({
        items: [{ item_id: itemId, availability }],
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
            In stock and low stock items appear in the app; out of stock items are hidden from
            customers for your store.
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
                  Status
                </TableHead>
                <TableHead className="text-right py-3 pr-4 text-sm font-medium text-foreground">
                  Availability
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
                          <Skeleton className="h-8 w-[140px] rounded-lg" />
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
                    updateAvailabilityMutation.isPending && pendingItemId === item.id;
                  const label =
                    AVAILABILITY_OPTIONS.find((o) => o.value === item.availability)?.label ??
                    item.availability;

                  return (
                    <TableRow key={item.id} className="border-b border-border">
                      <TableCell className="py-3 pl-4">
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
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
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${availabilityBadgeClass(item.availability)}`}
                        >
                          {label}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pr-4">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-muted-foreground">
                            {isToggling ? "Updating..." : "Change"}
                          </span>
                          <Select
                            value={item.availability}
                            disabled={isToggling}
                            onValueChange={(value) =>
                              setItemAvailability(item.id, value as ItemAvailability)
                            }
                          >
                            <SelectTrigger className="w-[min(100%,10rem)] h-9 ml-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AVAILABILITY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
              Out of stock hides the item from the customer app for your store. Low stock still
              lists the item but signals limited quantity. In stock means fully available.
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
    </StoreLayout>
  );
}
