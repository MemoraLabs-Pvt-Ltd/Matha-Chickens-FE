import { Sheet, SheetContent } from "@/components/ui/sheet";

interface OrderItem {
  name: string;
  qty: number;
  price: string;
  total: string;
}

interface ViewOrderSheetProps {
  order: {
    id: string;
    store: string;
    customer: string;
    phone: string;
    address: string;
    date: string;
    time: string;
    total: string;
    status: "received" | "dispatched" | "delivered";
    items: OrderItem[];
    subtotal: string;
    discount: string;
    tax: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

const statusStyles = {
  received: "bg-[#dbeafe] text-[#193cb8]",
  dispatched: "bg-[#fef3c6] text-[#973c00]",
  delivered: "bg-[#dcfce7] text-[#016630]",
};

const statusLabels = {
  received: "Order Received",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export function ViewOrderSheet({ order, open, onClose }: ViewOrderSheetProps) {
  if (!order) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[375px] sm:max-w-[375px] p-0">
        <div className="border-b border-border px-4 pt-4 pb-[17.6px]">
          <h2 className="text-[20px] font-semibold text-foreground tracking-[-0.45px]">
            Order Details - {order.id}
          </h2>
          <p className="text-sm text-muted-foreground mt-[6px]">
            Complete order information
          </p>
        </div>

        <div className="flex flex-col gap-8 px-4 py-4 overflow-y-auto">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">
              Customer Information
            </h3>
            <div className="bg-muted rounded-[10px] p-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium text-foreground">
                  {order.customer}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm font-medium text-foreground">
                  {order.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Address</span>
                <span className="text-sm font-medium text-foreground text-right max-w-[180px]">
                  {order.address}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">Order Items</h3>
            <div className="bg-muted rounded-[10px] p-4 flex flex-col gap-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.qty} × {item.price}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.total}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-medium text-foreground">
                  {order.subtotal}
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
                  {order.subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Discount</span>
                <span className="text-sm font-medium text-emerald-600">
                  -{order.discount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tax (GST 18%)</span>
                <span className="text-sm font-medium text-foreground">
                  {order.tax}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-sm font-semibold text-foreground">
                  Total
                </span>
                <span className="text-base font-semibold text-foreground">
                  {order.total}
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
