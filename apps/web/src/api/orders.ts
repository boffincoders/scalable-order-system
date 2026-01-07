import axios from "axios";
import type { CustomerInfo } from "../types/customer";
import type { Order } from "../types/order";

const API_BASE = "http://localhost:4000/api";

export async function createOrder(
  items: Order["items"]
): Promise<{ orderId: string; status: string }> {
  const res = await axios.post(
    `${API_BASE}/orders`,
    { items },
    {
      headers: {
        "Idempotency-Key": crypto.randomUUID(),
      },
    }
  );

  return res.data;
}

export async function getOrder(orderId: string): Promise<Order> {
  const res = await axios.get<Order>(`${API_BASE}/orders/${orderId}`);
  return res.data;
}

export async function payOrder(
  orderId: string,
  customer: CustomerInfo
): Promise<{ clientSecret: string }> {
  const res = await axios.post(`${API_BASE}/orders/${orderId}/pay`, {
    customer,
  });

  return res.data;
}
