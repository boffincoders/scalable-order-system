import { Express } from "express";
import orderPaymentRoutes from "./orderPaymentRoutes";
import orderRoutes from "./orderRoutes";
import productRoutes from "./productRoutes";
import stripeWebhookRoutes from "./stripeWebhookRoutes";
export function registerRoutes(app: Express) {
  app.use("/api", orderRoutes);
  app.use("/api", productRoutes);
  app.use("/api", orderPaymentRoutes);
  app.use("/api", stripeWebhookRoutes);
}
