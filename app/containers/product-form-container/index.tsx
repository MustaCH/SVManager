"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Button, Divider, Input, Select, SelectItem } from "@nextui-org/react";

interface FormData {
  name: string;
  price: number;
  measures: string[];
  category: string;
  pics: File[];
}

interface Product {
  _id: string;
  name: string;
  price: number;
  measures: string[];
  category: string;
  pics: string[];
}

interface ProductFormContainerProps {
  products?: Product[];
}

export default function ProductFormContainer({
  products: initialProducts = [],
}: ProductFormContainerProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0,
    measures: ["", "", "", ""],
    category: "",
    pics: [],
  });

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [createdProduct, setCreatedProduct] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialProducts.length > 0) {
      const existingCategories = Array.from(
        new Set(
          initialProducts.map((product) => product.category).filter(String)
        )
      );
      setCategories(existingCategories);
    }
  }, [products]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMeasureChange = (index: number, value: string) => {
    const newMeasures = [...formData.measures];
    newMeasures[index] = value;
    setFormData({
      ...formData,
      measures: newMeasures,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        pics: Array.from(e.target.files),
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    if (categories.includes(value)) {
      setSelectedCategory(value);
    } else {
      setCategories([...categories, value]);
      setSelectedCategory(value);
    }
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const category = showCategoryInput ? formData.category : formData.category;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("category", formData.category);
    formData.measures.forEach((measure, index) => {
      formDataToSend.append(`measures[${index}]`, measure);
    });
    formData.pics.forEach((pic, index) => {
      formDataToSend.append(`pics`, pic);
    });

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const shoeSizes = [];
  for (let i = 34; i <= 48; i += 0.5) {
    shoeSizes.push(i.toFixed(1));
  }

  return (
    <main className="flex flex-col gap-4 p-12">
      <div className="flex flex-col text-center">
        <h2 className="text-4xl font-semibold">Crear producto</h2>
        <Divider className="my-4" />
      </div>
      <Input
        type="text"
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <Divider />
      <Input
        type="number"
        label="Precio"
        name="price"
        value={formData.price.toString()}
        onChange={handleChange}
      />
      <Divider />
      {categories.length === 0 || showCategoryInput ? (
        <div className="flex items-center gap-6">
          <Input
            type="text"
            label="Crear categoría"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          <Button
            color="primary"
            variant="bordered"
            disabled={categories.length === 0}
            onClick={() => setShowCategoryInput(false)}
          >
            Seleccionar
            <br /> existente
          </Button>
        </div>
      ) : (
        <div className="flex gap-6 items-center">
          {!showCategoryInput && (
            <>
              <Select
                placeholder="Selecciona una categoría"
                size="lg"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </Select>
              <Button
                color="primary"
                variant="bordered"
                onClick={() => setShowCategoryInput(true)}
              >
                Crear Categoría
              </Button>
            </>
          )}
        </div>
      )}
      <Divider />
      <div className="flex flex-col gap-4">
        <label>{selectedCategory === "Calzado" ? "Talle:" : "Medidas:"}</label>
        <div className="grid grid-cols-2 gap-4">
          {selectedCategory === "Calzado" ? (
            <Select
              className="col-span-2"
              placeholder="Selecciona talle"
              value={formData.measures[0]}
              onChange={(e) => handleMeasureChange(0, e.target.value)}
            >
              {shoeSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </Select>
          ) : (
            formData.measures.map((measure, index) => (
              <Input
                key={index}
                type="text"
                label={`Medida ${index + 1}`}
                value={measure}
                onChange={(e) => handleMeasureChange(index, e.target.value)}
              />
            ))
          )}
        </div>
      </div>
      <Divider />
      <label htmlFor="pictures">Fotos de producto</label>
      <input
        id="pictures"
        name="pictures"
        aria-label="pictures"
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <Divider />
      <Button color="primary" onClick={handleSubmit}>
        Cargar producto
      </Button>
    </main>
  );
}
