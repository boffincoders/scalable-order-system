import { OrderStatus, QUEUE_NAMES } from "@shared/contracts";
import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { Order } from "../models/Order";
import { releaseStock, reserveStock } from "../services/inventoryService";

new Worker(
  QUEUE_NAMES.ORDER_CREATED,
  async (job) => {
    const { orderId } = job.data;

    const order = await Order.findOne({ orderId });
    if (!order) return;

    // Idempotency: If already processed beyond PENDING, do nothing
    if (order.status !== OrderStatus.PENDING) return;

    const reserved: Array<{ productId: string; quantity: number }> = [];

    try {
      // Reserve each item
      for (const item of order.items) {
        const ok = await reserveStock(item.productId, item.quantity);
        if (!ok) {
          throw new Error(`Insufficient stock for ${item.productId}`);
        }
        reserved.push({ productId: item.productId, quantity: item.quantity });
      }

      // Update order state (inventory reserved)
      order.status = OrderStatus.INVENTORY_RESERVED;
      order.set("reservedItems", reserved);
      await order.save();

      console.log(`✅ Inventory reserved for order ${orderId}`);
    } catch (err: any) {
      // Compensation: release whatever we already reserved
      for (const r of reserved) {
        await releaseStock(r.productId, r.quantity);
      }

      order.status = OrderStatus.CANCELLED;
      order.cancelReason = err?.message || "Inventory reservation failed";
      order.set("reservedItems", []);
      await order.save();

      console.log(`❌ Order ${orderId} cancelled: ${order.cancelReason}`);
    }
  },
  { connection: redis }
);
