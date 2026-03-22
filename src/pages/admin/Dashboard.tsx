import { useMemo } from "react";
import {
  FaRegMoneyBillAlt,
  FaRegClock,
  FaRegCheckCircle,
  FaExclamationTriangle,
  FaArchive,
  FaBoxOpen,
} from "react-icons/fa";
import { DashboardLayout } from "@/components/common/layout";
import { ShoppingCart } from "lucide-react";
import { useAdminDashboard } from "@/hooks/useDashboard";
import {
  formatInr,
  formatIsoDateEnGbNumeric,
  formatTrendVsYesterday,
} from "@/lib/display/formatting";
import { formatPhoneForDisplay } from "@/lib/display/phone";

const statusMap = {
  order_received: "received",
  dispatched: "dispatched",
  delivered: "delivered",
} as const;

export default function Dashboard() {
  const { data, isLoading } = useAdminDashboard();
  const dashboard = data?.data;

  const stats = useMemo(() => {
    const k = dashboard?.kpis;
    return [
      {
        title: "Today's Collection",
        value: k ? formatInr(k.today_collection.amount) : "—",
        trend: k ? formatTrendVsYesterday(k.today_collection.change_percent) : undefined,
        iconBg: "bg-[#e0f2fe] border border-[#bedbff]",
        icon: FaRegMoneyBillAlt,
        iconColor: "bg-[#2b7fff]",
      },
      {
        title: "Pending Revenue",
        value: k ? formatInr(k.pending_revenue.amount) : "—",
        subtitle: k ? `${k.pending_revenue.orders_count} orders` : undefined,
        iconBg: "bg-[#fef3c7] border border-[#fee685]",
        icon: FaRegClock,
        iconColor: "bg-[#fe9a00]",
      },
      {
        title: "Delivered Revenue",
        value: k ? formatInr(k.delivered_revenue.amount) : "—",
        subtitle: k ? `${k.delivered_revenue.orders_count} orders` : undefined,
        iconBg: "bg-[#d1fae5] border border-[#b9f8cf]",
        icon: FaRegCheckCircle,
        iconColor: "bg-[#00c950]",
      },
      {
        title: "Total Orders (today)",
        value: k ? String(k.total_orders.count) : "—",
        trend: k ? formatTrendVsYesterday(k.total_orders.change_percent) : undefined,
        iconBg: "bg-[#f3e8ff] border border-[#e9d4ff]",
        icon: ShoppingCart,
        iconColor: "bg-[#ad46ff]",
      },
    ];
  }, [dashboard]);

  const executiveSummary = useMemo(() => {
    const e = dashboard?.executive_summary;
    return {
      stockValue: e ? formatInr(e.total_stock_value) : "—",
      pending: e ? `${e.pending_orders_count} orders` : "—",
      delivered: e ? `${e.delivered_orders_count} orders` : "—",
      activeCustomers: e ? String(e.active_customers_count) : "—",
    };
  }, [dashboard]);

  const orders = useMemo(() => {
    return (dashboard?.recent_orders ?? []).map((order) => ({
      id: order.order_code,
      customer: order.customer_name ?? "—",
      phone: order.customer_phone
        ? formatPhoneForDisplay(order.customer_phone)
        : "—",
      store: order.store_name,
      amount: formatInr(order.total_amount),
      status: statusMap[order.status as keyof typeof statusMap] ?? "received",
      date: formatIsoDateEnGbNumeric(order.created_at),
    }));
  }, [dashboard]);

  const orderStatuses = useMemo(() => {
    const b = dashboard?.order_status_breakdown;
    return [
      {
        label: "Pending",
        value: b?.order_received ?? 0,
        icon: FaRegClock,
        bgColor: "bg-[#dbeafe]",
      },
      {
        label: "Dispatched",
        value: b?.dispatched ?? 0,
        icon: FaExclamationTriangle,
        bgColor: "bg-[#fef3c6]",
      },
      {
        label: "Delivered",
        value: b?.delivered ?? 0,
        icon: FaRegCheckCircle,
        bgColor: "bg-[#dcfce7]",
      },
    ];
  }, [dashboard]);

  const inventoryAlerts = useMemo(() => {
    const inv = dashboard?.inventory_alerts;
    return [
      {
        label: "Available",
        value: inv?.available ?? 0,
        icon: FaArchive,
        bgColor: "bg-[#dcfce7]",
      },
      {
        label: "Low stock",
        value: inv?.low_stock ?? 0,
        icon: FaExclamationTriangle,
        bgColor: "bg-[#ffe2e2]",
      },
      {
        label: "Out of stock",
        value: inv?.out_of_stock ?? 0,
        icon: FaBoxOpen,
        bgColor: "bg-[#fee2e2]",
      },
    ];
  }, [dashboard]);

  const storeStats = useMemo(() => {
    const sp = dashboard?.store_performance;
    const k = dashboard?.kpis;
    const avg =
      sp && sp.total_stores > 0 && k
        ? (k.total_orders.count / sp.total_stores).toFixed(1)
        : "0.0";
    return [
      { label: "Active Stores", value: sp?.active_stores ?? "—", valueColor: "text-admin" },
      { label: "Total Stores", value: sp?.total_stores ?? "—" },
      { label: "Avg orders / store (today)", value: avg, valueColor: "#155dfc" },
    ];
  }, [dashboard]);

  return (
    <DashboardLayout
      stats={stats}
      executiveSummary={executiveSummary}
      orders={orders}
      orderStatuses={orderStatuses}
      inventoryAlerts={inventoryAlerts}
      storeStats={storeStats}
      isLoading={isLoading}
      ordersCurrentPage={1}
      ordersTotalPages={1}
      onOrdersPageChange={undefined}
    />
  );
}
