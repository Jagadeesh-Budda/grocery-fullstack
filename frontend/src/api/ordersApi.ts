import api from "./axios";
import { normalizeApiError } from "./apiError";

export type OrderCreateResponse = {
  orderId: string | number;
  totalAmount: number;
  status: string;
};

export type OrderSummaryResponse = {
  orderId: string | number;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export type OrderCreateErrorCode = "OUT_OF_STOCK" | "EMPTY_CART" | string;

export async function createOrder(): Promise<OrderCreateResponse> {
  try {
    const res = await api.post("/orders", undefined, { withCredentials: true });
    return res.data as OrderCreateResponse;
  } catch (e) {
    throw normalizeApiError(e);
  }
}

export async function getMyOrders(): Promise<OrderSummaryResponse[]> {
  try {
    const res = await api.get("/orders/me", { withCredentials: true });
    return res.data as OrderSummaryResponse[];
  } catch (e) {
    throw normalizeApiError(e);
  }
}
