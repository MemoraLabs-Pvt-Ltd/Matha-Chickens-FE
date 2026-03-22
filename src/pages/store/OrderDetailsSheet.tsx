import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder, useUpdateOrderStatus } from "@/hooks/useOrders";
import type { OrderStatus } from "@/lib/api/orders";
import { formatPhoneForDisplay } from "@/lib/display/phone";
import { formatInr, splitIsoDateTime } from "@/lib/display/formatting";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderDetailsSheetProps {
  orderId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusStyles: Record<OrderStatus, { bg: string; text: string }> = {
  order_received: { bg: "bg-[#dbeafe]", text: "text-[#193cb8]" },
  dispatched: { bg: "bg-[#fef3c6]", text: "text-[#973c00]" },
  delivered: { bg: "bg-[#dcfce7]", text: "text-[#016630]" },
};

const statusLabels: Record<OrderStatus, string> = {
  order_received: "Order Received",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export function OrderDetailsSheet({
  orderId,
  isOpen,
  onClose,
}: OrderDetailsSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");

  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useOrder(orderId ?? 0);
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const order = orderData?.data;
  const createdAt = order ? splitIsoDateTime(order.created_at) : null;

  useEffect(() => {
    if (order?.status) {
      setSelectedStatus(order.status);
    }
  }, [order?.status]);

  if (!isOpen || !orderId) return null;

  const canUpdateStatus =
    Boolean(order) &&
    Boolean(selectedStatus) &&
    selectedStatus !== order?.status &&
    !updateOrderStatusMutation.isPending;

  const handleUpdateStatus = async () => {
    if (!order || !selectedStatus) return;
    await updateOrderStatusMutation.mutateAsync({
      id: order.id,
      status: selectedStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[375px] bg-card border-l border-border shadow-xl flex flex-col">
        <div className="border-b border-[#d4d4d4] px-4 pt-4 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-tight">
                Order Details - #{orderId}
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete order information
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-muted opacity-70"
              onClick={onClose}
            >
              <X className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isLoading && (
            <>
              <Skeleton className="h-20 w-full rounded-[10px]" />
              <Skeleton className="h-32 w-full rounded-[10px]" />
              <Skeleton className="h-28 w-full rounded-[10px]" />
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
              <div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  Customer Information
                </h3>
                <div className="bg-muted rounded-[10px] p-4 space-y-1">
                  <p className="text-sm text-foreground">
                    <span className="font-bold">Name:</span> {order.customer_name}
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="font-bold">Phone:</span> {formatPhoneForDisplay(order.customer_phone)}
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="font-bold">Address:</span> {order.delivery_address}
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="font-bold">Date:</span> {createdAt?.date} {createdAt?.time}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  Order Items
                </h3>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-muted rounded p-3 flex items-start justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.item_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} {item.unit} x {formatInr(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatInr(item.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  Bill Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Subtotal:</span>
                    <span className="text-sm text-foreground">{formatInr(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#00a63e]">Discount:</span>
                    <span className="text-sm text-[#00a63e]">-{formatInr(order.discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Tax:</span>
                    <span className="text-sm text-foreground">{formatInr(order.tax)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="text-base font-bold text-foreground">Total:</span>
                    <span className="text-lg font-bold text-foreground">
                      {formatInr(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  Order Status
                </h3>
                <div className="space-y-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}
                  >
                    Current: {statusLabels[order.status]}
                  </span>

                  <Select
                    value={selectedStatus}
                    onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                  >
                    <SelectTrigger className="bg-muted border-transparent rounded-lg h-9">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order_received">Order Received</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleUpdateStatus}
                    disabled={!canUpdateStatus}
                    className="h-9 bg-store hover:bg-store/90 text-white"
                  >
                    {updateOrderStatusMutation.isPending
                      ? "Updating..."
                      : "Update Status"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
