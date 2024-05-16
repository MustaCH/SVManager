import { connectDB } from "@/data";
import Prod from "@/models/products";

async function getProducts() {
  await connectDB();
  const products = await Prod.find();
  return products;
}

export default async function ProductFormContainer() {
  const products = await getProducts();
  console.log(products);

  return (
    <div>
      <p></p>
    </div>
  );
}
