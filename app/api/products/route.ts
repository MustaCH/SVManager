import { connectDB } from "@/data";
import Prod from "@/models/products";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import { parse } from "url";
import busboy from "busboy";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  await connectDB();

  const products = await Prod.find();
  console.log(products);
  return NextResponse.json(products, { status: 200 });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  await connectDB();

  const parsedUrl = parse(req.url || "", true);
  const query = parsedUrl.query;

  const chunks: Uint8Array[] = [];
  for await (const chunk of req.body as any) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Unsupported content type" },
      { status: 400 }
    );
  }

  return new Promise((resolve, reject) => {
    const fields: any = {};
    const filePromises: Promise<string>[] = [];
    const bb = busboy({ headers: { "content-type": contentType } });

    bb.on(
      "file",
      (
        name: string,
        file: Readable,
        info: { filename: string; encoding: string; mimeType: string }
      ) => {
        const { filename, mimeType } = info;
        const fileChunks: Buffer[] = [];

        file.on("data", (chunk: Buffer) => {
          fileChunks.push(chunk);
        });

        file.on("end", async () => {
          const fileBuffer = Buffer.concat(fileChunks);
          const filePromise = new Promise<string>((resolve, reject) => {
            cloudinary.v2.uploader
              .upload_stream(
                { resource_type: "image" },
                (error, result: any) => {
                  if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                  }
                  resolve(result.secure_url);
                }
              )
              .end(fileBuffer);
          });

          filePromises.push(filePromise);
        });
      }
    );

    bb.on("field", (name: string, value: string) => {
      if (name.startsWith("measures[") && name.endsWith("]")) {
        if (!fields.measures) {
          fields.measures = [];
        }
        fields.measures.push(value);
      } else {
        fields[name] = value;
      }
    });

    bb.on("close", async () => {
      try {
        if (!fields.name || !fields.price || !fields.category) {
          return resolve(
            NextResponse.json(
              { error: "Missing required fields" },
              { status: 400 }
            )
          );
        }

        const picUrls = await Promise.all(filePromises);

        const data = {
          name: fields.name,
          price: parseFloat(fields.price),
          measures: fields.measures || [],
          category: fields.category,
          pics: picUrls,
        };

        console.log("Data to be saved:", data);

        const product = await Prod.create(data);
        console.log("Product created:", product);
        resolve(NextResponse.json(product, { status: 201 }));
      } catch (error) {
        console.error("Error processing POST request:", error);
        resolve(
          NextResponse.json({ error: (error as any).message }, { status: 500 })
        );
      }
    });

    bb.on("error", (error: any) => {
      console.error("Error parsing form data:", error);
      reject(
        NextResponse.json(
          { error: "Failed to parse form data" },
          { status: 500 }
        )
      );
    });

    bb.end(buffer);
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
