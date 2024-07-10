import { connectDB } from "@/data";
import Prod from "@/models/products";
import { NextRequest, NextResponse } from "next/server";
import formidable, { Fields, Files, IncomingForm } from "formidable";
import { Readable } from "stream";
import { IncomingMessage } from "http";

export async function GET() {
  await connectDB();

  const products = await Prod.find();
  console.log(products);
  return NextResponse.json(products, { status: 200 });
}

export const dynamic = "auto";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

// Helper function to convert NextRequest to IncomingMessage
async function convertNextRequestToIncomingMessage(
  req: NextRequest
): Promise<IncomingMessage> {
  const { headers, method } = req;
  const body = await req.text();
  const readable = new Readable();

  readable._read = () => {};
  readable.push(Buffer.from(body));
  readable.push(null);

  const incomingMessage = Object.assign(readable, {
    headers: Object.fromEntries(headers.entries()),
    method,
  });

  return incomingMessage as IncomingMessage;
}

export async function POST(req: NextRequest) {
  await connectDB();

  const incomingMessage = await convertNextRequestToIncomingMessage(req);

  const form = new IncomingForm({
    uploadDir: "./public/uploads",
    keepExtensions: true,
  });

  return new Promise((resolve) => {
    form.parse(
      incomingMessage,
      async (err: any, fields: Fields, files: Files) => {
        if (err) {
          console.error(err);
          return resolve(
            NextResponse.json({ error: err.message }, { status: 500 })
          );
        }

        try {
          const name = Array.isArray(fields.name)
            ? fields.name[0]
            : fields.name;
          const price = Array.isArray(fields.price)
            ? fields.price[0]
            : fields.price;
          const category = Array.isArray(fields.category)
            ? fields.category[0]
            : fields.category;

          // Ensure measures is a string before calling split
          const measures = Array.isArray(fields.measures)
            ? fields.measures
            : typeof fields.measures === "string"
            ? fields.measures
            : [];

          if (!name || !price || !category) {
            return resolve(
              NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
              )
            );
          }

          const data = {
            name: name as string,
            price: parseFloat(price as string),
            measures: measures as string[],
            category: category as string,
            pics: Object.values(files).map((file: any) => file.filepath),
          };

          const product = await Prod.create(data);
          console.log(data);
          return resolve(NextResponse.json(product, { status: 201 }));
        } catch (error: any) {
          console.error(error);
          return resolve(
            NextResponse.json({ error: error.message }, { status: 500 })
          );
        }
      }
    );
  });
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  try {
    const product = await Prod.deleteOne(data);
    console.log(data);
    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
