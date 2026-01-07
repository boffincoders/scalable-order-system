import { useEffect, useState } from "react";
import { getOrder } from "../api/orders";
import type { Order } from "../types/order";

interface Props {
  orderId: string;
}

export function OrderStatus({ orderId }: Props) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const timer = setInterval(async () => {
      const data = await getOrder(orderId);
      setOrder(data);
    }, 2000);

    return () => clearInterval(timer);
  }, [orderId]);

  if (!order) return <p>Loading order...</p>;

  return (
    <div>
      <h3>Order Status</h3>
      <p>Status: {order.status}</p>
    </div>
  );
}
