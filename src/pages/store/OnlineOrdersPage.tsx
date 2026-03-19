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
  {
    id: "ORD001",
    customer: "Priya Sharma",
    phone: "+91 98765 00001",
    address: "123, Brigade Road, Bangalore - 560001",
    items: [
      { name: "Fresh Chicken Breast", quantity: 2, price: 280 },
      { name: "Farm Fresh Eggs (12 pcs)", quantity: 1, price: 84 },
    ],
    subtotal: 644,
    discount: 32.2,
    tax: 30.59,
    total: 642.39,
    date: "24/02/2026",
    time: "10:30:00",
    status: "Order Received",
  },
  {
    id: "ORD002",
    customer: "Rajesh Kumar",
    phone: "+91 98765 00002",
    address: "456, MG Road, Bangalore - 560001",
    items: [
      { name: "Whole Roast Chicken", quantity: 1, price: 450 },
    ],
    subtotal: 450,
    discount: 0,
    tax: 22.5,
    total: 472.5,
    date: "23/02/2026",
    time: "14:15:00",
    status: "Dispatched",
  },
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
              {onlineOrders.map((order) => (
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
      </div>
      <OrderDetailsSheet
        order={selectedOrder}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </StoreLayout>
  );
}
