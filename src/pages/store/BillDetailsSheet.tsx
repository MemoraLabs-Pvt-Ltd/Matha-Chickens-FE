import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOfflineBill } from "@/hooks/useOfflineBills";
import type { PaymentMode } from "@/lib/api/offlineBills";

interface BillDetailsSheetProps {
  billId: number | null;
  isOpen: boolean;
  onClose: () => void;
  subtitle?: string;
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

export function BillDetailsSheet({
  billId,
  isOpen,
  onClose,
  subtitle = "Completed manual bill transaction",
}: BillDetailsSheetProps) {
  const {
    data: billData,
    isLoading,
    isError,
    error,
  } = useOfflineBill(billId ?? 0);

  if (!isOpen || !billId) return null;

  const bill = billData?.data;
  const createdAt = bill ? formatDateTime(bill.created_at) : null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[384px] bg-card border-l border-border shadow-xl flex flex-col">
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
                {error instanceof Error ? error.message : "Failed to load bill details"}
              </p>
            </div>
          )}

          {!isLoading && !isError && bill && (
            <>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                <p className="text-base font-medium text-foreground">
                  {createdAt?.date} at {createdAt?.time}
                </p>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground mb-3">Bill Items</h3>
                <div className="space-y-2">
                  {bill.bill_items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-muted rounded p-3 flex items-start justify-between"
                    >
                      <div>
                        <p className="text-base font-medium text-foreground">
                          {item.item_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} {item.unit} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="text-base font-semibold text-foreground">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground mb-3">Bill Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Subtotal:</span>
                    <span className="text-sm text-foreground">
                      {formatCurrency(bill.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#00a63e]">Discount:</span>
                    <span className="text-sm text-[#00a63e]">
                      -{formatCurrency(bill.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Tax:</span>
                    <span className="text-sm text-foreground">
                      {formatCurrency(bill.tax)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="text-base font-bold text-foreground">Total:</span>
                    <span className="text-lg font-bold text-foreground">
                      {formatCurrency(bill.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

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

        <div className="p-6 border-t border-border">
          <Button className="w-full h-9 bg-store hover:bg-store/90 rounded-lg text-white">
            <Printer className="size-4 mr-2" />
            Print Bill
          </Button>
        </div>
      </div>
    </div>
  );
}
