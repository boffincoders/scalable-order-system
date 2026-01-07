import { OrderStatus, QUEUE_NAMES } from "@shared/contracts";
import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { Order } from "../models/Order";

new Worker(
  QUEUE_NAMES.ORDER_FINALIZE,
  async (job) => {
    const { orderId } = job.data;
    const order = await Order.findOne({ orderId });

    if (!order) return;
    if (order.status !== OrderStatus.PAID) return;

    order.status = OrderStatus.CONFIRMED;
    await order.save();

    console.log(`✅ Order ${orderId} confirmed`);
  },
  { connection: redis }
);
