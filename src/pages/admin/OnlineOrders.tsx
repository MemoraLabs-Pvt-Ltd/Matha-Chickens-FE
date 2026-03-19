import { Eye } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { ViewOrderSheet } from "@/components/admin/orders/ViewOrderSheet";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
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

interface OrderItem {
  name: string;
  qty: number;
  price: string;
  total: string;
}

interface Order {
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
}

const orders: Order[] = [
  { id: "ORD001", store: "Matha Chickens - MG Road", customer: "Priya Sharma", phone: "+91 98765 00001", address: "42, Green Park Colony, Indore", date: "24/02/2026", time: "10:30:00", total: "₹642.39", status: "received", items: [{ name: "Chicken Curry (Boneless)", qty: 1, price: "₹320.00", total: "₹320.00" }, { name: "Tandoori Chicken (Full)", qty: 1, price: "₹280.00", total: "₹280.00" }, { name: "Butter Naan", qty: 2, price: "₹30.00", total: "₹60.00" }], subtotal: "₹660.00", discount: "₹40.00", tax: "₹22.39" },
  { id: "ORD002", store: "Matha Chickens - MG Road", customer: "Rajesh Kumar", phone: "+91 98765 00002", address: "15-A, Saket Nagar, Indore", date: "23/02/2026", time: "14:15:00", total: "₹448.88", status: "dispatched", items: [{ name: "Chicken Biryani (Full)", qty: 1, price: "₹280.00", total: "₹280.00" }, { name: "Raita", qty: 2, price: "₹40.00", total: "₹80.00" }], subtotal: "₹430.00", discount: "₹0.00", tax: "₹18.88" },
  { id: "ORD003", store: "Matha Chickens - Koramangala", customer: "Anita Patel", phone: "+91 98765 00003", address: "78, LB Road, Mysore", date: "23/02/2026", time: "09:00:00", total: "₹1130.00", status: "delivered", items: [{ name: "Whole Chicken (Grilled)", qty: 2, price: "₹450.00", total: "₹900.00" }, { name: "Chicken Lollipop", qty: 1, price: "₹180.00", total: "₹180.00" }], subtotal: "₹1160.00", discount: "₹80.00", tax: "₹50.00" },
  { id: "ORD004", store: "Matha Chickens - Whitefield", customer: "Vikram Singh", phone: "+91 98765 00004", address: "42, Tech Park Road, Bangalore", date: "22/02/2026", time: "12:30:00", total: "₹890.50", status: "received", items: [{ name: "Chicken Tikka", qty: 2, price: "₹320.00", total: "₹640.00" }, { name: "Naan", qty: 4, price: "₹40.00", total: "₹160.00" }, { name: "Lassi", qty: 2, price: "₹45.00", total: "₹90.00" }], subtotal: "₹890.00", discount: "₹0.00", tax: "₹39.95" },
  { id: "ORD005", store: "Matha Chickens - MG Road", customer: "Meera Reddy", phone: "+91 98765 00005", address: "15, MG Road, Indore", date: "22/02/2026", time: "19:45:00", total: "₹567.20", status: "dispatched", items: [{ name: "Crispy Chicken", qty: 1, price: "₹380.00", total: "₹380.00" }, { name: "French Fries", qty: 1, price: "₹80.00", total: "₹80.00" }, { name: "Cold Drink", qty: 2, price: "₹40.00", total: "₹80.00" }], subtotal: "₹540.00", discount: "₹0.00", tax: "₹27.20" },
  { id: "ORD006", store: "Matha Chickens - Koramangala", customer: "Arun Kumar", phone: "+91 98765 00006", address: "88, 5th Block, Koramangala", date: "21/02/2026", time: "13:20:00", total: "₹1245.00", status: "delivered", items: [{ name: "Tandoori Full Chicken", qty: 2, price: "₹480.00", total: "₹960.00" }, { name: "Seekh Kebab", qty: 1, price: "₹220.00", total: "₹220.00" }], subtotal: "₹1180.00", discount: "₹0.00", tax: "₹59.00" },
  { id: "ORD007", store: "Matha Chickens - Whitefield", customer: "Sunita Devi", phone: "+91 98765 00007", address: "56, ITPL Main Road, Bangalore", date: "21/02/2026", time: "20:15:00", total: "₹423.75", status: "received", items: [{ name: "Chicken Wings (6 pcs)", qty: 2, price: "₹180.00", total: "₹360.00" }, { name: "Coleslaw", qty: 1, price: "₹60.00", total: "₹60.00" }], subtotal: "₹420.00", discount: "₹0.00", tax: "₹21.00" },
  { id: "ORD008", store: "Matha Chickens - MG Road", customer: "Kiran Nair", phone: "+91 98765 00008", address: "23, Palace Road, Indore", date: "20/02/2026", time: "11:00:00", total: "₹756.30", status: "dispatched", items: [{ name: "Chicken 65", qty: 2, price: "₹220.00", total: "₹440.00" }, { name: "Chicken Fried Rice", qty: 1, price: "₹180.00", total: "₹180.00" }], subtotal: "₹620.00", discount: "₹0.00", tax: "₹31.00" },
  { id: "ORD009", store: "Matha Chickens - Koramangala", customer: "Lakshmi Sharma", phone: "+91 98765 00009", address: "12, 6th Block, Koramangala", date: "20/02/2026", time: "15:30:00", total: "₹1890.00", status: "delivered", items: [{ name: "Special Chicken Platter", qty: 1, price: "₹1500.00", total: "₹1500.00" }, { name: "Paneer Tikka", qty: 2, price: "₹180.00", total: "₹360.00" }], subtotal: "₹1860.00", discount: "₹0.00", tax: "₹93.00" },
  { id: "ORD010", store: "Matha Chickens - Whitefield", customer: "Ravi Shankar", phone: "+91 98765 00010", address: "34, Brookfield, Bangalore", date: "19/02/2026", time: "18:00:00", total: "₹634.88", status: "received", items: [{ name: "Chicken Lolipop", qty: 3, price: "₹160.00", total: "₹480.00" }, { name: "Dragon Chicken", qty: 1, price: "₹140.00", total: "₹140.00" }], subtotal: "₹620.00", discount: "₹0.00", tax: "₹31.00" },
  { id: "ORD011", store: "Matha Chickens - MG Road", customer: "Geetha Krishnan", phone: "+91 98765 00011", address: "67, New Palasia, Indore", date: "19/02/2026", time: "21:30:00", total: "₹945.60", status: "dispatched", items: [{ name: "Butter Chicken", qty: 2, price: "₹320.00", total: "₹640.00" }, { name: "Garlic Naan", qty: 4, price: "₹50.00", total: "₹200.00" }, { name: "Sweet Lassi", qty: 2, price: "₹60.00", total: "₹120.00" }], subtotal: "₹960.00", discount: "₹30.00", tax: "₹46.50" },
  { id: "ORD012", store: "Matha Chickens - Koramangala", customer: "Suresh Babu", phone: "+91 98765 00012", address: "91, HSR Layout, Bangalore", date: "18/02/2026", time: "14:45:00", total: "₹712.50", status: "delivered", items: [{ name: "Chicken Biryani (Half)", qty: 3, price: "₹180.00", total: "₹540.00" }, { name: "Raita", qty: 3, price: "₹40.00", total: "₹120.00" }], subtotal: "₹660.00", discount: "₹0.00", tax: "₹33.00" },
];

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

