import { StoreLayout } from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useActiveCampaignDiscount } from '@/hooks/useDiscounts';
import { useItems } from '@/hooks/useItems';
import { useCreateOfflineBill, useOfflineBills } from '@/hooks/useOfflineBills';
import { useMyStore } from '@/hooks/useStores';
import type { Item } from '@/lib/api/items';
import type { OfflineBillDetail, PaymentMode } from '@/lib/api/offlineBills';
import {
  computeItemDiscount,
  describeItemDiscountLabel,
} from '@/lib/billing/itemDiscount';
import {
  computeAdditionalDiscount,
  computeCampaignDiscountFromApi,
  computeCartLineDetails,
  computeOfflineBillTotalAmount,
  computeStoreDiscount,
  computeSubtotalAndTaxFromGrossLines,
  computeVendorDiscount,
  isStoreTaxApplicable,
  resolveItemPrice,
} from '@/lib/billing/offlineBillMath';
import { printOfflineBillReceipt } from '@/lib/billing/printOfflineBill';
import { formatInr, splitIsoDateTime } from '@/lib/display/formatting';
import { getPaginationPageNumbers } from '@/lib/display/pagination';
import {
  normalizeIndianPhonePayloadFromLocal,
  sanitizeIndianPhoneLocalInput,
} from '@/lib/display/phone';
import { Eye, FileText, Minus, Plus, Receipt, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BillDetailsSheet } from './BillDetailsSheet';

interface CartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  gstPercent: number;
  discountType: string;
  discountValue: number;
  quantity: number;
}

const COMPLETED_BILLS_LIMIT = 12;
const ITEMS_PAGE_LIMIT = 10;

/** Same defaults as `POST /offline-bills` body (`offlineBillCreateSchema`). */
const CREATE_BILL_BODY = {
  discount_type: 'none' as const,
  discount_value: 0,
};

const paymentModeLabels: Record<PaymentMode, string> = {
  cash: 'Cash',
  upi: 'UPI',
  card: 'Card',
  other: 'Other',
};

