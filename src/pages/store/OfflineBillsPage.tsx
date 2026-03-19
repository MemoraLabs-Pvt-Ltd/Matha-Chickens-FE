import { useState } from "react";
import { Eye } from "lucide-react";
import { StoreLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { BillDetailsSheet } from "./BillDetailsSheet";

interface BillItem {
  name: string;
  quantity: number;
  price: number;
}

interface OfflineBill {
  billNumber: string;
  date: string;
  time: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
}

const offlineBills: OfflineBill[] = [
  {
    billNumber: "MG-001",
    date: "25/02/2026",
    time: "11:20:00",
    items: [
      { name: "Crispy Fried Chicken", quantity: 2, price: 320 },
      { name: "Chicken Wings", quantity: 1, price: 240 },
    ],
    subtotal: 880,
    discount: 44,
    tax: 41.8,
    total: 877.8,
    paymentMethod: "Cash",
  },
  {
    billNumber: "MG-002",
    date: "25/02/2026",
    time: "15:45:00",
    items: [
      { name: "Whole Roast Chicken", quantity: 1, price: 450 },
      { name: "Farm Fresh Eggs (12 pcs)", quantity: 2, price: 84 },
    ],
    subtotal: 618,
    discount: 30.9,
    tax: 29.38,
    total: 616.48,
    paymentMethod: "UPI",
  },
];

export default function OfflineBillsPage() {
  const [selectedBill, setSelectedBill] = useState<OfflineBill | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleViewBill = (bill: OfflineBill) => {
    setSelectedBill(bill);
    setIsSheetOpen(true);
  };

  return (
    <StoreLayout title="Offline Bills History">
      <div className="space-y-6">
        <p className="text-base text-foreground">
          View all offline bills generated from manual billing
        </p>

        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Bill Number
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Date & Time
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Subtotal
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Discount
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Tax
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Total
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Payment
                </TableHead>
                <TableHead className="text-right py-3 pr-4 text-sm font-medium text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offlineBills.map((bill) => (
                <TableRow key={bill.billNumber} className="border-b border-border">
                  <TableCell className="py-4 pl-4">
                    <span className="text-sm font-medium text-foreground">
                      {bill.billNumber}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <div className="text-sm text-foreground">{bill.date}</div>
                    <div className="text-xs text-muted-foreground">{bill.time}</div>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <span className="text-sm text-foreground">
                      ₹{bill.subtotal.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <span className="text-sm text-[#00a63e]">
                      -₹{bill.discount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <span className="text-sm text-foreground">
                      ₹{bill.tax.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <span className="text-sm font-semibold text-foreground">
                      ₹{bill.total.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <span className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs text-foreground">
                      {bill.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-4 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 hover:bg-muted"
                      onClick={() => handleViewBill(bill)}
                    >
                      <Eye className="size-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <BillDetailsSheet
        bill={selectedBill}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        subtitle="Offline bill transaction"
      />
    </StoreLayout>
  );
}
