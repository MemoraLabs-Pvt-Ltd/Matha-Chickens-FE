import {
  FaRegMoneyBillAlt,
  FaRegClock,
  FaRegCheckCircle,
  FaRegUser,
  FaExclamationTriangle,
  FaArchive,
} from "react-icons/fa";
import { DashboardLayout } from "@/components/common/layout";
import { ShoppingCart } from "lucide-react";

const stats = [
  {
    title: "Today's Collection",
    value: "₹0",
    trend: "+8.2%",
    iconBg: "bg-[#e0f2fe] border border-[#bedbff]",
    icon: FaRegMoneyBillAlt,
    iconColor: "bg-[#2b7fff]",
  },
  {
    title: "Pending Revenue",
    value: "₹0",
    subtitle: "2 orders",
    iconBg: "bg-[#fef3c7] border border-[#fee685]",
    icon: FaRegClock,
    iconColor: "bg-[#fe9a00]",
  },
  {
    title: "Delivered Revenue",
    value: "₹0",
    subtitle: "1 orders",
    iconBg: "bg-[#d1fae5] border border-[#b9f8cf]",
    icon: FaRegCheckCircle,
    iconColor: "bg-[#00c950]",
  },
  {
    title: "Total Orders",
    value: "3",
    trend: "+12.5%",
    iconBg: "bg-[#f3e8ff] border border-[#e9d4ff]",
    icon: ShoppingCart,
    iconColor: "bg-[#ad46ff]",
  },
];

const executiveSummary = {
  totalBilled: "4190",
  pending: "2 orders",
  delivered: "1 orders",
  activeCustomers: "2",
};

const orders = [
  {
    id: "ORD001",
    customer: "Priya Sharma",
    phone: "+91 98765 00001",
    store: "Matha Chickens - MG Road",
    amount: "₹642.39",
    status: "received" as const,
    date: "24/02/2026",
  },
  {
    id: "ORD002",
    customer: "Rajesh Kumar",
    phone: "+91 98765 00002",
    store: "Matha Chickens - MG Road",
    amount: "₹448.88",
    status: "dispatched" as const,
    date: "23/02/2026",
  },
  {
    id: "ORD003",
    customer: "Rajesh Kumar",
    phone: "+91 98765 00002",
    store: "Matha Chickens - Koramangala",
    amount: "₹1130.00",
    status: "delivered" as const,
    date: "20/02/2026",
  },
];

const orderStatuses = [
  { label: "Pending", value: 1, icon: FaRegClock, bgColor: "bg-[#dbeafe]" },
  {
    label: "Dispatched",
    value: 1,
    icon: FaExclamationTriangle,
    bgColor: "bg-[#fef3c6]",
  },
  {
    label: "Delivered",
    value: 1,
    icon: FaRegCheckCircle,
    bgColor: "bg-[#dcfce7]",
  },
];

const inventoryAlerts = [
  {
    label: "Low Stock",
    value: 0,
    icon: FaExclamationTriangle,
    bgColor: "bg-[#ffe2e2]",
  },
  { label: "In Stock", value: 8, icon: FaArchive, bgColor: "bg-[#dcfce7]" },
  { label: "Categories", value: 4, icon: FaRegUser, bgColor: "bg-[#f3e8ff]" },
];

const storeStats = [
  { label: "Active Stores", value: "3", valueColor: "text-admin" },
  { label: "Total Stores", value: "3" },
  { label: "Avg Orders/Store", value: "1.0", valueColor: "#155dfc" },
];

export default function Dashboard() {
  return (
    <DashboardLayout
      userName="Admin User"
      userEmail="admin@mathachickens.com"
      stats={stats}
      executiveSummary={executiveSummary}
      orders={orders}
      orderStatuses={orderStatuses}
      inventoryAlerts={inventoryAlerts}
      storeStats={storeStats}
    />
  );
}
