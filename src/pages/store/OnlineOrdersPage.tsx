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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { OrderDetailsSheet } from "./OrderDetailsSheet";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OnlineOrder {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  date: string;
  time: string;
  status: "Order Received" | "Preparing" | "Dispatched" | "Delivered";
}

const onlineOrders: OnlineOrder[] = [
  { id: "ORD001", customer: "Priya Sharma", phone: "+91 98765 00001", address: "123, Brigade Road, Bangalore - 560001", items: [{ name: "Fresh Chicken Breast", quantity: 2, price: 280 }, { name: "Farm Fresh Eggs (12 pcs)", quantity: 1, price: 84 }], subtotal: 644, discount: 32.2, tax: 30.59, total: 642.39, date: "24/02/2026", time: "10:30:00", status: "Order Received" },
  { id: "ORD002", customer: "Rajesh Kumar", phone: "+91 98765 00002", address: "456, MG Road, Bangalore - 560001", items: [{ name: "Whole Roast Chicken", quantity: 1, price: 450 }], subtotal: 450, discount: 0, tax: 22.5, total: 472.5, date: "23/02/2026", time: "14:15:00", status: "Dispatched" },
  { id: "ORD003", customer: "Anita Desai", phone: "+91 98765 00003", address: "789, Indiranagar, Bangalore - 560038", items: [{ name: "Crispy Fried Chicken", quantity: 2, price: 320 }, { name: "Chicken Wings", quantity: 1, price: 240 }], subtotal: 880, discount: 44, tax: 41.8, total: 877.8, date: "23/02/2026", time: "18:45:00", status: "Delivered" },
  { id: "ORD004", customer: "Vikram Singh", phone: "+91 98765 00004", address: "321, Whitefield, Bangalore - 560066", items: [{ name: "Country Chicken - Cut Pieces", quantity: 1.5, price: 580 }], subtotal: 870, discount: 43.5, tax: 41.33, total: 867.83, date: "22/02/2026", time: "12:00:00", status: "Preparing" },
  { id: "ORD005", customer: "Meera Patel", phone: "+91 98765 00005", address: "654, Koramangala, Bangalore - 560034", items: [{ name: "Chicken Tikka", quantity: 2, price: 400 }, { name: "Chicken Biryani Cut", quantity: 1, price: 290 }], subtotal: 1090, discount: 54.5, tax: 51.78, total: 1087.28, date: "22/02/2026", time: "20:30:00", status: "Order Received" },
  { id: "ORD006", customer: "Arun Kumar", phone: "+91 98765 00006", address: "987, HSR Layout, Bangalore - 560102", items: [{ name: "Chicken Lolipop", quantity: 3, price: 300 }], subtotal: 900, discount: 45, tax: 42.75, total: 897.75, date: "21/02/2026", time: "14:20:00", status: "Dispatched" },
  { id: "ORD007", customer: "Sunita Reddy", phone: "+91 98765 00007", address: "147, Marathahalli, Bangalore - 560037", items: [{ name: "Tandoori Chicken", quantity: 2, price: 380 }], subtotal: 760, discount: 38, tax: 36.1, total: 758.1, date: "21/02/2026", time: "19:15:00", status: "Delivered" },
  { id: "ORD008", customer: "Kiran Nair", phone: "+91 98765 00008", address: "258, Electronic City, Bangalore - 560100", items: [{ name: "Chicken Keema", quantity: 1.5, price: 350 }, { name: "Chicken Naan", quantity: 4, price: 60 }], subtotal: 765, discount: 38.25, tax: 36.34, total: 763.09, date: "20/02/2026", time: "21:00:00", status: "Preparing" },
  { id: "ORD009", customer: "Lakshmi Devi", phone: "+91 98765 00009", address: "369, Jayanagar, Bangalore - 560011", items: [{ name: "Farm Fresh Eggs (30 pcs)", quantity: 2, price: 195 }], subtotal: 390, discount: 19.5, tax: 18.53, total: 389.03, date: "20/02/2026", time: "10:45:00", status: "Order Received" },
  { id: "ORD010", customer: "Suresh Babu", phone: "+91 98765 00010", address: "741, Rajajinagar, Bangalore - 560010", items: [{ name: "Chicken Malai Tikka", quantity: 2, price: 420 }, { name: "Chicken Seekh Kebab", quantity: 1, price: 360 }], subtotal: 1200, discount: 60, tax: 57, total: 1197, date: "19/02/2026", time: "15:30:00", status: "Dispatched" },
  { id: "ORD011", customer: "Geetha Krishnan", phone: "+91 98765 00011", address: "852, Malleswaram, Bangalore - 560003", items: [{ name: "Chicken Spring Chicken", quantity: 1, price: 380 }], subtotal: 380, discount: 19, tax: 18.05, total: 379.05, date: "19/02/2026", time: "13:00:00", status: "Delivered" },
  { id: "ORD012", customer: "Ravi Shankar", phone: "+91 98765 00012", address: "963, Frazer Town, Bangalore - 560005", items: [{ name: "Chicken Boneless", quantity: 2, price: 360 }, { name: "Chicken Stock (1L)", quantity: 2, price: 150 }], subtotal: 1020, discount: 51, tax: 48.45, total: 1017.45, date: "18/02/2026", time: "17:45:00", status: "Preparing" },
];

const statusStyles: Record<OnlineOrder["status"], { bg: string; text: string }> = {
  "Order Received": { bg: "bg-[#dbeafe]", text: "text-[#193cb8]" },
  "Preparing": { bg: "bg-[#fef3c6]", text: "text-[#973c00]" },
  "Dispatched": { bg: "bg-[#fef3c6]", text: "text-[#973c00]" },
  "Delivered": { bg: "bg-[#dcfce7]", text: "text-[#016630]" },
};

export default function OnlineOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<OnlineOrder | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { currentPage, setCurrentPage, totalPages, currentItems, getPageNumbers } = usePagination(onlineOrders);

  const handleViewOrder = (order: OnlineOrder) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  return (
    <StoreLayout title="Online Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-base text-foreground">
            Manage online orders from customers
          </p>
          <Select defaultValue="all">
            <SelectTrigger className="w-48 h-9 bg-muted border-transparent rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="order-received">Order Received</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Order ID
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Customer
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Phone
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Date & Time
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Total
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right py-3 pr-4 text-sm font-medium text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((order) => (
                <TableRow key={order.id} className="border-b border-border">
                  <TableCell className="py-4 pl-4">
                    <span className="text-sm font-medium text-foreground">
                      {order.id}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <span className="text-sm text-foreground">
                      {order.customer}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <span className="text-sm text-foreground">
                      {order.phone}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <div className="text-sm text-foreground">{order.date}</div>
                    <div className="text-xs text-muted-foreground">{order.time}</div>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <span className="text-sm font-semibold text-foreground">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pl-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-4 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 hover:bg-muted"
                      onClick={() => handleViewOrder(order)}
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
      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </StoreLayout>
  );
}
