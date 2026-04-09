import { AdminLayout } from "@/components/common/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ByPaymentRow,
  type ByStoreRow,
  type ByUserRow,
  transformBreakdownByPayment,
  transformBreakdownByStore,
  transformBreakdownByUser,
  useBillingInsights,
} from "@/hooks/useBillingInsights";
import { useStores } from "@/hooks/useStores";
import type {
  BillingInsightsTransaction,
  BillingInsightsSummary,
  PaymentMode,
} from "@/lib/api/billingInsights";
import { getPaginationPageNumbers } from "@/lib/display/pagination";
import { formatInr } from "@/lib/display/formatting";
import { BarChart3, Filter, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PAYMENT_LABEL: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  other: "Other",
};

const paymentBadgeClass: Record<PaymentMode, string> = {
  cash: "bg-emerald-50 text-emerald-900 border-transparent",
  upi: "bg-sky-50 text-sky-900 border-transparent",
  card: "bg-violet-50 text-violet-900 border-transparent",
  other: "bg-muted text-foreground border-transparent",
};

const ALL = "all";
const TRANSACTIONS_LIMIT = 100;
const BREAKDOWN_LIMIT = 100;

function isPaymentMode(value: string | null | undefined): value is PaymentMode {
  if (!value) return false;
  return value in PAYMENT_LABEL;
}

