import { Router } from "express";
import { payOrder } from "../controllers/orderPaymentController";

const router = Router();

router.post("/orders/:orderId/pay", payOrder);

export default router;
