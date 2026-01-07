import { OrderStatus } from "@shared/contracts";
import { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { Order } from "../models/Order";
import { orderFinalizeQueue } from "../queues/orderFinalize";

export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"]!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle payment success
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as any;
    const orderId = intent.metadata.orderId;

    const order = await Order.findOne({ orderId });
    if (order && order.status === OrderStatus.PAYMENT_PENDING) {
      order.status = OrderStatus.PAID;
      order.paymentStatus = "PAID";
      await order.save();
      await orderFinalizeQueue.add(
        "finalize-order",
        { orderId },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
        }
      );
    }
  }

  res.json({ received: true });
}
