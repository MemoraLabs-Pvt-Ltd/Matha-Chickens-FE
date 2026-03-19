import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BillItem {
  name: string;
  quantity: number;
  price: number;
}

interface BillDetails {
  billNumber: string;
  date: string;
  time: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

interface BillDetailsSheetProps {
  bill: BillDetails | null;
  isOpen: boolean;
  onClose: () => void;
  subtitle?: string;
}

export function BillDetailsSheet({ bill, isOpen, onClose, subtitle = "Completed manual bill transaction" }: BillDetailsSheetProps) {
  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-[384px] bg-card border-l border-border shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Bill Details - {bill.billNumber}
            </h2>
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
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
          <div className="bg-muted rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
            <p className="text-base font-medium text-foreground">
              {bill.date} at {bill.time}
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium text-foreground mb-3">Bill Items</h3>
            <div className="space-y-2">
              {bill.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-muted rounded p-3 flex items-start justify-between"
                >
                  <div>
                    <p className="text-base font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    ₹{(item.quantity * item.price).toFixed(2)}
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
                <span className="text-sm text-foreground">₹{bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#00a63e]">Discount:</span>
                <span className="text-sm text-[#00a63e]">-₹{bill.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground">Tax:</span>
                <span className="text-sm text-foreground">₹{bill.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-base font-bold text-foreground">Total:</span>
                <span className="text-lg font-bold text-foreground">₹{bill.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium text-foreground mb-2">Payment Method</h3>
            <span className="inline-flex items-center px-3 py-1.5 bg-muted rounded text-sm text-foreground">
              {bill.paymentMethod}
            </span>
          </div>
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
