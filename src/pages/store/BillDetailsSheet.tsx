import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useOfflineBill } from "@/hooks/useOfflineBills";
import { usePrinterSettings } from "@/hooks/usePrinterSettings";
import { useStoreUpiIds } from "@/hooks/useStoreUpiIds";
import type { PaymentMode } from "@/lib/api/offlineBills";
import {
  computeItemDiscount,
  describeItemDiscountLabel,
} from "@/lib/billing/itemDiscount";
import {
  downloadOfflineBillReceipt,
  printOfflineBillReceipt,
  type ReceiptStoreProfile,
} from "@/lib/billing/printOfflineBill";
import type { LabelSize, ReceiptPageSize } from "@/lib/billing/printerSettings";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";
import { Download, Printer, X } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE_OPTIONS: { value: Exclude<ReceiptPageSize, "custom">; label: string }[] = [
  { value: "2in", label: "2 Inch (58mm)" },
  { value: "3in", label: "3 Inch (68mm)" },
  { value: "4in", label: "4 Inch (88mm)" },
];

const LABEL_SIZE_OPTIONS: { value: Exclude<LabelSize, "custom">; label: string }[] = [
  { value: "40x30", label: "40 x 30 mm" },
  { value: "50x25", label: "50 x 25 mm" },
  { value: "50x30", label: "50 x 30 mm" },
  { value: "100x50", label: "100 x 50 mm" },
];

interface BillDetailsSheetProps {
  billId: number | null;
  isOpen: boolean;
  onClose: () => void;
  subtitle?: string;
  /** Printed on the receipt header. */
  store?: ReceiptStoreProfile | null;
}

const paymentLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  cheque: "Cheque",
  credit_loan: "Credit (Loan)",
  other: "Other",
};

