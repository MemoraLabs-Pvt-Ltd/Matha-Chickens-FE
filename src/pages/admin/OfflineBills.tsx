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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

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
  { id: "MG-001", billNumber: "MG-001", store: "Matha Chickens - MG Road", date: "25/02/2026", time: "11:20:00", subtotal: "₹880.00", discount: "-₹44.00", tax: "₹41.80", total: "₹877.80", payment: "Cash", items: [{ name: "Crispy Fried Chicken", qty: 2, price: "₹320.00", total: "₹640.00" }, { name: "Chicken Wings", qty: 1, price: "₹240.00", total: "₹240.00" }] },
  { id: "MG-002", billNumber: "MG-002", store: "Matha Chickens - MG Road", date: "25/02/2026", time: "15:45:00", subtotal: "₹252.00", discount: "-₹12.60", tax: "₹11.97", total: "₹251.37", payment: "UPI", items: [{ name: "Chicken Curry (Boneless)", qty: 1, price: "₹180.00", total: "₹180.00" }] },
  { id: "KOR-001", billNumber: "KOR-001", store: "Matha Chickens - Koramangala", date: "24/02/2026", time: "16:30:00", subtotal: "₹840.00", discount: "-₹0.00", tax: "₹0.00", total: "₹840.00", payment: "Card", items: [{ name: "Whole Chicken (Grilled)", qty: 2, price: "₹350.00", total: "₹700.00" }, { name: "Chicken Lollipop", qty: 1, price: "₹140.00", total: "₹140.00" }] },
  { id: "WH-001", billNumber: "WH-001", store: "Matha Chickens - Whitefield", date: "24/02/2026", time: "12:15:00", subtotal: "₹640.00", discount: "-₹32.00", tax: "₹30.40", total: "₹638.40", payment: "Cash", items: [{ name: "Chicken Tikka", qty: 2, price: "₹280.00", total: "₹560.00" }, { name: "Naan", qty: 2, price: "₹40.00", total: "₹80.00" }] },
  { id: "MG-003", billNumber: "MG-003", store: "Matha Chickens - MG Road", date: "23/02/2026", time: "10:30:00", subtotal: "₹1200.00", discount: "-₹60.00", tax: "₹57.00", total: "₹1197.00", payment: "UPI", items: [{ name: "Tandoori Full Chicken", qty: 2, price: "₹480.00", total: "₹960.00" }, { name: "Seekh Kebab", qty: 1, price: "₹180.00", total: "₹180.00" }] },
  { id: "KOR-002", billNumber: "KOR-002", store: "Matha Chickens - Koramangala", date: "23/02/2026", time: "14:00:00", subtotal: "₹380.00", discount: "-₹0.00", tax: "₹18.10", total: "₹398.10", payment: "Card", items: [{ name: "Chicken Wings", qty: 1, price: "₹280.00", total: "₹280.00" }, { name: "French Fries", qty: 1, price: "₹80.00", total: "₹80.00" }] },
  { id: "WH-002", billNumber: "WH-002", store: "Matha Chickens - Whitefield", date: "22/02/2026", time: "18:45:00", subtotal: "₹560.00", discount: "-₹28.00", tax: "₹26.60", total: "₹558.60", payment: "Cash", items: [{ name: "Chicken 65", qty: 2, price: "₹200.00", total: "₹400.00" }, { name: "Lassi", qty: 2, price: "₹60.00", total: "₹120.00" }] },
  { id: "MG-004", billNumber: "MG-004", store: "Matha Chickens - MG Road", date: "22/02/2026", time: "20:30:00", subtotal: "₹920.00", discount: "-₹46.00", tax: "₹43.70", total: "₹917.70", payment: "UPI", items: [{ name: "Butter Chicken", qty: 2, price: "₹320.00", total: "₹640.00" }, { name: "Garlic Naan", qty: 4, price: "₹50.00", total: "₹200.00" }] },
  { id: "KOR-003", billNumber: "KOR-003", store: "Matha Chickens - Koramangala", date: "21/02/2026", time: "11:15:00", subtotal: "₹1480.00", discount: "-₹74.00", tax: "₹70.30", total: "₹1476.30", payment: "Card", items: [{ name: "Special Chicken Platter", qty: 1, price: "₹1200.00", total: "₹1200.00" }, { name: "Paneer Tikka", qty: 2, price: "₹140.00", total: "₹280.00" }] },
  { id: "WH-003", billNumber: "WH-003", store: "Matha Chickens - Whitefield", date: "21/02/2026", time: "15:00:00", subtotal: "₹440.00", discount: "-₹22.00", tax: "₹20.90", total: "₹438.90", payment: "Cash", items: [{ name: "Dragon Chicken", qty: 2, price: "₹180.00", total: "₹360.00" }, { name: "Fried Rice", qty: 1, price: "₹80.00", total: "₹80.00" }] },
  { id: "MG-005", billNumber: "MG-005", store: "Matha Chickens - MG Road", date: "20/02/2026", time: "13:45:00", subtotal: "₹760.00", discount: "-₹38.00", tax: "₹36.10", total: "₹758.10", payment: "UPI", items: [{ name: "Chicken Biryani (Full)", qty: 2, price: "₹280.00", total: "₹560.00" }, { name: "Raita", qty: 4, price: "₹40.00", total: "₹160.00" }] },
  { id: "KOR-004", billNumber: "KOR-004", store: "Matha Chickens - Koramangala", date: "20/02/2026", time: "19:30:00", subtotal: "₹680.00", discount: "-₹34.00", tax: "₹32.30", total: "₹678.30", payment: "Card", items: [{ name: "Chicken Lolipop", qty: 4, price: "₹120.00", total: "₹480.00" }, { name: "Coleslaw", qty: 2, price: "₹60.00", total: "₹120.00" }] },
];

const paymentStyles = {
  Cash: "bg-muted text-foreground",
  UPI: "bg-muted text-foreground",
  Card: "bg-muted text-foreground",
};

export default function OfflineBills() {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { currentPage, setCurrentPage, totalPages, currentItems, getPageNumbers } = usePagination(bills);

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
                {currentItems.map((bill) => (
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
            {totalPages > 1 && (
              <div className="py-4 px-4 border-t border-[rgba(0,0,0,0.1)]">
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
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