export default function OnlineOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { currentPage, setCurrentPage, totalPages, currentItems, getPageNumbers } = usePagination(orders);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  return (
    <>
      <ViewOrderSheet
        order={selectedOrder}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
      <AdminLayout title="Online Orders">
      <div className="bg-[#fafafa]">
        <p className="text-base text-[#525252] mb-6">
          Monitor and manage online orders from customers
        </p>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] px-4 py-3 flex items-center gap-4 mb-6">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <Select defaultValue="all-stores">
            <SelectTrigger className="w-[192px] bg-[#f3f3f5] border-transparent rounded-lg h-9 text-sm font-medium text-[#0a0a0a]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-stores">All Stores</SelectItem>
              <SelectItem value="mg-road">Matha Chickens - MG Road</SelectItem>
              <SelectItem value="koramangala">Matha Chickens - Koramangala</SelectItem>
              <SelectItem value="whitefield">Matha Chickens - Whitefield</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-[192px] bg-[#f3f3f5] border-transparent rounded-lg h-9 text-sm font-medium text-[#0a0a0a]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="received">Order Received</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Order ID
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Store
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Customer
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Phone
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Date & Time
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Total
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Status
                </TableHead>
                <TableHead className="text-right py-[10px] pr-2 text-sm font-medium text-[#0a0a0a]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                >
                  <TableCell className="py-3 pl-2 text-sm font-medium text-[#0a0a0a]">
                    {order.id}
                  </TableCell>
                  <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                    {order.store}
                  </TableCell>
                  <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                    {order.customer}
                  </TableCell>
                  <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                    {order.phone}
                  </TableCell>
                  <TableCell className="py-3 pl-2">
                    <div className="text-sm text-[#0a0a0a]">
                      <p>{order.date}</p>
                      <p className="text-muted-foreground">{order.time}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 pl-2 text-sm font-semibold text-[#0a0a0a]">
                    {order.total}
                  </TableCell>
                  <TableCell className="py-3 pl-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${
                        statusStyles[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pr-2">
                    <div className="flex items-center justify-end">
                      <button
                        className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        onClick={() => handleViewOrder(order)}
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
