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
  {
    id: "ORD001",
    store: "Matha Chickens - MG Road",
    customer: "Priya Sharma",
    phone: "+91 98765 00001",
    address: "42, Green Park Colony, Indore",
    date: "24/02/2026",
    time: "10:30:00",
    total: "₹642.39",
    status: "received",
    items: [
      { name: "Chicken Curry (Boneless)", qty: 1, price: "₹320.00", total: "₹320.00" },
      { name: "Tandoori Chicken (Full)", qty: 1, price: "₹280.00", total: "₹280.00" },
      { name: "Butter Naan", qty: 2, price: "₹30.00", total: "₹60.00" },
    ],
    subtotal: "₹660.00",
    discount: "₹40.00",
    tax: "₹22.39",
  },
  {
    id: "ORD002",
    store: "Matha Chickens - MG Road",
    customer: "Rajesh Kumar",
    phone: "+91 98765 00002",
    address: "15-A, Saket Nagar, Indore",
    date: "23/02/2026",
    time: "14:15:00",
    total: "₹448.88",
    status: "dispatched",
    items: [
      { name: "Chicken Biryani (Full)", qty: 1, price: "₹280.00", total: "₹280.00" },
      { name: "Raita", qty: 2, price: "₹40.00", total: "₹80.00" },
      { name: "Salad", qty: 1, price: "₹30.00", total: "₹30.00" },
      { name: "Papad", qty: 2, price: "₹20.00", total: "₹40.00" },
    ],
    subtotal: "₹430.00",
    discount: "₹0.00",
    tax: "₹18.88",
  },
  {
    id: "ORD003",
    store: "Matha Chickens - Koramangala",
    customer: "Rajesh Kumar",
    phone: "+91 98765 00002",
    address: "78, LB Road, Mysore",
    date: "20/02/2026",
    time: "09:00:00",
    total: "₹1130.00",
    status: "delivered",
    items: [
      { name: "Whole Chicken (Grilled)", qty: 2, price: "₹450.00", total: "₹900.00" },
      { name: "Chicken Lollipop", qty: 1, price: "₹180.00", total: "₹180.00" },
      { name: "French Fries", qty: 1, price: "₹80.00", total: "₹80.00" },
    ],
    subtotal: "₹1160.00",
    discount: "₹80.00",
    tax: "₹50.00",
  },
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
              {orders.map((order) => (
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
        </div>
      </div>
    </AdminLayout>
    </>
  );
}
