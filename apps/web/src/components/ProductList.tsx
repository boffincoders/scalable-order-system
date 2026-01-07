import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import type { Product } from "../types/product";

interface Props {
  onSelect: (product: Product) => void;
}

export function ProductList({ onSelect }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p.productId}>
          <strong>{p.title}</strong> — Stock: {p.stock}
          <button onClick={() => onSelect(p)}>Buy</button>
        </div>
      ))}
    </div>
  );
}
