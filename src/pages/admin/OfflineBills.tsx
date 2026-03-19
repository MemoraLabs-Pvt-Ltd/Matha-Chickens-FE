import { Eye } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { ViewBillSheet } from "@/components/admin/bills/ViewBillSheet";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface BillItem {
  name: string;
  qty: number;
  price: string;
  total: string;
}

interface Bill {
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
  items: BillItem[];
}

const bills: Bill[] = [
  {
    id: "MG-001",
    billNumber: "MG-001",
    store: "Matha Chickens - MG Road",
    date: "25/02/2026",
    time: "11:20:00",
    subtotal: "₹880.00",
    discount: "-₹44.00",
    tax: "₹41.80",
    total: "₹877.80",
    payment: "Cash",
    items: [
      { name: "Crispy Fried Chicken", qty: 2, price: "₹320.00", total: "₹640.00" },
      { name: "Chicken Wings", qty: 1, price: "₹240.00", total: "₹240.00" },
    ],
  },
  {
    id: "MG-002",
    billNumber: "MG-002",
    store: "Matha Chickens - MG Road",
    date: "25/02/2026",
    time: "15:45:00",
    subtotal: "₹252.00",
    discount: "-₹12.60",
    tax: "₹11.97",
    total: "₹251.37",
    payment: "UPI",
    items: [
      { name: "Chicken Curry (Boneless)", qty: 1, price: "₹180.00", total: "₹180.00" },
      { name: "Tandoori Chicken (Half)", qty: 1, price: "₹160.00", total: "₹160.00" },
    ],
  },
  {
    id: "KOR-001",
    billNumber: "KOR-001",
    store: "Matha Chickens - Koramangala",
    date: "24/02/2026",
    time: "16:30:00",
    subtotal: "₹840.00",
    discount: "-₹0.00",
    tax: "₹0.00",
    total: "₹840.00",
    payment: "Card",
    items: [
      { name: "Whole Chicken (Grilled)", qty: 2, price: "₹350.00", total: "₹700.00" },
      { name: "Chicken Lollipop", qty: 1, price: "₹140.00", total: "₹140.00" },
    ],
  },
];

const paymentStyles = {
  Cash: "bg-muted text-foreground",
  UPI: "bg-muted text-foreground",
  Card: "bg-muted text-foreground",
};

export default function OfflineBills() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setSheetOpen(true);
  };

  return (
    <>
      <ViewBillSheet
        bill={selectedBill}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
      <AdminLayout title="Offline Bills">
        <div className="bg-[#fafafa]">
          <p className="text-base text-[#525252] mb-6">
            View all offline bills from store manual billing
          </p>

          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Bill Number
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Store
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Subtotal
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Discount
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Tax
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Total
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Payment
                  </TableHead>
                  <TableHead className="text-right py-[10px] pr-2 text-sm font-medium text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow
                    key={bill.id}
                    className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                  >
                    <TableCell className="py-3 pl-2 text-sm font-medium text-foreground">
                      {bill.billNumber}
                    </TableCell>
                    <TableCell className="py-3 pl-2 text-sm text-foreground">
                      {bill.store}
                    </TableCell>
                    <TableCell className="py-3 pl-2">
                      <div className="text-sm text-foreground">
                        <p>{bill.date}</p>
                        <p className="text-muted-foreground">{bill.time}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 pl-2 text-sm text-foreground">
                      {bill.subtotal}
                    </TableCell>
                    <TableCell className="py-3 pl-2 text-sm text-emerald-600">
                      {bill.discount}
                    </TableCell>
                    <TableCell className="py-3 pl-2 text-sm text-foreground">
                      {bill.tax}
                    </TableCell>
                    <TableCell className="py-3 pl-2 text-sm font-semibold text-foreground">
                      {bill.total}
                    </TableCell>
                    <TableCell className="py-3 pl-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          paymentStyles[bill.payment]
                        }`}
                      >
                        {bill.payment}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 pr-2">
                      <div className="flex items-center justify-end">
                        <button
                          className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                          onClick={() => handleViewBill(bill)}
                        >
                          <Eye className="size-4 text-muted-foreground" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
