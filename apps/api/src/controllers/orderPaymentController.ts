import { Request, Response } from "express";
import { createPaymentIntent } from "../services/orderPaymentService";

export async function payOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const { customer } = req.body;

    if (!customer?.name || !customer?.address?.country) {
      return res.status(400).json({
        error:
          "Customer name and address (country) are required for export payments",
      });
    }

    const clientSecret = await createPaymentIntent(orderId, customer);
    res.json({ clientSecret });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
