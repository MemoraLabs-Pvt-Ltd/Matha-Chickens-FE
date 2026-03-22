import { apiGet } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";

export interface AdminDashboardData {
  kpis: {
    today_collection: { amount: number; change_percent: number | null };
    pending_revenue: { amount: number; orders_count: number };
    delivered_revenue: { amount: number; orders_count: number };
    total_orders: { count: number; change_percent: number | null };
  };
  executive_summary: {
    total_stock_value: number;
    pending_orders_count: number;
    delivered_orders_count: number;
    active_customers_count: number;
  };
  recent_orders: Array<{
    id: number;
    order_code: string;
    customer_name: string | null;
    customer_phone: string | null;
    store_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
  order_status_breakdown: {
    order_received: number;
    dispatched: number;
    delivered: number;
  };
  inventory_alerts: {
    available: number;
    low_stock: number;
    out_of_stock: number;
  };
  store_performance: {
    active_stores: number;
    total_stores: number;
  };
}

export interface StoreDashboardData {
  kpis: {
    today_collection: { amount: number; change_percent: number | null };
    online_orders: { amount: number; count: number };
    offline_bills: { amount: number; count: number };
    available_items: { available: number; out_of_stock: number };
  };
  recent_orders: Array<{
    id: number;
    order_code: string;
    customer_name: string | null;
    customer_phone: string | null;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
  order_status_breakdown: {
    order_received: number;
    dispatched: number;
    delivered: number;
  };
  inventory_status: {
    available: number;
    low_stock: number;
    out_of_stock: number;
    total_items: number;
  };
  today_performance: {
    orders_received: number;
    bills_generated: number;
    revenue: number;
  };
}

export type AdminDashboardResponse = ApiResponse<AdminDashboardData>;
export type StoreDashboardResponse = ApiResponse<StoreDashboardData>;

export interface DashboardQueryParams {
  /** ISO date YYYY-MM-DD; defaults to today on the server */
  date?: string;
}

export async function getAdminDashboard(
  params?: DashboardQueryParams,
): Promise<AdminDashboardResponse> {
  const searchParams = new URLSearchParams();
  if (params?.date) searchParams.set("date", params.date);
  const q = searchParams.toString();
  return apiGet<AdminDashboardResponse>(`/dashboard/admin${q ? `?${q}` : ""}`);
}

export async function getStoreDashboard(
  params?: DashboardQueryParams,
): Promise<StoreDashboardResponse> {
  const searchParams = new URLSearchParams();
  if (params?.date) searchParams.set("date", params.date);
  const q = searchParams.toString();
  return apiGet<StoreDashboardResponse>(`/dashboard/store${q ? `?${q}` : ""}`);
}
