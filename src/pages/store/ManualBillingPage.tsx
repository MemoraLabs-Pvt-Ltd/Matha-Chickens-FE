import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  FileText,
  Receipt,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { StoreLayout } from "@/components/common/layout";
import { BillDetailsSheet } from "./BillDetailsSheet";
import { useItems } from "@/hooks/useItems";
import { useOfflineBills, useCreateOfflineBill } from "@/hooks/useOfflineBills";
import type { PaymentMode } from "@/lib/api/offlineBills";

interface CartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

const COMPLETED_BILLS_LIMIT = 12;
const ITEMS_PAGE_LIMIT = 10;
const EXTRA_DISCOUNT_PERCENT = 0;
const EXTRA_TAX_PERCENT = 0;

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page += 1) pages.push(page);
    return pages;
  }

  pages.push(1);
  if (currentPage > 3) pages.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) pages.push(page);

  if (currentPage < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateTime(value: string): { date: string; time: string } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { date: "-", time: "-" };
  }

  return {
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

const paymentModeLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  cheque: "Cheque",
  other: "Other",
};

export default function ManualBillingPage() {
  const [activeTab, setActiveTab] = useState<"completed" | "create">("create");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode | "">("");
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(1);

  const {
    data: itemsData,
    isLoading: itemsLoading,
    isError: itemsError,
    error: itemsErrorMessage,
  } = useItems({
    page: itemsPage,
    limit: ITEMS_PAGE_LIMIT,
    search: searchQuery.trim() || undefined,
  });

  const {
    data: completedBillsData,
    isLoading: billsLoading,
    isError: billsError,
    error: billsErrorMessage,
  } = useOfflineBills({
    page: currentPage,
    limit: COMPLETED_BILLS_LIMIT,
  });

  const createOfflineBillMutation = useCreateOfflineBill();

  const menuItems = itemsData?.data ?? [];
  const completedBills = completedBillsData?.data ?? [];
  const totalCompletedBills =
    completedBillsData?.pagination?.totalData ?? completedBills.length;
  const billsTotalPages = Math.max(completedBillsData?.pagination?.totalPages ?? 1, 1);
  const safeBillsCurrentPage = completedBillsData?.pagination?.page ?? currentPage;
  const itemsTotalPages = Math.max(itemsData?.pagination?.totalPages ?? 1, 1);
  const safeItemsPage = itemsData?.pagination?.page ?? itemsPage;

  const addToCart = (item: {
    id: number;
    name: string;
    price: number;
    unit: string;
  }) => {
    setCart((previous) => {
      const existing = previous.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return previous.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...previous, { ...item, quantity: 1 }];
    });
  };

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, cartItem) => sum + Number(cartItem.price) * cartItem.quantity,
        0,
      ),
    [cart],
  );

  const discountAmount = (subtotal * EXTRA_DISCOUNT_PERCENT) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * EXTRA_TAX_PERCENT) / 100;
  const estimatedTotal = taxableAmount + taxAmount;

  const handleViewBill = (billId: number) => {
    setSelectedBillId(billId);
    setIsSheetOpen(true);
  };

  const handleCreateBill = async () => {
    if (cart.length === 0 || !paymentMode) return;

    await createOfflineBillMutation.mutateAsync({
      payment_mode: paymentMode,
      items: cart.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,
      })),
      discount_type: "none",
      discount_value: 0,
    });

    setCart([]);
    setPaymentMode("");
    setActiveTab("completed");
    setCurrentPage(1);
  };

  return (
    <StoreLayout title="Manual Billing" disableScroll>
      <div className="flex gap-4 h-full overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="flex-1 flex flex-col h-full overflow-hidden"
        >
          <TabsList className="mb-4 h-10 rounded-full w-auto border border-border/60 bg-[#eceef1] p-1">
            <TabsTrigger
              value="create"
              className="rounded-full px-4 h-8 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground"
            >
              <Receipt className="size-4 mr-2" />
              Create Bill
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-full px-4 h-8  text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground"
            >
              <FileText className="size-4 mr-2" />
              Completed Bills ({totalCompletedBills})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completed" className="flex-1 min-h-0 mt-0">
            <Card className="border-border h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium text-foreground">
                  Completed Bills History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
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
                        Items
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
                    {billsLoading &&
                      Array.from({ length: 6 }).map((_, index) => (
                        <TableRow key={index} className="border-b border-border">
                          <TableCell className="py-4 pl-4">
                            <Skeleton className="h-4 w-20 rounded-lg" />
                          </TableCell>
                          <TableCell className="py-4 pl-4">
                            <Skeleton className="h-4 w-28 rounded-lg" />
                          </TableCell>
                          <TableCell className="py-4 pl-4">
                            <Skeleton className="h-4 w-16 rounded-lg" />
                          </TableCell>
                          <TableCell className="py-4 pl-4">
                            <Skeleton className="h-4 w-20 rounded-lg" />
                          </TableCell>
                          <TableCell className="py-4 pl-4">
                            <Skeleton className="h-6 w-16 rounded-lg" />
                          </TableCell>
                          <TableCell className="py-4 pr-4 text-right">
                            <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))}

                    {billsError && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center text-sm text-destructive">
                          {billsErrorMessage instanceof Error
                            ? billsErrorMessage.message
                            : "Failed to load completed bills"}
                        </TableCell>
                      </TableRow>
                    )}

                    {!billsLoading && !billsError && completedBills.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                          No completed bills found
                        </TableCell>
                      </TableRow>
                    )}

                    {!billsLoading &&
                      !billsError &&
                      completedBills.map((bill) => {
                        const createdAt = formatDateTime(bill.created_at);
                        return (
                          <TableRow
                            key={bill.id}
                            className="border-b border-border"
                          >
                            <TableCell className="py-4 pl-4">
                              <span className="text-sm font-medium text-foreground">
                                #{bill.id}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 pl-4">
                              <div className="text-sm text-foreground">{createdAt.date}</div>
                              <div className="text-xs text-muted-foreground">{createdAt.time}</div>
                            </TableCell>
                            <TableCell className="py-4 pl-4">
                              <span className="text-sm text-muted-foreground">
                                View details
                              </span>
                            </TableCell>
                            <TableCell className="py-4 pl-4">
                              <span className="text-sm font-semibold text-foreground">
                                {formatCurrency(bill.total_amount)}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 pl-4">
                              <span className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs text-foreground">
                                {paymentModeLabels[bill.payment_mode]}
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

                {billsTotalPages >= 1 && (
                  <div className="py-4 px-4 border-t border-border">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((page) => Math.max(1, page - 1))
                            }
                            className={
                              safeBillsCurrentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                        {getPageNumbers(safeBillsCurrentPage, billsTotalPages).map(
                          (page, index) =>
                            page === "ellipsis" ? (
                              <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  isActive={safeBillsCurrentPage === page}
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
                              setCurrentPage((page) =>
                                Math.min(billsTotalPages, page + 1),
                              )
                            }
                            className={
                              safeBillsCurrentPage === billsTotalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="create"
            className="flex-1 min-h-0 mt-0 flex gap-4"
          >
            <div className="bg-card border border-border rounded-xl w-full max-w-[519px] overflow-hidden flex flex-col">
              <div className="px-6 pt-5 pb-3 shrink-0">
                <h2 className="text-base font-medium text-foreground">
                  Select Items
                </h2>
              </div>

              <div className="px-6 pb-4 flex-1 min-h-0 flex flex-col">
                <div className="flex gap-3 mb-3 shrink-0">
                  <Button
                    variant="secondary"
                    className="h-9 px-3 rounded-lg gap-2"
                    disabled
                  >
                    All Categories
                    <ChevronDown className="size-4" />
                  </Button>
                  <div className="flex-1 bg-muted rounded-lg px-3 flex items-center h-9">
                    <Search className="size-4 text-muted-foreground mr-2" />
                    <Input
                      className="border-0 bg-transparent p-0 h-auto shadow-none focus-visible:ring-0 text-sm"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setItemsPage(1);
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pr-1">
                  {itemsLoading &&
                    Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-muted rounded-xl px-3 py-3 flex items-center justify-between"
                      >
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-44 rounded-lg" />
                          <Skeleton className="h-3 w-24 rounded-lg" />
                        </div>
                        <Skeleton className="size-8 rounded-lg" />
                      </div>
                    ))}

                  {itemsError && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-3">
                      <p className="text-sm text-destructive">
                        {itemsErrorMessage instanceof Error
                          ? itemsErrorMessage.message
                          : "Failed to load items"}
                      </p>
                    </div>
                  )}

                  {!itemsLoading && !itemsError && menuItems.length === 0 && (
                    <div className="rounded-lg border border-border px-3 py-6 text-center text-sm text-muted-foreground">
                      No items found
                    </div>
                  )}

                  {!itemsLoading &&
                    !itemsError &&
                    menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-muted rounded-xl px-3 py-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-base font-medium text-foreground">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.price)}/{item.unit}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          className="size-8 bg-store hover:bg-store/90 rounded-lg"
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              name: item.name,
                              price: Number(item.price),
                              unit: item.unit,
                            })
                          }
                        >
                          <Plus className="size-4 text-white" />
                        </Button>
                      </div>
                    ))}
                </div>

                {itemsTotalPages >= 1 && (
                  <div className="pt-3 border-t border-border mt-3">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setItemsPage((page) => Math.max(1, page - 1))
                            }
                            className={
                              safeItemsPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                        {getPageNumbers(safeItemsPage, itemsTotalPages).map(
                          (page, index) =>
                            page === "ellipsis" ? (
                              <PaginationItem key={`items-ellipsis-${index}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : (
                              <PaginationItem key={`items-${page}`}>
                                <PaginationLink
                                  isActive={safeItemsPage === page}
                                  onClick={() => setItemsPage(page)}
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
                              setItemsPage((page) =>
                                Math.min(itemsTotalPages, page + 1),
                              )
                            }
                            className={
                              safeItemsPage === itemsTotalPages
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

            <div className="flex flex-col gap-4 w-full max-w-[519px] h-full overflow-hidden">
              <div className="bg-card border border-border rounded-xl px-6 py-5 overflow-hidden flex flex-col">
                <h2 className="text-base font-medium text-foreground mb-4 shrink-0">
                  Bill Details
                </h2>
                {cart.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-base text-muted-foreground">
                      No items added yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Select items from the left panel
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.price)} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-xl px-6 py-5 overflow-hidden flex flex-col">
                <h2 className="text-base font-medium text-foreground mb-4 shrink-0">
                  Bill Summary
                </h2>

                <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Subtotal:</span>
                    <span className="text-sm text-foreground">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">
                      Extra Discount ({EXTRA_DISCOUNT_PERCENT}%):
                    </span>
                    <span className="text-sm text-[#00a63e]">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">
                      Extra Tax ({EXTRA_TAX_PERCENT}%):
                    </span>
                    <span className="text-sm text-foreground">
                      {formatCurrency(taxAmount)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-base font-bold text-foreground">
                      Estimated Total:
                    </span>
                    <span className="text-base font-bold text-foreground">
                      {formatCurrency(estimatedTotal)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Payment Mode
                    </p>
                    <Select
                      value={paymentMode}
                      onValueChange={(value) => setPaymentMode(value as PaymentMode)}
                    >
                      <SelectTrigger className="w-full bg-muted border-transparent rounded-lg h-9 text-sm">
                        <SelectValue placeholder="Select Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full h-9 bg-store hover:bg-store/90 rounded-lg text-white mt-4"
                    disabled={
                      cart.length === 0 ||
                      !paymentMode ||
                      createOfflineBillMutation.isPending
                    }
                    onClick={handleCreateBill}
                  >
                    <FileText className="size-4 mr-2" />
                    {createOfflineBillMutation.isPending
                      ? "Saving..."
                      : "Save & Print Bill"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <BillDetailsSheet
          billId={selectedBillId}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      </div>
    </StoreLayout>
  );
}
