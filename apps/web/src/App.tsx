import { useState } from "react";
import { OrderStatus } from "./components/OrderStatus";
import { payOrder } from "./api/orders";
import { CheckoutForm } from "./components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./stripe/stripe";
import { ProductList } from "./components/ProductList";
import type { Product } from "./types/product";

export function App() {
  const [orderId, setOrderId] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string>();

  async function handleBuy(product: Product) {
    const order = await fetch("http://localhost:4000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        items: [{ productId: product.productId, quantity: 1 }],
      }),
    }).then((r) => r.json());

    setOrderId(order.orderId);
  }

  async function handlePay() {
    if (!orderId) return;
    const res = await payOrder(orderId, {
      name: "Rahul Sharma",
      address: {
        line1: "123 MG Road",
        city: "Bengaluru",
        state: "KA",
        postalCode: "560001",
        country: "IN",
      },
    });

    setClientSecret(res.clientSecret);
  }

  return (
    <div>
      <h1>E-commerce Demo</h1>

      <ProductList onSelect={handleBuy} />

      {orderId && <OrderStatus orderId={orderId} />}

      {orderId && !clientSecret && (
        <button onClick={handlePay}>Proceed to Pay</button>
      )}

      {clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}
