import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export type PartnerSalePaymentType = "cash" | "card" | "upi" | "cheque" | "other";

export interface PartnerSaleItem {
  id: number;
  sale_id: number;
  item_id: number | null;
  item_name: string;
  category: string | null;
  quantity: number;
  unit: string | null;
  unit_price: number;
  tax_percent: number;
  tax_amount: number;
  amount: number;
  is_adjustment: boolean;
}

export interface PartnerSale {
  id: number;
  store_id: number;
  partner_id: number;
  partner_name: string;
  invoice_no: string | null;
  sale_date: string;
  subtotal: number;
  total_amount: number;
  payment_type: PartnerSalePaymentType | null;
  received_amount: number;
  balance_due: number;
  source: "manual" | "imported";
  created_at: string;
}

export interface PartnerSaleDetail extends PartnerSale {
  sale_items: PartnerSaleItem[];
}

export interface CreatePartnerSaleItemInput {
  item_id?: number;
  item_name: string;
  quantity: number;
  unit?: string;
  unit_price: number;
  tax_percent?: number;
}

export interface CreatePartnerSaleInput {
  partner_id: number;
  sale_date: string;
  invoice_no?: string;
  payment_type?: PartnerSalePaymentType;
  received_amount?: number;
  items: CreatePartnerSaleItemInput[];
}

export interface PartnerSalesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  partner_id?: number;
}

export interface PartnerSaleListResponse extends ApiResponse<PartnerSale[]> {
  pagination: PaginationMeta;
}

export type PartnerSaleResponse = ApiResponse<PartnerSaleDetail>;
export type PartnerSaleCreateResponse = ApiResponse<{
  sale: PartnerSale;
  sale_items: PartnerSaleItem[];
}>;

export async function getPartnerSales(
  params?: PartnerSalesQueryParams,
): Promise<PartnerSaleListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.partner_id) searchParams.set("partner_id", String(params.partner_id));

  const query = searchParams.toString();
  return apiGet<PartnerSaleListResponse>(`/sales-entries${query ? `?${query}` : ""}`);
}

export async function getPartnerSale(id: number): Promise<PartnerSaleResponse> {
  return apiGet<PartnerSaleResponse>(`/sales-entries/${id}`);
}

export async function createPartnerSale(
  data: CreatePartnerSaleInput,
): Promise<PartnerSaleCreateResponse> {
  return apiPost<PartnerSaleCreateResponse>("/sales-entries", data);
}
