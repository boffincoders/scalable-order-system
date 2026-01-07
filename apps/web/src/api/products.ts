import axios from "axios";
import type { Product } from "../types/product";

const API_BASE = "http://localhost:4000/api";

export async function fetchProducts(): Promise<Product[]> {
  const res = await axios.get<Product[]>(`${API_BASE}/products`);
  return res.data;
}
