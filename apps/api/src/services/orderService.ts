import { OrderItem, OrderStatus } from "@shared/contracts";
import { randomUUID } from "crypto";
import { Order } from "../models/Order";
import { orderQueue } from "../queues/orderQueue";

export async function createOrder(items: OrderItem[], idempotencyKey: string) {
  // 1. Idempotency check
  const existingOrder = await Order.findOne({ idempotencyKey });
  if (existingOrder) {
    return existingOrder;
  }

  // 2. Create order
  const order = await Order.create({
    orderId: randomUUID(),
    items,
    status: OrderStatus.PENDING,
    idempotencyKey,
  });

  // 3. Push to queue
  await orderQueue.add("order.created", {
    orderId: order.orderId,
  });

  return order;
}

export async function findOrderById(orderId: string) {
  return Order.findOne({ orderId });
}
