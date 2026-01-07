import { Product } from "../models/Product";

export async function createProduct(input: {
  productId: string;
  title: string;
  stock: number;
}) {
  const existing = await Product.findOne({ productId: input.productId });
  if (existing) return existing;

  return Product.create(input);
}

export async function listProducts() {
  return Product.find().sort({ createdAt: -1 });
}

export async function updateStock(productId: string, newStock: number) {
  if (newStock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const product = await Product.findOneAndUpdate(
    { productId },
    { stock: newStock },
    { new: true }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}
