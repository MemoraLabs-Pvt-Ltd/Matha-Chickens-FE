import { Sheet, SheetContent } from "@/components/ui/sheet";

interface BillItem {
  name: string;
  qty: number;
  price: string;
  total: string;
}

interface ViewBillSheetProps {
  bill: {
    id: string;
    billNumber: string;
    store: string;
    date: string;
    time: string;
    subtotal: string;
    discount: string;
    tax: string;
    total: string;
    payment: "Cash" | "UPI" | "Card";
    items?: BillItem[];
  } | null;
  open: boolean;
  onClose: () => void;
}

const defaultItems: BillItem[] = [
  { name: "Crispy Fried Chicken", qty: 2, price: "₹320.00", total: "₹640.00" },
  { name: "Chicken Wings", qty: 1, price: "₹240.00", total: "₹240.00" },
];

export function ViewBillSheet({ bill, open, onClose }: ViewBillSheetProps) {
  if (!bill) return null;

  const items = bill.items || defaultItems;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-[375px] sm:max-w-[375px] p-0">
        <div className="border-b border-[#d4d4d4] px-4 pt-4 pb-[17.6px]">
          <h2 className="text-[20px] font-semibold text-foreground tracking-[-0.45px]">
            Bill Details - {bill.billNumber}
          </h2>
          <p className="text-sm text-[#717182] mt-[6px]">
            Offline bill transaction
          </p>
        </div>

        <div className="flex flex-col gap-8 px-4 py-6 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-medium text-foreground">
              Bill Items
            </h3>
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fafafa] rounded-[4px] p-3 flex justify-between items-start"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-sm text-[#525252]">
                      Qty: {item.qty} × {item.price}
                    </span>
                  </div>
                  <span className="text-base font-semibold text-foreground">
                    {item.total}
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
                <span className="text-sm text-foreground">{bill.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#00a63e]">Discount:</span>
                <span className="text-sm text-[#00a63e]">{bill.discount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground">Tax:</span>
                <span className="text-sm text-foreground">{bill.tax}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[rgba(0,0,0,0.1)]">
                <span className="text-base font-bold text-foreground  ">
                  Total:
                </span>
                <span className="text-base font-bold text-foreground  ">
                  {bill.total}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-base font-medium text-foreground">
              Payment Method
            </h3>
            <span className="inline-block bg-[#f5f5f5] text-foreground text-base px-3 py-1.5 rounded-[4px] w-fit">
              {bill.payment}
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
