import { OrderStatus } from "@shared/contracts";
import { stripe } from "../config/stripe";
import { Order } from "../models/Order";

interface CustomerInput {
  name: string;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
}

export async function createPaymentIntent(
  orderId: string,
  customer: CustomerInput
) {
  const order = await Order.findOne({ orderId });
  if (!order) throw new Error("Order not found");

  if (
    order.status !== OrderStatus.INVENTORY_RESERVED &&
    order.status !== OrderStatus.PAYMENT_PENDING
  ) {
    throw new Error("Order not ready for payment");
  }

  // 1️⃣ Create or reuse Stripe customer
  let stripeCustomerId = order.stripeCustomerId;

  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      name: customer.name,
      address: {
        line1: customer.address.line1,
        line2: customer.address.line2,
        city: customer.address.city,
        state: customer.address.state,
        postal_code: customer.address.postalCode,
        country: customer.address.country,
      },
      metadata: {
        orderId: order.orderId,
      },
    });

    stripeCustomerId = stripeCustomer.id;
    order.stripeCustomerId = stripeCustomerId;
  }

  // 2️⃣ Idempotency: reuse PaymentIntent if already created
  if (order.paymentIntentId) {
    const intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
    return intent.client_secret;
  }

  // 3️⃣ Create PaymentIntent (India compliant)
  const amountInPaise = 500 * 100;

  const intent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: "inr",

    description: `Order ${order.orderId} – Digital services purchase`,

    customer: stripeCustomerId,

    metadata: {
      orderId: order.orderId,
      purpose: "E-commerce export payment",
    },
  });

  order.paymentIntentId = intent.id;
  order.status = OrderStatus.PAYMENT_PENDING;
  await order.save();

  return intent.client_secret;
}
