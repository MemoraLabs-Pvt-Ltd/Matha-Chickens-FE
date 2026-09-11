import { useMemo, useState } from "react";
import { FileText, Minus, Plus, Receipt, Search, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePartners } from "@/hooks/usePartners";
import { useItems } from "@/hooks/useItems";
import { useCreatePartnerSale, usePartnerSales } from "@/hooks/usePartnerSales";
import type { PartnerSalePaymentType } from "@/lib/api/partnerSales";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

const SALES_PAGE_LIMIT = 20;
const ITEMS_PAGE_LIMIT = 10;

const paymentTypeLabels: Record<PartnerSalePaymentType, string> = {
  cash: "Cash",
  card: "Card",
  upi: "UPI",
  cheque: "Cheque",
  other: "Other",
};

function todayDateInputValue(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

interface CartLine {
  itemId: number | null;
  itemName: string;
  unit: string;
  unitPrice: number;
  quantity: number;
}

export default function PartnerSales() {
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");

  // Create-sale form state
  const [partnerId, setPartnerId] = useState<string>("");
  const [saleDate, setSaleDate] = useState(todayDateInputValue());
  const [invoiceNo, setInvoiceNo] = useState("");
  const [paymentType, setPaymentType] = useState<PartnerSalePaymentType | "">("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [itemSearch, setItemSearch] = useState("");
  const [itemsPage, setItemsPage] = useState(1);

  // History state
  const [historyPage, setHistoryPage] = useState(1);

  const { data: partnersData } = usePartners({ limit: 100 });
  const partners = (partnersData?.data ?? []).filter((p) => p.status === "active");

  const {
    data: itemsData,
    isLoading: itemsLoading,
    isError: itemsError,
  } = useItems({ page: itemsPage, limit: ITEMS_PAGE_LIMIT, search: itemSearch.trim() || undefined });
  const catalogItems = itemsData?.data ?? [];
  const itemsTotalPages = Math.max(itemsData?.pagination?.totalPages ?? 1, 1);
  const safeItemsPage = itemsData?.pagination?.page ?? itemsPage;

  const createSale = useCreatePartnerSale();

  const {
    data: salesData,
    isLoading: salesLoading,
    isError: salesError,
    error: salesErrorMessage,
  } = usePartnerSales({ page: historyPage, limit: SALES_PAGE_LIMIT });
  const sales = salesData?.data ?? [];
  const salesTotalPages = Math.max(salesData?.pagination?.totalPages ?? 1, 1);
  const safeSalesPage = salesData?.pagination?.page ?? historyPage;

  const addToCart = (item: { id: number; name: string; unit: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.itemId === item.id);
      if (existing) {
        return prev.map((line) =>
          line.itemId === item.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [
        ...prev,
        { itemId: item.id, itemName: item.name, unit: item.unit, unitPrice: item.price, quantity: 1 },
      ];
    });
  };

  const updateLine = (index: number, patch: Partial<CartLine>) => {
    setCart((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const removeLine = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
    [cart],
  );
  const receivedValue = Number.parseFloat(receivedAmount);
  const safeReceived = Number.isFinite(receivedValue) && receivedValue > 0 ? receivedValue : 0;
  const balanceDue = Math.max(0, totalAmount - safeReceived);

  const canSubmit =
    Boolean(partnerId) && Boolean(saleDate) && cart.length > 0 && !createSale.isPending;

  const resetForm = () => {
    setPartnerId("");
    setSaleDate(todayDateInputValue());
    setInvoiceNo("");
    setPaymentType("");
    setReceivedAmount("");
    setCart([]);
  };

  const handleSave = () => {
    if (!canSubmit) return;

    createSale.mutate(
      {
        partner_id: Number(partnerId),
        sale_date: saleDate,
        invoice_no: invoiceNo.trim() || undefined,
        payment_type: paymentType || undefined,
        received_amount: safeReceived || undefined,
        items: cart.map((line) => ({
          item_id: line.itemId ?? undefined,
          item_name: line.itemName,
          unit: line.unit,
          unit_price: line.unitPrice,
          quantity: line.quantity,
        })),
      },
      {
        onSuccess: () => {
          resetForm();
          setActiveTab("history");
          setHistoryPage(1);
        },
      },
    );
  };

  return (
    <AdminLayout title="Partner Sales">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="mb-4 h-10 rounded-full w-auto border border-border/60 bg-[#eceef1] p-1">
          <TabsTrigger
            value="create"
            className="rounded-full px-4 h-8 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground"
          >
            <Receipt className="size-4 mr-2" />
            New Sale
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-full px-4 h-8 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground"
          >
            <FileText className="size-4 mr-2" />
            Sale History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-0">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left: partner + item picker */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Partner *</Label>
                  <Select value={partnerId} onValueChange={setPartnerId}>
                    <SelectTrigger className="w-full h-9 bg-muted border-transparent rounded-lg text-sm">
                      <SelectValue placeholder="Select a partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map((partner) => (
                        <SelectItem key={partner.id} value={String(partner.id)}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Date *</Label>
                  <Input
                    type="date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="h-9 bg-muted border-transparent rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-medium text-foreground">
                    Invoice No. <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    placeholder="Leave blank to auto-generate"
                    className="h-9 bg-muted border-transparent rounded-lg text-sm"
                  />
                </div>
              </div>

              <h2 className="text-base font-medium text-foreground mb-3">Add Items</h2>
              <div className="flex-1 min-w-0 bg-muted rounded-lg px-3 flex items-center h-9 mb-3">
                <Search className="size-4 text-muted-foreground mr-2" />
                <Input
                  className="border-0 bg-transparent p-0 h-auto min-h-9 shadow-none focus-visible:ring-0 text-sm"
                  placeholder="Search items..."
                  value={itemSearch}
                  onChange={(e) => {
                    setItemSearch(e.target.value);
                    setItemsPage(1);
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                {itemsLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}

                {itemsError && (
                  <p className="text-sm text-destructive py-2">Failed to load items</p>
                )}

                {!itemsLoading && !itemsError && catalogItems.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2 text-center">No items found</p>
                )}

                {!itemsLoading &&
                  !itemsError &&
                  catalogItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-muted rounded-lg px-3 py-2.5 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatInr(Number(item.price))}/{item.unit}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        className="size-8 bg-admin hover:bg-admin/90 rounded-lg"
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            unit: item.unit,
                            price: Number(item.price),
                          })
                        }
                      >
                        <Plus className="size-4 text-white" />
                      </Button>
                    </div>
                  ))}
              </div>

              {itemsTotalPages > 1 && (
                <div className="pt-3 mt-3 border-t border-border">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setItemsPage((p) => Math.max(1, p - 1))}
                          className={safeItemsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setItemsPage((p) => Math.min(itemsTotalPages, p + 1))}
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

            {/* Right: cart + summary */}
            <div className="flex flex-col gap-4">
              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-4 sm:p-6">
                <h2 className="text-base font-medium text-foreground mb-3">Sale Items</h2>
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No items added yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {cart.map((line, index) => (
                      <div
                        key={`${line.itemId ?? "custom"}-${index}`}
                        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {line.itemName}
                          </p>
                          <p className="text-xs text-muted-foreground">{line.unit}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-7 rounded-lg"
                            onClick={() =>
                              updateLine(index, { quantity: Math.max(0.001, line.quantity - 1) })
                            }
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <Input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={line.quantity}
                            onChange={(e) => {
                              const v = Number.parseFloat(e.target.value);
                              if (Number.isFinite(v)) updateLine(index, { quantity: v });
                            }}
                            className="h-7 w-14 rounded-lg border-border bg-background px-1 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-7 rounded-lg"
                            onClick={() => updateLine(index, { quantity: line.quantity + 1 })}
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">₹</span>
                          <Input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={line.unitPrice}
                            onChange={(e) => {
                              const v = Number.parseFloat(e.target.value);
                              if (Number.isFinite(v)) updateLine(index, { unitPrice: v });
                            }}
                            className="h-7 w-16 rounded-lg border-border bg-background px-1 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                        <span className="w-20 shrink-0 text-right text-sm font-medium text-foreground">
                          {formatInr(line.quantity * line.unitPrice)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 rounded-lg hover:bg-destructive/10"
                          onClick={() => removeLine(index)}
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-4 sm:p-6 space-y-3">
                <h2 className="text-base font-medium text-foreground mb-1">Payment</h2>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Payment Type</Label>
                  <Select value={paymentType} onValueChange={(v) => setPaymentType(v as PartnerSalePaymentType)}>
                    <SelectTrigger className="w-full h-9 bg-muted border-transparent rounded-lg text-sm">
                      <SelectValue placeholder="Select payment type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(paymentTypeLabels) as [PartnerSalePaymentType, string][]).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Received Amount <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    placeholder="0"
                    className="h-9 bg-muted border-transparent rounded-lg text-sm"
                  />
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Total Amount:</span>
                    <span className="font-semibold text-foreground">{formatInr(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Received:</span>
                    <span className="text-foreground">{formatInr(safeReceived)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Balance Due:</span>
                    <span className={balanceDue > 0 ? "text-destructive font-medium" : "text-foreground"}>
                      {formatInr(balanceDue)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full h-9 bg-admin hover:bg-admin/90 rounded-lg text-white mt-2"
                  disabled={!canSubmit}
                  onClick={handleSave}
                >
                  {createSale.isPending ? "Saving..." : "Save Sale"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                    <TableHead className="text-left py-[10px] pl-4 text-sm font-medium text-foreground">
                      Invoice
                    </TableHead>
                    <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                      Partner
                    </TableHead>
                    <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                      Total
                    </TableHead>
                    <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                      Received
                    </TableHead>
                    <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                      Balance Due
                    </TableHead>
                    <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                      Payment
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesLoading && (
                    <TableBodySkeleton
                      rows={6}
                      columns={7}
                      rowClassName="border-[rgba(0,0,0,0.1)]"
                      cellClassNames={Array(7).fill("py-3 pl-2")}
                      renderCell={() => <Skeleton className="h-4 w-3/4 rounded-lg" />}
                    />
                  )}

                  {salesError && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-destructive">
                        {salesErrorMessage instanceof Error
                          ? salesErrorMessage.message
                          : "Failed to load sales"}
                      </TableCell>
                    </TableRow>
                  )}

                  {!salesLoading && !salesError && sales.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                        No sales recorded yet
                      </TableCell>
                    </TableRow>
                  )}

                  {!salesLoading &&
                    !salesError &&
                    sales.map((sale) => {
                      const { date } = splitIsoDateTime(sale.sale_date);
                      return (
                        <TableRow key={sale.id} className="border-b border-[rgba(0,0,0,0.1)] last:border-0">
                          <TableCell className="py-3 pl-4 text-sm text-foreground">
                            {sale.invoice_no || `#${sale.id}`}
                          </TableCell>
                          <TableCell className="py-3 pl-2 text-sm text-foreground">
                            {sale.partner_name}
                          </TableCell>
                          <TableCell className="py-3 pl-2 text-sm text-foreground">{date}</TableCell>
                          <TableCell className="py-3 pl-2 text-sm font-medium text-foreground">
                            {formatInr(sale.total_amount)}
                          </TableCell>
                          <TableCell className="py-3 pl-2 text-sm text-foreground">
                            {formatInr(sale.received_amount)}
                          </TableCell>
                          <TableCell className="py-3 pl-2 text-sm">
                            <span className={sale.balance_due > 0 ? "text-destructive" : "text-foreground"}>
                              {formatInr(sale.balance_due)}
                            </span>
                          </TableCell>
                          <TableCell className="py-3 pl-2 text-sm text-foreground">
                            {sale.payment_type ? paymentTypeLabels[sale.payment_type] : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>

            {salesTotalPages > 1 && (
              <div className="py-4 px-4 border-t border-[rgba(0,0,0,0.1)]">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                        className={safeSalesPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {getPaginationPageNumbers(safeSalesPage, salesTotalPages).map((page, index) =>
                      page === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={safeSalesPage === page}
                            onClick={() => setHistoryPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setHistoryPage((p) => Math.min(salesTotalPages, p + 1))}
                        className={
                          safeSalesPage === salesTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
