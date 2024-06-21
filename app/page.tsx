"use client";

import { ProductFormContainer, ProductListContainer } from "./containers";
import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  measures: string[];
  category: string;
  pics: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main>
      <ProductFormContainer products={products} />
      <ProductListContainer />
    </main>
  );
}
