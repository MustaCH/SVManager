"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Button,
  Divider,
  Image,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { IoMdClose } from "react-icons/io";

interface FormData {
  name: string;
  price: number;
  measures: string[];
  category: string;
  pics: File[];
  sets: { name: string; measures: string[] }[];
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
    sets: [],
  });

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [createdProduct, setCreatedProduct] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

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
      const newFiles = Array.from(e.target.files);
      setFormData((prevData) => ({
        ...prevData,
        pics: [...prevData.pics, ...newFiles],
      }));

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviews]);
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

  const handleDeleteImage = (index: number) => {
    setFormData((prevData) => {
      const newPics = [...prevData.pics];
      newPics.splice(index, 1);
      return { ...prevData, pics: newPics };
    });

    setPreviewImages((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const addNewSet = () => {
    setFormData((prevData) => ({
      ...prevData,
      sets: [...prevData.sets, { name: "", measures: ["", "", "", ""] }],
    }));
  };

  const handleSetNameChange = (index: number, value: string) => {
    const newSets = [...formData.sets];
    newSets[index].name = value;
    setFormData({ ...formData, sets: newSets });
  };

  const handleSetMeasureChange = (
    setIndex: number,
    measureIndex: number,
    value: string
  ) => {
    const newSets = [...formData.sets];
    newSets[setIndex].measures[measureIndex] = value;
    setFormData({ ...formData, sets: newSets });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price.toString());
    form.append("category", formData.category);
    formData.measures.forEach((measure, index) => {
      form.append(`measures[${index}]`, measure);
    });
    formData.pics.forEach((pic) => {
      form.append("pics", pic);
    });
    formData.sets.forEach((set, index) => {
      form.append(`sets[${index}][name]`, set.name);
      set.measures.forEach((measure, measureIndex) => {
        form.append(`sets[${index}][measures][${measureIndex}]`, measure);
      });
    });

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: form,
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
            label="Categoría"
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
            Seleccionar existente
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
        <div className="flex gap-4">
          {selectedCategory === "Sets" && (
            <div className="flex flex-col gap-4">
              {formData.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex flex-col gap-4">
                  <Input
                    type="text"
                    label={`Nombre prenda ${setIndex + 1}`}
                    value={set.name}
                    onChange={(e) =>
                      handleSetNameChange(setIndex, e.target.value)
                    }
                  />
                  <div className="flex gap-4">
                    {set.measures.map((measure, measureIndex) => (
                      <Input
                        key={measureIndex}
                        type="text"
                        label={`Medida ${measureIndex + 1}`}
                        value={measure}
                        onChange={(e) =>
                          handleSetMeasureChange(
                            setIndex,
                            measureIndex,
                            e.target.value
                          )
                        }
                      />
                    ))}
                  </div>
                  <Divider />
                </div>
              ))}
              <Button color="primary" onClick={addNewSet}>
                Agregar prenda
              </Button>
            </div>
          )}
          <div
            className={`${
              selectedCategory === "Sets" ? "hidden" : "flex gap-4"
            }`}
          >
            {selectedCategory === "Calzado" ? (
              <Select
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
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <label>Imágenes del producto:</label>
        <input type="file" name="pics" multiple onChange={handleFileChange} />
        <div className="flex gap-4 mt-4">
          {previewImages.map((src, index) => (
            <div key={index} className="relative">
              <Image
                isBlurred
                src={src}
                alt={`Preview ${index + 1}`}
                width="100"
              />
              <Button
                isIconOnly
                className="rounded-full absolute top-0 right-0 z-50 "
                color="danger"
                aria-label="delete"
                onClick={() => handleDeleteImage(index)}
              >
                <IoMdClose color="white" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <Button color="primary" onClick={handleSubmit}>
        Cargar producto
      </Button>
    </main>
  );
}
