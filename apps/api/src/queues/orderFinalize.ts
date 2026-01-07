import { QUEUE_NAMES } from "@shared/contracts";
import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const orderFinalizeQueue = new Queue(QUEUE_NAMES.ORDER_FINALIZE, {
  connection: redis,
});
