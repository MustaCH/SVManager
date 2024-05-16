import { connectDB } from "@/data";
import Prod from "@/models/products";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Input,
} from "@nextui-org/react";

async function getProducts() {
  await connectDB();
  const products = await Prod.find();
  return products;
}

export default async function ProductFormContainer() {
  const products = await getProducts();
  console.log(products);

  return (
    <main className="flex flex-col gap-4 p-12">
      <Input type="text" label="Nombre" />
      <Divider />
      <Input type="number" label="Precio" />
      <Divider />
      <div className="flex flex-col gap-4">
        <label>Medidas:</label>
        <div className="flex gap-4">
          <Input type="text" label="Medida A" />
          <Input type="text" label="Medida B" />
          <Input type="text" label="Medida C" />
          <Input type="text" label="Medida D" />
        </div>
      </div>
      <Divider />
      <Input type="text" label="Categoria" />
      <Divider />
      <Input type="file" label="Fotos" />
      <Divider />
      <Button color="primary">Cargar producto</Button>
    </main>
  );
}
