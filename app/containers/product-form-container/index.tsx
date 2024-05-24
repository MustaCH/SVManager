"use client";

import { useState, ChangeEvent, FormEvent } from "react";

import { Button, Divider, Input } from "@nextui-org/react";

interface FormData {
  name: string;
  price: number;
  measures: string[];
  category: string;
  pics: File[];
}

export default function ProductFormContainer() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0,
    measures: ["", "", "", ""],
    category: "",
    pics: [],
  });

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
    console.log("Nuevo estado de medidas:", newMeasures);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        pics: Array.from(e.target.files),
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data);
  };

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
      <div className="flex flex-col gap-4">
        <label>Medidas:</label>
        <div className="flex gap-4">
          {formData.measures.map((measure, index) => (
            <Input
              key={index}
              type="text"
              label={`Medida ${index + 1}`}
              value={measure}
              onChange={(e) => handleMeasureChange(index, e.target.value)}
            />
          ))}
        </div>
      </div>
      <Divider />
      <Input
        type="text"
        label="Categoria"
        name="category"
        value={formData.category}
        onChange={handleChange}
      />
      <Divider />
      {/* <Input type="file" label="Fotos" multiple onChange={handleFileChange} /> */}
      <Divider />
      <Button color="primary" onClick={handleSubmit}>
        Cargar producto
      </Button>
    </main>
  );
}
