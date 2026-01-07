import { Router } from "express";
import {
  createProductController,
  listProductsController,
  updateStockController,
} from "../controllers/productController";

const router = Router();

router.post("/products", createProductController);
router.get("/products", listProductsController);
router.patch("/products/:productId/stock", updateStockController);

export default router;
