import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: "Order Received" | "Preparing" | "Dispatched" | "Delivered";
}

interface OrderDetailsSheetProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusStyles: Record<OrderDetails["status"], { bg: string; text: string }> = {
  "Order Received": { bg: "bg-[#dbeafe]", text: "text-[#193cb8]" },
  "Preparing": { bg: "bg-[#fef3c6]", text: "text-[#973c00]" },
  "Dispatched": { bg: "bg-[#fef3c6]", text: "text-[#973c00]" },
  "Delivered": { bg: "bg-[#dcfce7]", text: "text-[#016630]" },
};

export function OrderDetailsSheet({ order, isOpen, onClose }: OrderDetailsSheetProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[375px] bg-card border-l border-border shadow-xl flex flex-col">
        {/* Header */}
        <div className="border-b border-[#d4d4d4] px-4 pt-4 pb-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground tracking-tight">
                Order Details - {order.id}
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
          {/* Customer Information */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-2">
              Customer Information
            </h3>
            <div className="bg-muted rounded-[10px] p-4 space-y-1">
              <p className="text-sm text-foreground">
                <span className="font-bold">Name:</span> {order.customer}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-bold">Phone:</span> {order.phone}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-bold">Address:</span> {order.address}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-2">
              Order Items
            </h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-muted rounded p-3 flex items-start justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-2">
              Bill Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground">Subtotal:</span>
                <span className="text-sm text-foreground">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#00a63e]">Discount:</span>
                <span className="text-sm text-[#00a63e]">-₹{order.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground">Tax:</span>
                <span className="text-sm text-foreground">₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-base font-bold text-foreground">Total:</span>
                <span className="text-lg font-bold text-foreground">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-2">
              Order Status
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
