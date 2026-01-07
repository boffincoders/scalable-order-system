export type OrderStatus =
  | "PENDING"
  | "INVENTORY_RESERVED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "CONFIRMED"
  | "CANCELLED";

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  status: OrderStatus;
  items: OrderItem[];
}
