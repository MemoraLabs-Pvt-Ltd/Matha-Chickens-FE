import { useMemo } from "react";
import {
  DollarSign,
  ShoppingCart,
  Calculator,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StoreLayout } from "@/components/common/layout";
import { useStoreDashboard } from "@/hooks/useDashboard";
import type { OrderStatus } from "@/lib/api/orders";
import {
  formatInr,
  formatIsoDateEnGbNumeric,
  formatTrendVsYesterday,
} from "@/lib/display/formatting";
import { formatPhoneForDisplay } from "@/lib/display/phone";

const orderStatusStyles: Record<OrderStatus, string> = {
  order_received: "bg-[#dbeafe] text-[#1447e6]",
  dispatched: "bg-[#febebe] text-[#bb4d00]",
  delivered: "bg-[#dcfce7] text-[#016630]",
};

const orderStatusLabels: Record<OrderStatus, string> = {
  order_received: "Order Received",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export default function StoreDashboard() {
  const { data, isLoading } = useStoreDashboard();
  const dashboard = data?.data;

  const stats = useMemo(() => {
    const k = dashboard?.kpis;
    return [
      {
        title: "Today's Collection",
        value: k ? formatInr(k.today_collection.amount) : "—",
        trend: k ? formatTrendVsYesterday(k.today_collection.change_percent) : undefined,
        iconBg: "bg-[#e0f2fe] border border-[#bedbff]",
        icon: DollarSign,
        iconColor: "bg-[#2b7fff]",
        valueColor: "text-[#1c398e]",
        labelColor: "text-[#1447e6]",
        trendColor: "text-[#00a63e]",
      },
      {
        title: "Online Orders",
        value: k ? String(k.online_orders.count) : "—",
        subtitle: k ? formatInr(k.online_orders.amount) : undefined,
        iconBg: "bg-[#fef3c7] border border-[#fee685]",
        icon: ShoppingCart,
        iconColor: "bg-[#fe9a00]",
        valueColor: "text-[#7b3306]",
        labelColor: "text-[#bb4d00]",
      },
      {
        title: "Offline Bills",
        value: k ? String(k.offline_bills.count) : "—",
        subtitle: k ? formatInr(k.offline_bills.amount) : undefined,
        iconBg: "bg-[#f6fffb] border border-[#f3fcf6]",
        icon: Calculator,
        iconColor: "bg-[#00c950]",
        valueColor: "text-[#0d542b]",
        labelColor: "text-[#008236]",
      },
      {
        title: "Available Items",
        value: k ? String(k.available_items.available) : "—",
        subtitle: k
          ? `${k.available_items.out_of_stock} out of stock`
          : undefined,
        iconBg: "bg-[#f3e8ff] border border-[#e9d4ff]",
        icon: Package,
        iconColor: "bg-[#ad46ff]",
        valueColor: "text-[#59168b]",
        labelColor: "text-[#8200db]",
        subtitleColor: "text-[#e7000b]",
      },
    ];
  }, [dashboard]);

  const recentOrders = dashboard?.recent_orders ?? [];

  const orderStatuses = useMemo(() => {
    const b = dashboard?.order_status_breakdown;
    return [
      {
        label: "Pending",
        value: b?.order_received ?? 0,
        icon: Clock,
        bgColor: "bg-[#dbeafe]",
        iconColor: "text-[#1447e6]",
      },
      {
        label: "Dispatched",
        value: b?.dispatched ?? 0,
        icon: TrendingUp,
        bgColor: "bg-[#febebe]",
        iconColor: "text-[#bb4d00]",
      },
      {
        label: "Delivered",
        value: b?.delivered ?? 0,
        icon: CheckCircle,
        bgColor: "bg-[#dcfce7]",
        iconColor: "text-[#00a63e]",
      },
    ];
  }, [dashboard]);

  const inventoryItems = useMemo(() => {
    const inv = dashboard?.inventory_status;
    return [
      {
        label: "Available",
        value: inv?.available ?? 0,
        icon: CheckCircle,
        bgColor: "bg-[#dcfce7]",
        iconColor: "text-[#00a63e]",
      },
      {
        label: "Low stock",
        value: inv?.low_stock ?? 0,
        icon: AlertTriangle,
        bgColor: "bg-[#ffedd5]",
        iconColor: "text-[#c2410c]",
      },
      {
        label: "Out of Stock",
        value: inv?.out_of_stock ?? 0,
        icon: AlertTriangle,
        bgColor: "bg-[#ffe2e2]",
        iconColor: "text-[#bb4d00]",
      },
      {
        label: "Total Items",
        value: inv?.total_items ?? 0,
        icon: Layers,
        bgColor: "bg-[#dbeafe]",
        iconColor: "text-[#1447e6]",
      },
    ];
  }, [dashboard]);

  const performanceItems = useMemo(() => {
    const t = dashboard?.today_performance;
    return [
      {
        label: "Orders Received",
        value: t ? String(t.orders_received) : "—",
        valueColor: "text-[#155dfc]",
      },
      {
        label: "Bills Generated",
        value: t ? String(t.bills_generated) : "—",
        valueColor: "text-store",
      },
      {
        label: "Revenue",
        value: t ? formatInr(t.revenue) : "—",
        valueColor: "text-[#00a63e]",
      },
    ];
  }, [dashboard]);

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
              {isLoading ? (
                <Skeleton className="h-9 w-24 mt-1 rounded-lg" />
              ) : (
                <p className={`text-[30px] font-bold leading-9 tracking-wide ${stat.valueColor}`}>
                  {stat.value}
                </p>
              )}
              {(stat.trend || stat.subtitle) && !isLoading && (
                <div className="flex items-center gap-1 flex-wrap">
                  {stat.trend && (
                    <>
                      <TrendingUp className="size-4 text-[#00a63e]" />
                      <p className="text-sm font-medium leading-5 text-[#00a63e]">{stat.trend}</p>
                    </>
                  )}
                  {stat.subtitle && (
                    <p
                      className={`text-sm font-normal leading-5 ${stat.subtitleColor || stat.labelColor}`}
                    >
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
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index} className="h-[76.5px]">
                    <TableCell className="pl-6 py-4">
                      <Skeleton className="h-4 w-16 rounded-lg" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-28 rounded-lg mb-2" />
                      <Skeleton className="h-3 w-24 rounded-lg" />
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <Skeleton className="h-4 w-20 rounded-lg ml-auto" />
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Skeleton className="h-7 w-24 rounded-full mx-auto" />
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <Skeleton className="h-4 w-20 rounded-lg ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && recentOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No recent online orders
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                recentOrders.map((order) => (
                  <TableRow key={order.id} className="h-[76.5px]">
                    <TableCell className="pl-6 py-4">
                      <p className="text-base font-semibold text-foreground tracking-wide">
                        {order.order_code}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-base font-normal text-foreground tracking-wide">
                        {order.customer_name ?? "—"}
                      </p>
                      <p className="text-sm font-normal text-muted-foreground">
                        {order.customer_phone
                          ? formatPhoneForDisplay(order.customer_phone)
                          : "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <p className="text-base font-bold text-foreground tracking-wide">
                        {formatInr(order.total_amount)}
                      </p>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span
                        className={`inline-flex items-center justify-center h-7 rounded-full px-4 text-sm font-medium ${orderStatusStyles[order.status as OrderStatus]}`}
                      >
                        {orderStatusLabels[order.status as OrderStatus] ?? order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <p className="text-sm font-normal text-muted-foreground">
                        {formatIsoDateEnGbNumeric(order.created_at)}
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
                  <div className="text-xl font-bold text-foreground">
                    {isLoading ? <Skeleton className="h-7 w-8 inline-block" /> : item.value}
                  </div>
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
                  <div className="text-xl font-bold text-foreground">
                    {isLoading ? <Skeleton className="h-7 w-8 inline-block" /> : item.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Today&apos;s Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-col gap-4">
              {performanceItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between h-7">
                  <p className="text-base font-normal text-muted-foreground">
                    {item.label}
                  </p>
                  <div className={`text-xl font-bold ${item.valueColor}`}>
                    {isLoading ? <Skeleton className="h-7 w-20 inline-block" /> : item.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StoreLayout>
  );
}
