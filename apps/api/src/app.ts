import cors from "cors";
import express from "express";
import { registerRoutes } from "./routes";

export const app = express();

// global middlewares
app.use(cors());
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));

app.use(express.json());

// health check (important for infra & load balancers)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// register all routes
registerRoutes(app);
