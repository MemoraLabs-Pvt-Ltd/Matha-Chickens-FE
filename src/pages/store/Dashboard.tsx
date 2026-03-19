import { DollarSign, ShoppingCart, Calculator, Package, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StoreLayout } from "@/components/common/layout";

const stats = [
  {
    title: "Today's Collection",
    value: "₹0",
    trend: "+5.4%",
    iconBg: "bg-[#e0f2fe] border border-[#bedbff]",
    icon: DollarSign,
    iconColor: "bg-[#2b7fff]",
    valueColor: "text-[#1c398e]",
    labelColor: "text-[#1447e6]",
    trendColor: "text-[#00a63e]",
  },
  {
    title: "Online Orders",
    value: "0",
    subtitle: "₹0",
    iconBg: "bg-[#fef3c7] border border-[#fee685]",
    icon: ShoppingCart,
    iconColor: "bg-[#fe9a00]",
    valueColor: "text-[#7b3306]",
    labelColor: "text-[#bb4d00]",
  },
  {
    title: "Offline Bills",
    value: "0",
    subtitle: "₹0",
    iconBg: "bg-[#f6fffb] border border-[#f3fcf6]",
    icon: Calculator,
    iconColor: "bg-[#00c950]",
    valueColor: "text-[#0d542b]",
    labelColor: "text-[#008236]",
  },
  {
    title: "Available Items",
    value: "7",
    subtitle: "1 out of stock",
    iconBg: "bg-[#f3e8ff] border border-[#e9d4ff]",
    icon: Package,
    iconColor: "bg-[#ad46ff]",
    valueColor: "text-[#59168b]",
    labelColor: "text-[#8200db]",
    subtitleColor: "text-[#e7000b]",
  },
];

const orders = [
  {
    id: "ORD001",
    customer: "Priya Sharma",
    phone: "+91 98765 00001",
    amount: "₹642.39",
    status: "Order Received" as const,
    statusBg: "bg-[#dbeafe]",
    statusColor: "text-[#1447e6]",
    date: "24/02/2026",
  },
  {
    id: "ORD002",
    customer: "Rajesh Kumar",
    phone: "+91 98765 00002",
    amount: "₹448.88",
    status: "Dispatched" as const,
    statusBg: "bg-[#febebe]",
    statusColor: "text-[#bb4d00]",
    date: "23/02/2026",
  },
];

const orderStatuses = [
  { label: "Pending", value: 1, icon: Clock, bgColor: "bg-[#dbeafe]", iconColor: "text-[#1447e6]" },
  { label: "Dispatched", value: 1, icon: TrendingUp, bgColor: "bg-[#febebe]", iconColor: "text-[#bb4d00]" },
  { label: "Delivered", value: 0, icon: CheckCircle, bgColor: "bg-[#dcfce7]", iconColor: "text-[#00a63e]" },
];

const inventoryItems = [
  { label: "Available", value: 7, icon: CheckCircle, bgColor: "bg-[#dcfce7]", iconColor: "text-[#00a63e]" },
  { label: "Out of Stock", value: 1, icon: AlertTriangle, bgColor: "bg-[#ffe2e2]", iconColor: "text-[#bb4d00]" },
  { label: "Total Items", value: 8, icon: Package, bgColor: "bg-[#dbeafe]", iconColor: "text-[#1447e6]" },
];

const performanceItems = [
  { label: "Orders Received", value: "0", valueColor: "text-[#155dfc]" },
  { label: "Bills Generated", value: "0", valueColor: "text-store" },
  { label: "Revenue", value: "₹0", valueColor: "text-[#00a63e]" },
];

export default function StoreDashboard() {
  return (
    <StoreLayout title="Dashboard">
      <div className="grid grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`border rounded-[14px] p-6 flex items-center justify-between shadow-sm ${stat.iconBg}`}
          >
            <div className="flex flex-col gap-1">
              <p className={`text-sm font-medium leading-5 ${stat.labelColor}`}>{stat.title}</p>
              <p className={`text-[30px] font-bold leading-9 tracking-wide ${stat.valueColor}`}>{stat.value}</p>
              {(stat.trend || stat.subtitle) && (
                <div className="flex items-center gap-1">
                  {stat.trend && (
                    <>
                      <TrendingUp className="size-4 text-[#00a63e]" />
                      <p className="text-sm font-medium leading-5 text-[#00a63e]">{stat.trend}</p>
                    </>
                  )}
                  {stat.subtitle && (
                    <p className={`text-sm font-normal leading-5 ${stat.subtitleColor || stat.labelColor}`}>
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div
              className={`rounded-[14px] size-12 flex items-center justify-center shadow-sm ${stat.iconColor}`}
            >
              <stat.icon className="size-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      <Card className="rounded-xl border border-border shadow-sm mb-6">
        <CardHeader className="border-b border-border px-6 py-6">
          <CardTitle className="text-lg font-semibold text-foreground tracking-wide">
            Recent Online Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-left py-4 pl-6 text-sm font-semibold text-muted-foreground">
                  Order ID
                </TableHead>
                <TableHead className="text-left py-4 text-sm font-semibold text-muted-foreground">
                  Customer
                </TableHead>
                <TableHead className="text-right py-4 pr-6 text-sm font-semibold text-muted-foreground">
                  Amount
                </TableHead>
                <TableHead className="text-center py-4 text-sm font-semibold text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right py-4 pr-6 text-sm font-semibold text-muted-foreground">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="h-[76.5px]">
                  <TableCell className="pl-6 py-4">
                    <p className="text-base font-semibold text-foreground tracking-wide">
                      {order.id}
                    </p>
                  </TableCell>
                  <TableCell className="py-4">
                    <p className="text-base font-normal text-foreground tracking-wide">
                      {order.customer}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {order.phone}
                    </p>
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <p className="text-base font-bold text-foreground tracking-wide">
                      {order.amount}
                    </p>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span
                      className={`inline-flex items-center justify-center h-7 rounded-full px-4 text-sm font-medium ${order.statusBg} ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <p className="text-sm font-normal text-muted-foreground">
                      {order.date}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-col gap-4">
              {orderStatuses.map((item) => (
                <div key={item.label} className="flex items-center justify-between h-10">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${item.bgColor}`}>
                      <item.icon className={`size-5 ${item.iconColor}`} />
                    </div>
                    <p className="text-base font-normal text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-col gap-4">
              {inventoryItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between h-10">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${item.bgColor}`}>
                      <item.icon className={`size-5 ${item.iconColor}`} />
                    </div>
                    <p className="text-base font-normal text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Today's Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-col gap-4">
              {performanceItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between h-7">
                  <p className="text-base font-normal text-muted-foreground">
                    {item.label}
                  </p>
                  <p className={`text-xl font-bold ${item.valueColor}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StoreLayout>
  );
}