export default function ManualBillingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'completed' | 'create'>('create');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode | ''>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
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

  // Needed to price whole birds by their category's avg/min/max price
  // instead of the item's own per-kg rate — see resolveItemPrice.
  const { data: categoriesData } = useCategories({ limit: 100 });
  const categoryById = useMemo(
    () => new Map((categoriesData?.data ?? []).map((c) => [c.id, c])),
    [categoriesData?.data],
  );
  const resolvePrice = (item: Pick<Item, 'price' | 'category_id'>) =>
    resolveItemPrice(Number(item.price), categoryById.get(item.category_id));

  const {
    data: completedBillsData,
    isLoading: billsLoading,
    isError: billsError,
    error: billsErrorMessage,
  } = useOfflineBills({
    page: currentPage,
    limit: COMPLETED_BILLS_LIMIT,
  });

  const { data: myStoreResponse } = useMyStore({
    enabled: user?.role === 'store_owner',
  });

  const { data: activeCampaignResponse } = useActiveCampaignDiscount({
    enabled: user?.role === 'store_owner',
  });

  const createOfflineBillMutation = useCreateOfflineBill();

  const currentStore = myStoreResponse?.data ?? null;

  const menuItems = itemsData?.data ?? [];
  const completedBills = completedBillsData?.data ?? [];
  const totalCompletedBills =
    completedBillsData?.pagination?.totalData ?? completedBills.length;
  const billsTotalPages = Math.max(
    completedBillsData?.pagination?.totalPages ?? 1,
    1,
  );
  const safeBillsCurrentPage =
    completedBillsData?.pagination?.page ?? currentPage;
  const itemsTotalPages = Math.max(itemsData?.pagination?.totalPages ?? 1, 1);
  const safeItemsPage = itemsData?.pagination?.page ?? itemsPage;

  const addToCart = (item: {
    id: number;
    name: string;
    price: number;
    unit: string;
    gstPercent: number;
    discountType: string;
    discountValue: number;
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

  const removeOneFromCart = (itemId: number) => {
    setCart((previous) =>
      previous
        .map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0),
    );
  };

  const setCartQuantity = (itemId: number, quantity: number) => {
    setCart((previous) => {
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return previous.filter((cartItem) => cartItem.id !== itemId);
      }

      const existing = previous.find((cartItem) => cartItem.id === itemId);
      if (existing) {
        return previous.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity } : cartItem,
        );
      }

      const source = menuItems.find((item) => item.id === itemId);
      if (!source) return previous;

      return [
        ...previous,
        {
          id: source.id,
          name: source.name,
          price: resolvePrice(source),
          unit: source.unit,
          gstPercent: Number(source.gst_percent),
          discountType: source.discount_type ?? 'none',
          discountValue: Number(source.discount_value ?? 0),
          quantity,
        },
      ];
    });
  };

  const cartQuantityByItemId = useMemo(
    () =>
      new Map(
        cart.map((cartItem) => [cartItem.id, cartItem.quantity] as const),
      ),
    [cart],
  );

  const lineItems = useMemo(
    () =>
      cart.map((cartItem) => {
        const { discountPerUnit, grossTotal, baseTotal, gstTotal } =
          computeCartLineDetails(
            cartItem.price,
            cartItem.gstPercent,
            cartItem.discountType,
            cartItem.discountValue,
            cartItem.quantity,
          );

        return {
          ...cartItem,
          discountPerUnit,
          grossTotal,
          baseTotal,
          gstTotal,
        };
      }),
    [cart],
  );

  const taxApplicable = isStoreTaxApplicable(currentStore);

  const { subtotal, tax: taxAmount } = useMemo(
    () =>
      computeSubtotalAndTaxFromGrossLines(
        lineItems.map((item) => ({
          grossTotal: item.grossTotal,
          gstPercent: item.gstPercent,
        })),
        taxApplicable,
      ),
    [lineItems, taxApplicable],
  );

  const storeDiscountAmount = computeStoreDiscount(subtotal, currentStore);

  const campaignDiscountAmount = useMemo(
    () =>
      computeCampaignDiscountFromApi(
        subtotal,
        activeCampaignResponse?.data ?? null,
      ),
    [subtotal, activeCampaignResponse?.data],
  );

  const additionalDiscountAmount = useMemo(
    () =>
      computeAdditionalDiscount(
        subtotal,
        CREATE_BILL_BODY.discount_type,
        CREATE_BILL_BODY.discount_value,
      ),
    [subtotal],
  );

  /** Store-owner manual billing: no vendor context (see BE `vendor` on context). */
  const vendorDiscountAmount = computeVendorDiscount(subtotal, null);

  const estimatedTotal = computeOfflineBillTotalAmount(
    subtotal,
    taxAmount,
    storeDiscountAmount,
    campaignDiscountAmount,
    additionalDiscountAmount,
    vendorDiscountAmount,
  );

  const handleViewBill = (billId: number) => {
    setSelectedBillId(billId);
    setIsSheetOpen(true);
  };

  const handleCreateBill = async () => {
    if (cart.length === 0 || !paymentMode) return;

    const nameTrim = customerName.trim();
    const phoneDigits = customerPhone.replace(/\D/g, '').length;
    const phonePayload = normalizeIndianPhonePayloadFromLocal(customerPhone);

    const response = await createOfflineBillMutation.mutateAsync({
      payment_mode: paymentMode,
      items: cart.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,
      })),
      discount_type: CREATE_BILL_BODY.discount_type,
      discount_value: CREATE_BILL_BODY.discount_value,
      ...(nameTrim.length > 0 ? { customer_name: nameTrim } : {}),
      ...(phoneDigits >= 10 && phonePayload
        ? { customer_phone: phonePayload }
        : {}),
    });

    const payload = response.data;
    if (payload?.bill && Array.isArray(payload.bill_items)) {
      const detail: OfflineBillDetail = {
        ...payload.bill,
        bill_items: payload.bill_items,
      };
      if (!printOfflineBillReceipt(detail, { storeName: currentStore?.name })) {
        toast.error('Could not open print. Check browser settings.');
      }
    }

    setCart([]);
    setPaymentMode('');
    setCustomerName('');
    setCustomerPhone('');
    setActiveTab('completed');
    setCurrentPage(1);
  };

  return (
    <StoreLayout title="Manual Billing" disableScroll>
      <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto lg:h-full lg:flex-row lg:overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden lg:h-full"
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
                          <TableRow
                            key={index}
                            className="border-b border-border"
                          >
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
                          <TableCell
                            colSpan={6}
                            className="py-12 text-center text-sm text-destructive"
                          >
                            {billsErrorMessage instanceof Error
                              ? billsErrorMessage.message
                              : 'Failed to load completed bills'}
                          </TableCell>
                        </TableRow>
                      )}

                      {!billsLoading &&
                        !billsError &&
                        completedBills.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="py-12 text-center text-sm text-muted-foreground"
                            >
                              No completed bills found
                            </TableCell>
                          </TableRow>
                        )}

                      {!billsLoading &&
                        !billsError &&
                        completedBills.map((bill) => {
                          const createdAt = splitIsoDateTime(bill.created_at);
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
                                <div className="text-sm text-foreground">
                                  {createdAt.date}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {createdAt.time}
                                </div>
                              </TableCell>
                              <TableCell className="py-4 pl-4">
                                <span className="text-sm text-muted-foreground">
                                  View details
                                </span>
                              </TableCell>
                              <TableCell className="py-4 pl-4">
                                <span className="text-sm font-semibold text-foreground">
                                  {formatInr(bill.total_amount)}
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
                </div>

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
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                        {getPaginationPageNumbers(
                          safeBillsCurrentPage,
                          billsTotalPages,
                        ).map((page, index) =>
                          page === 'ellipsis' ? (
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
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
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
            className="mt-0 flex min-h-0 flex-1 flex-col gap-4 lg:flex-row"
          >
            <div className="flex max-h-[min(70vh,520px)] min-h-[280px] w-full max-w-[519px] flex-col overflow-hidden rounded-xl border border-border bg-card lg:max-h-none lg:min-h-0 lg:flex-1">
              <div className="px-6 pt-5 pb-3 shrink-0">
                <h2 className="text-base font-medium text-foreground">
                  Select Items
                </h2>
              </div>

              <div className="px-6 pb-4 flex-1 min-h-0 flex flex-col">
                <div className="flex gap-3 mb-3 shrink-0">
                  <div className="flex-1 min-w-0 bg-muted rounded-lg px-3 flex items-center h-9">
                    <Search className="size-4 text-muted-foreground mr-2" />
                    <Input
                      className="border-0 bg-transparent p-0 h-auto min-h-9 shadow-none focus-visible:ring-0 text-base"
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
                          : 'Failed to load items'}
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
                    menuItems.map((item) => {
                      const quantityInCart =
                        cartQuantityByItemId.get(item.id) ?? 0;
                      const listPrice = resolvePrice(item);
                      const discPerUnit = computeItemDiscount(
                        listPrice,
                        item.discount_type ?? 'none',
                        Number(item.discount_value ?? 0),
                      );
                      const netPerUnit = listPrice - discPerUnit;
                      const itemDiscLabel = describeItemDiscountLabel(
                        item.discount_type ?? 'none',
                        Number(item.discount_value ?? 0),
                        formatInr,
                      );

                      return (
                        <div
                          key={item.id}
                          className="bg-muted rounded-xl px-3 py-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-base font-medium text-foreground">
                              {item.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {discPerUnit > 0 ? (
                                <>
                                  <span className="line-through opacity-80">
                                    {formatInr(listPrice)}
                                  </span>{' '}
                                  <span className="text-foreground font-medium">
                                    {formatInr(netPerUnit)}
                                  </span>
                                  /{item.unit}
                                  {itemDiscLabel ? (
                                    <span className="text-[#00a63e] ml-1">
                                      ({itemDiscLabel})
                                    </span>
                                  ) : null}
                                </>
                              ) : (
                                <>
                                  {formatInr(listPrice)}/{item.unit}
                                </>
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="size-8 rounded-lg border-border bg-background hover:bg-muted"
                              onClick={() => removeOneFromCart(item.id)}
                              disabled={quantityInCart === 0}
                            >
                              <Minus className="size-4" />
                            </Button>
                            <Input
                              type="number"
                              inputMode="decimal"
                              step="any"
                              value={quantityInCart}
                              onChange={(event) => {
                                const raw = event.target.value;
                                if (raw.trim().length === 0) {
                                  setCartQuantity(item.id, 0);
                                  return;
                                }
                                const parsed = Number.parseFloat(raw);
                                if (!Number.isFinite(parsed)) return;
                                setCartQuantity(item.id, parsed);
                              }}
                              className="h-8 w-14 rounded-lg border-border bg-background px-2 text-center text-sm font-medium text-foreground shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder=""
                              aria-label={`${item.name} quantity`}
                            />
                            <Button
                              size="icon"
                              className="size-8 bg-store hover:bg-store/90 rounded-lg"
                              onClick={() =>
                                addToCart({
                                  id: item.id,
                                  name: item.name,
                                  price: resolvePrice(item),
                                  unit: item.unit,
                                  gstPercent: Number(item.gst_percent),
                                  discountType: item.discount_type ?? 'none',
                                  discountValue: Number(
                                    item.discount_value ?? 0,
                                  ),
                                })
                              }
                            >
                              <Plus className="size-4 text-white" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
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
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                        {getPaginationPageNumbers(
                          safeItemsPage,
                          itemsTotalPages,
                        ).map((page, index) =>
                          page === 'ellipsis' ? (
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
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer'
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </div>

            <div className="flex min-h-0 w-full max-w-[519px] flex-col gap-4 overflow-hidden lg:h-full lg:flex-1">
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
                    {lineItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatInr(item.price - item.discountPerUnit)} x{' '}
                            {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {formatInr(item.grossTotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-xl px-6 py-5 overflow-hidden flex flex-col">
                <h2 className="text-base font-medium text-foreground shrink-0">
                  Bill Summary
                </h2>
                <p className="text-xs text-muted-foreground mt-1 mb-4 shrink-0">
                  Tax inclusive — item list prices include GST
                  {taxApplicable
                    ? '; subtotal is ex-GST and the tax line is the GST portion.'
                    : '; no separate GST charge for this store.'}
                </p>

                <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">
                      Subtotal (ex-GST):
                    </span>
                    <span className="text-sm text-foreground">
                      {formatInr(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">
                      Store Discount (
                      {currentStore?.enable_discount
                        ? `${Number(currentStore.discount_percent)}%`
                        : '0%'}
                      ):
                    </span>
                    <span className="text-sm text-blue-500">
                      -{formatInr(storeDiscountAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 items-start">
                    <span
                      className="text-sm text-foreground min-w-0"
                      title="App-wide discount from admin. If several are active for the same period, the one with the latest start date is used (not per-store)."
                    >
                      Active global discount{' '}
                      {activeCampaignResponse?.data?.discount_value}(
                      {activeCampaignResponse?.data?.discount_type ===
                      'percentage'
                        ? '%'
                        : '₹'}
                      ) :
                    </span>
                    <span className="text-sm text-yellow-500 shrink-0 tabular-nums">
                      -{formatInr(campaignDiscountAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">
                      Additional Discount:
                    </span>
                    <span className="text-sm text-[#00a63e]">
                      -{formatInr(additionalDiscountAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">
                      Tax {taxApplicable ? '' : '(Not Applicable)'}:
                    </span>
                    <span className="text-sm text-foreground">
                      {formatInr(taxAmount)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-base font-bold text-foreground">
                      Estimated Total:
                    </span>
                    <span className="text-base font-bold text-foreground">
                      {formatInr(estimatedTotal)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        Customer{' '}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </p>
                      <div className="flex flex-col gap-2">
                        <Input
                          className="h-auto min-h-10 border border-border bg-muted px-3 py-2.5 text-base leading-normal shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
                          placeholder="Name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          maxLength={255}
                          autoComplete="name"
                        />
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm text-muted-foreground">
                            +91
                          </span>
                          <Input
                            type="tel"
                            autoComplete="tel"
                            placeholder="98765 43210"
                            value={customerPhone}
                            onChange={(e) =>
                              setCustomerPhone(
                                sanitizeIndianPhoneLocalInput(e.target.value),
                              )
                            }
                            className="h-auto min-h-10 border border-border bg-muted py-2.5 pl-12 pr-3 text-base leading-normal shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Payment Mode
                    </p>
                    <Select
                      value={paymentMode}
                      onValueChange={(value) =>
                        setPaymentMode(value as PaymentMode)
                      }
                    >
                      <SelectTrigger className="w-full bg-muted border-transparent rounded-lg h-9 text-sm">
                        <SelectValue placeholder="Select Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
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
                      ? 'Saving...'
                      : 'Save & Print Bill'}
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
          storeName={currentStore?.name}
        />
      </div>
    </StoreLayout>
  );
}
