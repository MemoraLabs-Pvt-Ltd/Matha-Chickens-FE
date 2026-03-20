import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useOfflineBill } from "@/hooks/useOfflineBills";
import type { PaymentMode } from "@/lib/api/offlineBills";

interface ViewBillSheetProps {
  billId: number | null;
  open: boolean;
  onClose: () => void;
}

const paymentLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  cheque: "Cheque",
  other: "Other",
};

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

export function ViewBillSheet({ billId, open, onClose }: ViewBillSheetProps) {
  const {
    data: billData,
    isLoading,
    isError,
    error,
  } = useOfflineBill(billId ?? 0);

  const bill = billData?.data;
  const createdAt = bill ? formatDateTime(bill.created_at) : null;

  if (!billId) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[375px] sm:max-w-[375px] p-0">
        <div className="border-b border-[#d4d4d4] px-4 pt-4 pb-[17.6px]">
          <h2 className="text-[20px] font-semibold text-foreground tracking-[-0.45px]">
            Bill Details - #{billId}
          </h2>
          <p className="text-sm text-[#717182] mt-[6px]">
            Offline bill transaction
          </p>
        </div>

        <div className="flex flex-col gap-8 px-4 py-6 overflow-y-auto">
          {isLoading && (
            <>
              <div className="space-y-3">
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </>
          )}

          {isError && (
            <div className="rounded-[10px] border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : "Failed to load bill details"}
              </p>
            </div>
          )}

          {!isLoading && !isError && bill && (
            <>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-medium text-foreground">
                  Bill Meta
                </h3>
                <div className="bg-[#fafafa] rounded-[4px] p-3 flex flex-col gap-2">
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#525252]">Store ID</span>
                    <span className="text-sm font-medium text-foreground">
                      {bill.store_id}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#525252]">Customer</span>
                    <span className="text-sm font-medium text-foreground text-right">
                      {bill.customer_name || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#525252]">Phone</span>
                    <span className="text-sm font-medium text-foreground text-right">
                      {bill.customer_phone || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-[#525252]">Date & Time</span>
                    <span className="text-sm font-medium text-foreground text-right">
                      {createdAt?.date} {createdAt?.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-base font-medium text-foreground">
                  Bill Items
                </h3>
                <div className="flex flex-col gap-2">
                  {bill.bill_items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#fafafa] rounded-[4px] p-3 flex justify-between items-start gap-3"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-medium text-foreground">
                          {item.item_name}
                        </span>
                        <span className="text-sm text-[#525252]">
                          Qty: {item.quantity} {item.unit} x {formatCurrency(item.price)}
                        </span>
                      </div>
                      <span className="text-base font-semibold text-foreground text-right">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-base font-medium text-foreground">
                  Bill Summary
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Subtotal:</span>
                    <span className="text-sm text-foreground">{formatCurrency(bill.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#00a63e]">Discount:</span>
                    <span className="text-sm text-[#00a63e]">-{formatCurrency(bill.discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Tax:</span>
                    <span className="text-sm text-foreground">{formatCurrency(bill.tax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[rgba(0,0,0,0.1)]">
                    <span className="text-base font-bold text-foreground">
                      Total:
                    </span>
                    <span className="text-base font-bold text-foreground">
                      {formatCurrency(bill.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-base font-medium text-foreground">
                  Payment Method
                </h3>
                <span className="inline-block bg-[#f5f5f5] text-foreground text-base px-3 py-1.5 rounded-[4px] w-fit">
                  {paymentLabels[bill.payment_mode]}
                </span>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
