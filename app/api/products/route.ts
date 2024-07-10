import { connectDB } from "@/data";
import Prod from "@/models/products";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET() {
  await connectDB();

  const products = await Prod.find();
  console.log(products);
  return NextResponse.json(products);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

interface CustomFormData {
  fields: Map<string, string>;
  files: Map<string, string>;
  get(name: string): string | null;
  getAll(name: string): string[];
  append(name: string, value: any): void;
}

const parseFormData = (req: NextApiRequest): Promise<CustomFormData> => {
  return new Promise((resolve, reject) => {
    const form: CustomFormData = {
      fields: new Map<string, string>(),
      files: new Map<string, string>(),
      get(name: string): string | null {
        return this.fields.get(name) || null;
      },
      getAll(name: string): string[] {
        return this.files.get(name) ? [this.files.get(name)!] : [];
      },
      append(name: string, value: any): void {
        if (typeof value === "string") {
          this.fields.set(name, value);
        } else {
          this.files.set(name, value);
        }
      },
    };
  });
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const form = await parseFormData(req);
    const data = {
      name: form.get("name") as string,
      price: parseFloat(form.get("price") as string),
      measures: form.getAll("measures") as string[],
      category: form.get("category") as string,
      pics: form.getAll("pics") as string[],
    };

    const product = await Prod.create(data);
    console.log(data);
    return res.status(201).json(product);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  const product = await Prod.deleteOne(data);
  console.log(data);
  return NextResponse.json(product);
}
