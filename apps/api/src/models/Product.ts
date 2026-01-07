import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productId: { type: String, unique: true, index: true },
    title: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
