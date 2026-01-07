import { OrderItem } from "./order-item";
import { OrderStatus } from "./order-status";

export interface OrderContract {
  orderId: string;
  items: OrderItem[];
  status: OrderStatus;
  idempotencyKey: string;
}
