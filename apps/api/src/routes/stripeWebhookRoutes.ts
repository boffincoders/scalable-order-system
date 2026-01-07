import { Router } from "express";
import { stripeWebhook } from "../controllers/stripeWebhookController";

const router = Router();

// IMPORTANT: raw body for Stripe
router.post(
  "/webhooks/stripe",
  require("express").raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
