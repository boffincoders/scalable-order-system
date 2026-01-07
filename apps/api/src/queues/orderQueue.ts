import { QUEUE_NAMES } from "@shared/contracts";
import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const orderQueue = new Queue(QUEUE_NAMES.ORDER_CREATED, {
  connection: redis,
});
