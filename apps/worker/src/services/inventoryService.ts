import { Product } from "../models/Product";

/**
 * Atomically reserves stock:
 * - Only succeeds if stock >= qty
 * - Decrements stock by qty
 * Safe under concurrency (prevents overselling).
 */
export async function reserveStock(productId: string, qty: number) {
  const updated = await Product.findOneAndUpdate(
    { productId, stock: { $gte: qty } },
    { $inc: { stock: -qty } },
    { new: true }
  );

  return updated; // null means not enough stock
}

/**
 * Releases previously reserved stock (compensation).
 */
export async function releaseStock(productId: string, qty: number) {
  await Product.findOneAndUpdate(
    { productId },
    { $inc: { stock: qty } },
    { new: true }
  );
}
