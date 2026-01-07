import { Router } from "express";
import { getOrderById, placeOrder } from "../controllers/orderController";

const router = Router();

// create order
router.post("/orders", placeOrder);

// get order status
router.get("/orders/:orderId", getOrderById);

export default router;