export function BillDetailsSheet({
  billId,
  isOpen,
  onClose,
  subtitle = "Completed manual bill transaction",
  store,
}: BillDetailsSheetProps) {
  const {
    data: billData,
    isLoading,
    isError,
    error,
  } = useOfflineBill(billId ?? 0);
  const { data: upiIdsResponse } = useStoreUpiIds();
  const { settings: printerSettings } = usePrinterSettings();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pageSizeOverride, setPageSizeOverride] = useState<Exclude<ReceiptPageSize, "custom"> | null>(null);
  const [labelSizeOverride, setLabelSizeOverride] = useState<Exclude<LabelSize, "custom"> | null>(null);

  if (!isOpen || !billId) return null;

  const defaultUpiId =
    upiIdsResponse?.data?.find((u) => u.is_default)?.upi_id ??
    upiIdsResponse?.data?.[0]?.upi_id ??
    null;

  const isThermal = printerSettings.defaultPrinter === "thermal";
  const isLabelMode = isThermal && printerSettings.thermal.printingType === "label";
  const currentPageSize =
    printerSettings.thermal.pageSize === "custom" ? "4in" : printerSettings.thermal.pageSize;
  const currentLabelSize =
    printerSettings.thermal.labelSize === "custom" ? "50x25" : printerSettings.thermal.labelSize;
  const sizeOptions = isLabelMode
    ? { pageSize: undefined, labelSize: labelSizeOverride ?? currentLabelSize }
    : { pageSize: pageSizeOverride ?? currentPageSize, labelSize: undefined };

  const bill = billData?.data;
  const createdAt = bill ? splitIsoDateTime(bill.created_at) : null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-full flex-col border-l border-border bg-card shadow-xl md:w-[384px] md:max-w-[384px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Bill Details - #{billId}
            </h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 hover:bg-muted"
            onClick={onClose}
          >
            <X className="size-4 text-muted-foreground" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading && (
            <>
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </>
          )}

          {isError && (
            <div className="rounded-[10px] border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">
                {error instanceof Error
                  ? error.message
                  : "Failed to load bill details"}
              </p>
            </div>
          )}

          {!isLoading && !isError && bill && (
            <>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Date & Time
                </p>
                <p className="text-base font-medium text-foreground">
                  {createdAt?.date} at {createdAt?.time}
                </p>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Customer</p>
                <p className="text-base font-medium text-foreground">
                  {bill.customer_name?.trim() || "—"}
                </p>
                {bill.customer_phone?.trim() ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    {bill.customer_phone}
                  </p>
                ) : null}
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  Bill Items
                </h3>
                <div className="space-y-2">
                  {bill.bill_items.map((item) => {
                    const discountPerUnit = computeItemDiscount(
                      item.price,
                      item.discount_type,
                      item.discount_value,
                    );
                    const lineItemDiscount = discountPerUnit * item.quantity;
                    const netPerUnit = item.price - discountPerUnit;
                    const itemDiscLabel = describeItemDiscountLabel(
                      item.discount_type,
                      item.discount_value,
                      formatInr,
                    );

                    return (
                      <div
                        key={item.id}
                        className="bg-muted rounded p-3 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0 space-y-1">
                          <p className="text-base font-medium text-foreground">
                            {item.item_name}
                          </p>
                          {discountPerUnit > 0 ? (
                            <>
                              <p className="text-sm text-muted-foreground">
                                Qty {item.quantity} {item.unit} · List{" "}
                                {formatInr(item.price)}/{item.unit}
                              </p>
                              <p className="text-sm text-[#00a63e]">
                                Item discount −{formatInr(lineItemDiscount)}
                                {itemDiscLabel ? ` (${itemDiscLabel})` : ""}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Net {formatInr(netPerUnit)}/{item.unit} x{" "}
                                {item.quantity}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} {item.unit} x{" "}
                              {formatInr(item.price)}/{item.unit}
                            </p>
                          )}
                        </div>
                        <p className="text-base font-semibold text-foreground shrink-0">
                          {formatInr(item.total)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  Bill Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Subtotal:</span>
                    <span className="text-sm text-foreground">
                      {formatInr(bill.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#00a63e]">Discount:</span>
                    <span className="text-sm text-[#00a63e]">
                      -{formatInr(bill.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Tax:</span>
                    <span className="text-sm text-foreground">
                      {formatInr(bill.tax)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="text-base font-bold text-foreground">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {formatInr(bill.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Received:</span>
                    <span className="text-sm text-foreground">
                      {formatInr(bill.received_amount ?? bill.total_amount)}
                    </span>
                  </div>
                  {(bill.received_amount ?? bill.total_amount) < bill.total_amount && (
                    <div className="flex justify-between">
                      <span className="text-sm text-destructive">
                        Balance (this bill):
                      </span>
                      <span className="text-sm text-destructive">
                        {formatInr(bill.total_amount - (bill.received_amount ?? bill.total_amount))}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {bill.previous_balance !== null && bill.current_balance !== null && (
                <div>
                  <h3 className="text-base font-medium text-foreground mb-3">
                    Customer Account
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-foreground">
                        Previous Bal.:
                      </span>
                      <span className="text-sm text-foreground">
                        {formatInr(bill.previous_balance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        Current Bal.:
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatInr(bill.current_balance)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  Payment Method
                </h3>
                <span className="inline-flex items-center px-3 py-1.5 bg-muted rounded text-sm text-foreground">
                  {paymentLabels[bill.payment_mode]}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-border space-y-3">
          {isThermal && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Print size {isLabelMode ? "(label)" : "(page)"}
              </p>
              {isLabelMode ? (
                <Select
                  value={labelSizeOverride ?? currentLabelSize}
                  onValueChange={(value) => setLabelSizeOverride(value as Exclude<LabelSize, "custom">)}
                >
                  <SelectTrigger className="w-full h-9 bg-muted border-transparent rounded-lg text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LABEL_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  value={pageSizeOverride ?? currentPageSize}
                  onValueChange={(value) => setPageSizeOverride(value as Exclude<ReceiptPageSize, "custom">)}
                >
                  <SelectTrigger className="w-full h-9 bg-muted border-transparent rounded-lg text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              className="flex-1 h-9 bg-store hover:bg-store/90 rounded-lg text-white"
              disabled={!bill || isPrinting}
              onClick={async () => {
                if (!bill) return;
                setIsPrinting(true);
                try {
                  await printOfflineBillReceipt(bill, { store, upiId: defaultUpiId, ...sizeOptions });
                } finally {
                  setIsPrinting(false);
                }
              }}
            >
              <Printer className="size-4 mr-2" />
              {isPrinting ? "Preparing..." : "Print Bill"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-9 rounded-lg"
              disabled={!bill || isDownloading}
              onClick={async () => {
                if (!bill) return;
                setIsDownloading(true);
                try {
                  if (!(await downloadOfflineBillReceipt(bill, { store, upiId: defaultUpiId, ...sizeOptions }))) {
                    toast.error("Could not generate the PDF");
                  }
                } finally {
                  setIsDownloading(false);
                }
              }}
            >
              <Download className="size-4 mr-2" />
              {isDownloading ? "Preparing..." : "Download"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
