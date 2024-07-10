import { connectDB } from "@/data";
import Prod from "@/models/products";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { promisify } from "util";
import { pipeline } from "stream";

const upload = multer({ dest: "./public/uploads" });

const pipelineAsync = promisify(pipeline);

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

// Extend the NextApiRequest interface to include the files property
interface NextApiRequestWithFiles extends NextApiRequest {
  files: Express.Multer.File[];
}

const parseFormData = (
  req: NextApiRequestWithFiles,
  res: NextApiResponse
): Promise<CustomFormData> => {
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

    // Create a wrapper function for the multer middleware
    const multerMiddleware = upload.fields([{ name: "pics", maxCount: 5 }]);

    // Use the multer middleware
    multerMiddleware(req as any, res as any, (err: any) => {
      if (err) {
        reject(err);
        return;
      }

      for (const fieldname in req.body) {
        form.append(fieldname, req.body[fieldname]);
      }

      if (req.files) {
        (req.files as Express.Multer.File[]).forEach((file) => {
          form.append("pics", file.path);
        });
      }

      resolve(form);
    });
  });
};

export async function POST(req: NextApiRequestWithFiles, res: NextApiResponse) {
  await connectDB();

  try {
    const form = await parseFormData(req, res);
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
