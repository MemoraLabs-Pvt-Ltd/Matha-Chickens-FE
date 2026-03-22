import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useOrders";
import type { OrderStatus } from "@/lib/api/orders";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";

interface ViewOrderSheetProps {
  orderId: number | null;
  open: boolean;
  onClose: () => void;
}

const statusStyles: Record<OrderStatus, string> = {
  order_received: "bg-[#dbeafe] text-[#193cb8]",
  dispatched: "bg-[#fef3c6] text-[#973c00]",
  delivered: "bg-[#dcfce7] text-[#016630]",
};

const statusLabels: Record<OrderStatus, string> = {
  order_received: "Order Received",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export function ViewOrderSheet({ orderId, open, onClose }: ViewOrderSheetProps) {
  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useOrder(orderId ?? 0);

  const order = orderData?.data;
  const createdAt = order ? splitIsoDateTime(order.created_at) : null;

  if (!orderId) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[375px] sm:max-w-[375px] p-0">
        <div className="border-b border-border px-4 pt-4 pb-[17.6px]">
          <h2 className="text-[20px] font-semibold text-foreground tracking-[-0.45px]">
            Order Details - #{orderId}
          </h2>
          <p className="text-sm text-muted-foreground mt-[6px]">
            Complete order information
          </p>
        </div>

        <div className="flex flex-col gap-8 px-4 py-4 overflow-y-auto">
          {isLoading && (
            <>
              <div className="space-y-3">
                <Skeleton className="h-5 w-40 rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-28 rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            </>
          )}

          {isError && (
            <div className="rounded-[10px] border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : "Failed to load order details"}
              </p>
            </div>
          )}

          {!isLoading && !isError && order && (
            <>
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-foreground">
                  Customer Information
                </h3>
                <div className="bg-muted rounded-[10px] p-4 flex flex-col gap-2">
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium text-foreground text-right">
                      {order.customer_name}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-sm font-medium text-foreground text-right">
                      {order.customer_phone}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Address</span>
                    <span className="text-sm font-medium text-foreground text-right max-w-[180px]">
                      {order.delivery_address}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Store</span>
                    <span className="text-sm font-medium text-foreground text-right max-w-[180px]">
                      {order.store_name}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm font-medium text-foreground text-right">
                      {createdAt?.date} {createdAt?.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-foreground">Order Items</h3>
                <div className="bg-muted rounded-[10px] p-4 flex flex-col gap-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {item.item_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit} x {formatInr(item.price)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground text-right">
                        {formatInr(item.total)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatInr(order.subtotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-foreground">Bill Summary</h3>
                <div className="bg-muted rounded-[10px] p-4 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatInr(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Discount</span>
                    <span className="text-sm font-medium text-emerald-600">
                      -{formatInr(order.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tax</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatInr(order.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-sm font-semibold text-foreground">
                      Total
                    </span>
                    <span className="text-base font-semibold text-foreground">
                      {formatInr(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-foreground">Order Status</h3>
                <div className="flex items-center">
                  <span
                    className={`inline-block px-3 py-1.5 text-sm font-medium rounded-lg ${
                      statusStyles[order.status]
                    }`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