function splitDateTime(dateTime: string): { date: string; time: string } {
  const [date = "-", time = "-"] = dateTime.split(", ");
  return { date, time };
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function BillingInsights() {
  const [searchParams] = useSearchParams();
  const storeIdParam = searchParams.get("storeId");
  const storeNameParam = searchParams.get("store");
  const storePrefillKey = `${storeIdParam ?? ""}|${storeNameParam ?? ""}`;

  const [storeFilterOverride, setStoreFilterOverride] = useState<{
    key: string;
    value: string;
  } | null>(null);
  const [userFilter, setUserFilter] = useState<string>(ALL);
  const [paymentFilter, setPaymentFilter] = useState<string>(ALL);
  const [currentPage, setCurrentPage] = useState(1);

  const storesQuery = useStores({ page: 1, limit: 100 });

  const storeNameById = useMemo(
    () =>
      new Map(
        (storesQuery.data?.data ?? []).map((store) => [
          String(store.id),
          store.name,
        ]),
      ),
    [storesQuery.data?.data],
  );

  const storePrefillFromQuery = useMemo(() => {
    if (storeNameParam?.trim()) return storeNameParam.trim();
    if (!storeIdParam) return undefined;
    return storeNameById.get(storeIdParam);
  }, [storeIdParam, storeNameById, storeNameParam]);

  const storeFilter =
    storeFilterOverride?.key === storePrefillKey
      ? storeFilterOverride.value
      : storePrefillFromQuery ?? ALL;

  const filterParams = useMemo(
    () => ({
      store: storeFilter !== ALL ? storeFilter : undefined,
      userName: userFilter !== ALL ? userFilter : undefined,
      paymentMode:
        paymentFilter !== ALL ? (paymentFilter as PaymentMode) : undefined,
    }),
    [paymentFilter, storeFilter, userFilter],
  );

  const mainQuery = useBillingInsights({
    ...filterParams,
    breakdownBy: undefined,
    page: currentPage,
    limit: TRANSACTIONS_LIMIT,
  });

  const byStoreQuery = useBillingInsights({
    ...filterParams,
    breakdownBy: "store",
    limit: BREAKDOWN_LIMIT,
  });

  const byUserQuery = useBillingInsights({
    ...filterParams,
    breakdownBy: "user",
    limit: BREAKDOWN_LIMIT,
  });

  const byPaymentQuery = useBillingInsights({
    ...filterParams,
    breakdownBy: "payment_mode",
    limit: BREAKDOWN_LIMIT,
  });

  const summary: BillingInsightsSummary | undefined = mainQuery.data?.data?.summary;
  const transactions: BillingInsightsTransaction[] =
    mainQuery.data?.data?.transactions ?? [];
  const totalPages = Math.max(mainQuery.data?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = mainQuery.data?.pagination?.page ?? currentPage;

  const byStore: ByStoreRow[] = useMemo(
    () => transformBreakdownByStore(byStoreQuery.data?.data?.breakdown),
    [byStoreQuery.data?.data?.breakdown],
  );

  const byUser: ByUserRow[] = useMemo(
    () => transformBreakdownByUser(byUserQuery.data?.data?.breakdown),
    [byUserQuery.data?.data?.breakdown],
  );

  const byPayment: ByPaymentRow[] = useMemo(
    () => transformBreakdownByPayment(byPaymentQuery.data?.data?.breakdown),
    [byPaymentQuery.data?.data?.breakdown],
  );

  const storeOptions = useMemo(() => {
    const names = new Set<string>();

    for (const store of storesQuery.data?.data ?? []) {
      if (store.name) names.add(store.name);
    }

    for (const row of byStore) {
      if (row.storeName) names.add(row.storeName);
    }

    return [...names].sort((a, b) => a.localeCompare(b));
  }, [byStore, storesQuery.data?.data]);

  const userOptions = useMemo(() => {
    const names = new Set<string>();

    for (const row of byUser) {
      if (row.userName) names.add(row.userName);
    }

    return [...names].sort((a, b) => a.localeCompare(b));
  }, [byUser]);

  const clearFilters = () => {
    setStoreFilterOverride({ key: storePrefillKey, value: ALL });
    setUserFilter(ALL);
    setPaymentFilter(ALL);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    storeFilter !== ALL || userFilter !== ALL || paymentFilter !== ALL;

  const topPaymentModeLabel = isPaymentMode(summary?.topPaymentMode)
    ? PAYMENT_LABEL[summary.topPaymentMode]
    : "—";

  const mainErrorMessage = getErrorMessage(
    mainQuery.error,
    "Failed to load billing insights",
  );

  const breakdownError =
    byStoreQuery.error ?? byUserQuery.error ?? byPaymentQuery.error;

  const breakdownErrorMessage = getErrorMessage(
    breakdownError,
    "Failed to load breakdown",
  );

  const breakdownLoading =
    byStoreQuery.isLoading || byUserQuery.isLoading || byPaymentQuery.isLoading;

  const breakdownHasError =
    byStoreQuery.isError || byUserQuery.isError || byPaymentQuery.isError;

  return (
    <AdminLayout title="Billing insights">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <Filter className="size-4 text-admin" aria-hidden />
              <span className="text-sm font-medium">Global filters</span>
            </div>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 self-start text-muted-foreground sm:self-auto"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Store</span>
              <Select
                value={storeFilter}
                onValueChange={(value) => {
                  setStoreFilterOverride({ key: storePrefillKey, value });
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-full border-border bg-background sm:min-w-[200px]">
                  <SelectValue placeholder="All stores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All stores</SelectItem>
                  {storeOptions.map((storeName) => (
                    <SelectItem key={storeName} value={storeName}>
                      {storeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                User name
              </span>
              <Select
                value={userFilter}
                onValueChange={(value) => {
                  setUserFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-full border-border bg-background sm:min-w-[200px]">
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All users</SelectItem>
                  {userOptions.map((userName) => (
                    <SelectItem key={userName} value={userName}>
                      {userName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Payment mode
              </span>
              <Select
                value={paymentFilter}
                onValueChange={(value) => {
                  setPaymentFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-full border-border bg-background sm:min-w-[200px]">
                  <SelectValue placeholder="All modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All modes</SelectItem>
                  {(Object.keys(PAYMENT_LABEL) as PaymentMode[]).map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {PAYMENT_LABEL[mode]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Net in view</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {formatInr(summary?.netInView ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {mainQuery.isLoading
                ? "Loading..."
                : "Sum of offline bill totals in the filtered view"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Transactions in view
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {mainQuery.isLoading ? "—" : summary?.transactionsInView ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Rows matching global filters
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">Top payment mode</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
              <BarChart3 className="size-6 text-admin" aria-hidden />
              {topPaymentModeLabel}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Highest collection in current filter
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-1 border-b border-border px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 text-foreground">
              <Store className="size-5 text-admin" aria-hidden />
              <span className="text-base font-medium">Transactions</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Offline bills matching the filters above.
            </p>
          </div>

          <div className="overflow-x-auto p-4 pt-0 sm:p-6 sm:pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="py-3 pl-6 text-sm font-medium">Bill</TableHead>
                  <TableHead className="py-3 pl-6 text-sm font-medium">
                    Date &amp; time
                  </TableHead>
                  <TableHead className="py-3 pl-6 text-sm font-medium">Store</TableHead>
                  <TableHead className="py-3 pl-6 text-sm font-medium">User</TableHead>
                  <TableHead className="py-3 pl-6 text-sm font-medium">Mode</TableHead>
                  <TableHead className="py-3 pl-6 text-right text-sm font-medium">
                    Gross
                  </TableHead>
                  <TableHead className="py-3 pr-6 text-right text-sm font-medium">
                    Net
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {mainQuery.isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : mainQuery.isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-destructive"
                    >
                      {mainErrorMessage}
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No transactions match these filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => {
                    const { date, time } = splitDateTime(transaction.dateTime);

                    return (
                      <TableRow
                        key={transaction.billId}
                        className="border-b border-border"
                      >
                        <TableCell className="py-3 pl-6 text-sm font-medium tabular-nums text-foreground">
                          {transaction.billId}
                        </TableCell>
                        <TableCell className="py-3 pl-6 text-sm text-foreground">
                          <div className="flex flex-col">
                            <span>{date}</span>
                            <span className="text-xs text-muted-foreground">{time}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pl-6 text-sm text-foreground">
                          {transaction.store}
                        </TableCell>
                        <TableCell className="py-3 pl-6 text-sm text-foreground">
                          {transaction.user ?? "—"}
                        </TableCell>
                        <TableCell className="py-3 pl-6">
                          <Badge className={paymentBadgeClass[transaction.mode]}>
                            {PAYMENT_LABEL[transaction.mode]}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 pl-6 text-right text-sm tabular-nums text-foreground">
                          {formatInr(transaction.amount)}
                        </TableCell>
                        <TableCell className="py-3 pr-6 text-right text-sm font-medium tabular-nums text-foreground">
                          {formatInr(transaction.net)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="border-t border-border px-4 py-4 sm:px-6">
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
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-2 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-2 text-foreground">
              <Store className="size-5 text-admin" aria-hidden />
              <span className="text-base font-medium">Breakdown</span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <Tabs defaultValue="store" className="w-full">
              <TabsList className="grid w-full grid-cols-1 gap-1 sm:grid-cols-3">
                <TabsTrigger value="store">By store</TabsTrigger>
                <TabsTrigger value="user">By user</TabsTrigger>
                <TabsTrigger value="payment">By payment mode</TabsTrigger>
              </TabsList>

              <TabsContent value="store">
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border">
                        <TableHead className="py-3 pl-6 text-sm font-medium">Store</TableHead>
                        <TableHead className="py-3 pl-6 text-right text-sm font-medium">
                          Bills
                        </TableHead>
                        <TableHead className="py-3 pr-6 text-right text-sm font-medium">
                          Collected (net)
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {breakdownLoading ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            Loading breakdown...
                          </TableCell>
                        </TableRow>
                      ) : breakdownHasError ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="py-10 text-center text-sm text-destructive"
                          >
                            {breakdownErrorMessage}
                          </TableCell>
                        </TableRow>
                      ) : byStore.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            No rows for this filter.
                          </TableCell>
                        </TableRow>
                      ) : (
                        byStore.map((row) => (
                          <TableRow
                            key={row.storeId ?? row.storeName}
                            className="border-b border-border"
                          >
                            <TableCell className="py-3 pl-6">
                              <span className="text-sm font-medium text-foreground">
                                {row.storeName}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 pl-6 text-right text-sm tabular-nums text-foreground">
                              {row.bills}
                            </TableCell>
                            <TableCell className="py-3 pr-6 text-right text-sm font-medium tabular-nums text-foreground">
                              {formatInr(row.collected)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="user">
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border">
                        <TableHead className="py-3 pl-6 text-sm font-medium">User</TableHead>
                        <TableHead className="py-3 pl-6 text-right text-sm font-medium">
                          Bills
                        </TableHead>
                        <TableHead className="py-3 pl-6 text-sm font-medium">Store</TableHead>
                        <TableHead className="py-3 pr-6 text-right text-sm font-medium">
                          Collected (net)
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {breakdownLoading ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            Loading breakdown...
                          </TableCell>
                        </TableRow>
                      ) : breakdownHasError ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="py-10 text-center text-sm text-destructive"
                          >
                            {breakdownErrorMessage}
                          </TableCell>
                        </TableRow>
                      ) : byUser.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            No rows for this filter.
                          </TableCell>
                        </TableRow>
                      ) : (
                        byUser.map((row) => (
                          <TableRow
                            key={row.userId ?? row.userName}
                            className="border-b border-border"
                          >
                            <TableCell className="py-3 pl-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">
                                  {row.userName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {row.userId ?? "—"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 pl-6 text-right text-sm tabular-nums text-foreground">
                              {row.bills}
                            </TableCell>
                            <TableCell className="py-3 pl-6 text-sm text-foreground">
                              {row.storeName}
                            </TableCell>
                            <TableCell className="py-3 pr-6 text-right text-sm font-medium tabular-nums text-foreground">
                              {formatInr(row.collected)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="payment">
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border">
                        <TableHead className="py-3 pl-6 text-sm font-medium">Mode</TableHead>
                        <TableHead className="py-3 pl-6 text-right text-sm font-medium">
                          Bills
                        </TableHead>
                        <TableHead className="py-3 pl-6 text-right text-sm font-medium">
                          Collected (net)
                        </TableHead>
                        <TableHead className="py-3 pr-6 text-right text-sm font-medium">
                          Share
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {breakdownLoading ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            Loading breakdown...
                          </TableCell>
                        </TableRow>
                      ) : breakdownHasError ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="py-10 text-center text-sm text-destructive"
                          >
                            {breakdownErrorMessage}
                          </TableCell>
                        </TableRow>
                      ) : byPayment.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="py-10 text-center text-sm text-muted-foreground"
                          >
                            No rows for this filter.
                          </TableCell>
                        </TableRow>
                      ) : (
                        byPayment.map((row) => (
                          <TableRow key={row.mode} className="border-b border-border">
                            <TableCell className="py-3 pl-6">
                              <Badge className={paymentBadgeClass[row.mode]}>
                                {PAYMENT_LABEL[row.mode]}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3 pl-6 text-right text-sm tabular-nums text-foreground">
                              {row.bills}
                            </TableCell>
                            <TableCell className="py-3 pl-6 text-right text-sm tabular-nums text-foreground">
                              {formatInr(row.collected)}
                            </TableCell>
                            <TableCell className="py-3 pr-6 text-right text-sm tabular-nums text-muted-foreground">
                              {row.share}%
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
