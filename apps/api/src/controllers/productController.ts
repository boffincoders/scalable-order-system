import { Request, Response } from "express";
import {
  createProduct,
  listProducts,
  updateStock,
} from "../services/productService";

export async function createProductController(req: Request, res: Response) {
  const { productId, title, stock } = req.body;

  if (!productId || !title || typeof stock !== "number") {
    return res
      .status(400)
      .json({ error: "productId, title, stock are required" });
  }

  if (stock < 0) {
    return res.status(400).json({ error: "stock must be >= 0" });
  }

  const product = await createProduct({ productId, title, stock });
  return res.status(201).json(product);
}

export async function listProductsController(_req: Request, res: Response) {
  const products = await listProducts();
  return res.json(products);
}

export async function updateStockController(req: Request, res: Response) {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    if (typeof stock !== "number") {
      return res.status(400).json({ error: "stock must be a number" });
    }

    const product = await updateStock(productId, stock);
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
