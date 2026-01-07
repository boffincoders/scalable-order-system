import { Request, Response } from "express";
import { createOrder, findOrderById } from "../services/orderService";

export async function placeOrder(req: Request, res: Response) {
  const idempotencyKey = req.header("Idempotency-Key");

  if (!idempotencyKey) {
    return res.status(400).json({
      error: "Idempotency-Key header is required",
    });
  }

  const items = req.body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "items are required",
    });
  }

  const order = await createOrder(items, idempotencyKey);

  return res.status(202).json({
    orderId: order.orderId,
    status: order.status,
  });
}

export async function getOrderById(req: Request, res: Response) {
  const { orderId } = req.params;

  const order = await findOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  return res.json({
    orderId: order.orderId,
    status: order.status,
    items: order.items,
  });
}
