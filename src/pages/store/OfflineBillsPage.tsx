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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  { billNumber: "MG-001", date: "25/02/2026", time: "11:20:00", items: [{ name: "Crispy Fried Chicken", quantity: 2, price: 320 }, { name: "Chicken Wings", quantity: 1, price: 240 }], subtotal: 880, discount: 44, tax: 41.8, total: 877.8, paymentMethod: "Cash" },
  { billNumber: "MG-002", date: "25/02/2026", time: "15:45:00", items: [{ name: "Whole Roast Chicken", quantity: 1, price: 450 }, { name: "Farm Fresh Eggs (12 pcs)", quantity: 2, price: 84 }], subtotal: 618, discount: 30.9, tax: 29.38, total: 616.48, paymentMethod: "UPI" },
  { billNumber: "MG-003", date: "25/02/2026", time: "18:30:00", items: [{ name: "Fresh Chicken Breast", quantity: 2.5, price: 280 }], subtotal: 700, discount: 35, tax: 33.25, total: 698.25, paymentMethod: "Card" },
  { billNumber: "MG-004", date: "24/02/2026", time: "09:15:00", items: [{ name: "Chicken Tikka", quantity: 1.5, price: 400 }, { name: "Chicken Naan", quantity: 6, price: 60 }], subtotal: 960, discount: 48, tax: 45.6, total: 957.6, paymentMethod: "UPI" },
  { billNumber: "MG-005", date: "24/02/2026", time: "12:40:00", items: [{ name: "Country Chicken - Cut Pieces", quantity: 1, price: 580 }], subtotal: 580, discount: 29, tax: 27.55, total: 578.55, paymentMethod: "Cash" },
  { billNumber: "MG-006", date: "24/02/2026", time: "16:20:00", items: [{ name: "Tandoori Chicken", quantity: 2, price: 380 }, { name: "Chicken Seekh Kebab", quantity: 1, price: 360 }], subtotal: 1120, discount: 56, tax: 53.2, total: 1117.2, paymentMethod: "UPI" },
  { billNumber: "MG-007", date: "23/02/2026", time: "10:00:00", items: [{ name: "Chicken Wings", quantity: 3, price: 240 }], subtotal: 720, discount: 36, tax: 34.2, total: 718.2, paymentMethod: "Card" },
  { billNumber: "MG-008", date: "23/02/2026", time: "14:55:00", items: [{ name: "Chicken Lolipop", quantity: 4, price: 300 }, { name: "Chicken Drumsticks", quantity: 2, price: 260 }], subtotal: 1720, discount: 86, tax: 81.7, total: 1715.7, paymentMethod: "UPI" },
  { billNumber: "MG-009", date: "23/02/2026", time: "19:30:00", items: [{ name: "Farm Fresh Eggs (30 pcs)", quantity: 2, price: 195 }], subtotal: 390, discount: 19.5, tax: 18.53, total: 389.03, paymentMethod: "Cash" },
  { billNumber: "MG-010", date: "22/02/2026", time: "11:10:00", items: [{ name: "Whole Roast Chicken", quantity: 2, price: 450 }, { name: "Chicken Gizzard", quantity: 1, price: 180 }], subtotal: 1080, discount: 54, tax: 51.3, total: 1077.3, paymentMethod: "UPI" },
  { billNumber: "MG-011", date: "22/02/2026", time: "15:45:00", items: [{ name: "Chicken Keema", quantity: 2, price: 350 }], subtotal: 700, discount: 35, tax: 33.25, total: 698.25, paymentMethod: "Card" },
  { billNumber: "MG-012", date: "22/02/2026", time: "20:00:00", items: [{ name: "Crispy Fried Chicken", quantity: 1.5, price: 320 }, { name: "Chicken Fries", quantity: 2, price: 180 }], subtotal: 840, discount: 42, tax: 39.9, total: 837.9, paymentMethod: "UPI" },
];

export default function OfflineBillsPage() {
  const [selectedBill, setSelectedBill] = useState<OfflineBill | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(offlineBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBills = offlineBills.slice(startIndex, startIndex + itemsPerPage);

  const handleViewBill = (bill: OfflineBill) => {
    setSelectedBill(bill);
    setIsSheetOpen(true);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
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
              {currentBills.map((bill) => (
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

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
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
