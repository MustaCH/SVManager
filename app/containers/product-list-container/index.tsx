"use client";

import ProductListItem from "@/app/components/product-list-item";
import { Divider, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  measures: string[];
  category: string;
  pics: string[];
}

const ProductListContainer: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products"); // Ajusta la ruta según tu configuración
        const data = await response.json();
        console.log(data); // Verifica la estructura de los datos aquí
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid place-content-center">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col text-center">
        <h2 className="text-4xl font-semibold">Listado de productos</h2>
        <Divider className="my-4" />
      </div>
      <ProductListItem products={products} />;
    </>
  );
};

export default ProductListContainer;
