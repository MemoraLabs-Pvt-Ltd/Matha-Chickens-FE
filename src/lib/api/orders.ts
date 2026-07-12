import { apiGet, apiPut } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export type OrderStatus =
  | "order_received"
  | "out_for_delivery"
  | "dispatched"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: number;
  store_id: number;
  store_name: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  status: OrderStatus;
  cancel_reason?: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  item_id: number;
  item_name: string;
  unit: string;
  price: number;
  gst_percent: number;
  discount_type: string;
  discount_value: number;
  quantity: number;
  total: number;
}

export interface OrderDetail extends Order {
  order_items: OrderItem[];
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  cancel_reason?: string;
}

export interface OrderListResponse extends ApiResponse<Order[]> {
  pagination: PaginationMeta;
}

export type OrderResponse = ApiResponse<OrderDetail>;
export type OrderUpdateResponse = ApiResponse<Order>;

function toPositiveInt(value: number | undefined, fallback: number): number {
  if (!value || !Number.isFinite(value)) return fallback;
  const rounded = Math.floor(value);
  return rounded > 0 ? rounded : fallback;
}

function toSafeLimit(value: number | undefined): number {
  const parsed = toPositiveInt(value, 20);
  return Math.min(parsed, 100);
}

export async function getOrders(params?: OrdersQueryParams): Promise<OrderListResponse> {
  const page = toPositiveInt(params?.page, 1);
  const limit = toSafeLimit(params?.limit);
  const search = params?.search?.trim();

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  if (search) searchParams.set("search", search);

  return apiGet<OrderListResponse>(`/orders?${searchParams.toString()}`);
}

export async function getOrder(id: number): Promise<OrderResponse> {
  return apiGet<OrderResponse>(`/orders/${id}`);
}

export async function updateOrderStatus(
  id: number,
  data: UpdateOrderStatusInput,
): Promise<OrderUpdateResponse> {
  return apiPut<OrderUpdateResponse>(`/orders/${id}`, data);
}
