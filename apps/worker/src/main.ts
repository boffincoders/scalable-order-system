import "dotenv/config";
import { connectMongo } from "./config/mongo";
import "./workers/orderFinalizer";
import "./workers/orderWorker";

async function start() {
  await connectMongo();
  console.log("Worker started");
}

start();
